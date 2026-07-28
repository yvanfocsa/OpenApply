import { createHash } from "node:crypto";
import http from "node:http";
import https from "node:https";
import { URL } from "node:url";
import { classifyJob } from "./job-classifier.mjs";

export const SOURCING_PROVIDERS = [
  {
    id: "francetravail",
    name: "France Travail",
    access: "credentials",
    description: "Offres actives officielles et offres partenaires en temps réel.",
  },
  {
    id: "labonnealternance",
    name: "La Bonne Alternance",
    access: "token",
    description: "Alternances mises à jour chaque jour avec date d’expiration.",
  },
  {
    id: "greenhouse",
    name: "Greenhouse",
    access: "public",
    description: "Offres publiées sur les sites carrières Greenhouse suivis.",
  },
  {
    id: "lever",
    name: "Lever",
    access: "public",
    description: "Offres publiées sur les sites carrières Lever suivis.",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    access: "restricted",
    description: "API réservée aux partenaires LinkedIn Talent Solutions.",
  },
  {
    id: "wttj",
    name: "Welcome to the Jungle",
    access: "manual",
    description: "Aucune API publique de recherche candidat disponible.",
  },
];

export const DEFAULT_CYBER_ATS_SOURCES = [
  { type: "greenhouse", token: "datadog", company: "Datadog", region: "global" },
  { type: "greenhouse", token: "cloudflare", company: "Cloudflare", region: "global" },
  { type: "greenhouse", token: "wizinc", company: "Wiz", region: "global" },
];

const DEFAULT_TIMEOUT_MS = 12_000;
const MAX_JSON_BYTES = 12 * 1024 * 1024;
const TRACKING_PARAMETERS = [
  "gh_jid",
  "lever-source",
  "source",
  "src",
  "ref",
  "referrer",
  "utm_campaign",
  "utm_content",
  "utm_medium",
  "utm_source",
  "utm_term",
];

function decodeHtmlEntities(value) {
  const named = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: "\"",
  };
  return String(value || "")
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&([a-z]+);/gi, (match, name) => named[name.toLowerCase()] ?? match);
}

function sanitizeText(value) {
  return decodeHtmlEntities(String(value || "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " "))
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizedText(value) {
  return sanitizeText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr");
}

function stableId(value) {
  return createHash("sha256").update(String(value || "")).digest("hex").slice(0, 20);
}

function safeDate(value) {
  if (value === null || value === undefined || value === "") return "";
  const date = typeof value === "number" ? new Date(value) : new Date(String(value));
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

export function canonicalUrl(value) {
  try {
    const parsed = new URL(String(value || ""));
    parsed.hash = "";
    TRACKING_PARAMETERS.forEach((parameter) => parsed.searchParams.delete(parameter));
    parsed.pathname = parsed.pathname.replace(/\/+$/, "") || "/";
    return parsed.toString();
  } catch {
    return "";
  }
}

function jobPostingUrl(value, title) {
  try {
    const parsed = new URL(String(value || ""));
    if (!parsed.pathname.includes("/:title")) return parsed.toString();
    const slug = normalizedText(title)
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 100) || "poste";
    parsed.pathname = parsed.pathname.replace("/:title", `/${slug}`);
    return parsed.toString();
  } catch {
    return value;
  }
}

function contractFromText(value) {
  const text = normalizedText(value);
  if (/\b(alternance|apprentissage|apprenti|work study|working student|professionalisation)\b/.test(text)) {
    return "alternance";
  }
  if (/\b(cdi|permanent|full time|full-time|indefinite)\b/.test(text)) return "cdi";
  return "ambiguous";
}

function workModeFromText(value) {
  const text = normalizedText(value);
  if (/\b(fully remote|full remote|100% remote|teletravail complet)\b/.test(text)) return "remote";
  if (/\b(hybrid|hybride|teletravail|remote)\b/.test(text)) return "hybrid";
  if (/\b(on-site|onsite|sur site|presentiel)\b/.test(text)) return "onsite";
  return "unspecified";
}

function queryTerms(query) {
  return [...new Set(normalizedText(query)
    .split(/[,;|\n]+|\s+/)
    .map((term) => term.trim())
    .filter((term) => term.length >= 3))];
}

function matchesQuery(job, query, { includeDescription = true } = {}) {
  const terms = queryTerms(query);
  if (!terms.length) return true;
  const haystack = normalizedText([
    job.title,
    job.company,
    includeDescription ? job.description : "",
    job.department,
    job.team,
  ].filter(Boolean).join(" "));
  return terms.some((term) => {
    if (term.length > 4 || term.includes(" ")) return haystack.includes(term);
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(?:^|[^a-z0-9])${escaped}(?:$|[^a-z0-9])`, "i").test(haystack);
  });
}

function matchesLocation(job, location) {
  const wanted = normalizedText(location);
  if (!wanted) return true;
  const actual = normalizedText(job.location);
  if (!actual) return true;
  if (wanted === "france" && ["francetravail", "labonnealternance"].includes(job.sourceId)) return true;
  if (wanted === "ile-de-france" || wanted === "ile de france") {
    return actual.includes("paris") || actual.includes("france") || actual.includes("remote");
  }
  return wanted.split(/[,;|]+/).some((part) => part.trim() && actual.includes(part.trim()));
}

function matchesContract(job, contract) {
  if (!["cdi", "alternance"].includes(contract)) return true;
  if (job.contract === contract) return true;
  return contract === "cdi" && job.contract === "ambiguous";
}

function matchesSeniority(job, seniority) {
  if (seniority !== "entry") return true;
  return ["student", "junior", "unspecified"].includes(job.classification?.seniority);
}

function matchesFamily(job, families) {
  if (!Array.isArray(families) || !families.length) return true;
  const detected = [
    job.classification?.family?.id,
    ...(job.classification?.secondaryFamilies || []).map((family) => family.id),
  ].filter(Boolean);
  return detected.some((family) => families.includes(family));
}

function normalizedJob(input) {
  const url = canonicalUrl(input.url || input.applyUrl);
  const applyUrl = canonicalUrl(input.applyUrl || input.url);
  const title = sanitizeText(input.title) || "Poste sans intitulé";
  const company = sanitizeText(input.company) || "Entreprise non publiée";
  const location = sanitizeText(input.location);
  const description = sanitizeText(input.description).slice(0, 12_000);
  const contract = ["cdi", "alternance", "ambiguous"].includes(input.contract)
    ? input.contract
    : contractFromText(`${title} ${description}`);
  const workMode = ["remote", "hybrid", "onsite", "unspecified"].includes(input.workMode)
    ? input.workMode
    : workModeFromText(`${input.workMode || ""} ${location} ${description}`);
  const sourceId = String(input.sourceId || "source");
  const externalId = String(input.externalId || "");
  const fingerprint = normalizedText(`${company}|${title}|${location}`);
  const classification = classifyJob({
    title,
    description: `${description}\n${input.department || ""}\n${input.team || ""}`,
  }, contract === "ambiguous" ? {} : { contractOverride: contract });
  return {
    id: stableId(`${fingerprint}|${url || `${sourceId}:${externalId}`}`),
    sourceId,
    sourceName: String(input.sourceName || sourceId),
    sources: [String(input.sourceName || sourceId)],
    externalId,
    title,
    company,
    location,
    department: sanitizeText(input.department),
    team: sanitizeText(input.team),
    contract,
    workMode,
    url,
    applyUrl,
    description,
    publishedAt: safeDate(input.publishedAt),
    updatedAt: safeDate(input.updatedAt),
    expiresAt: safeDate(input.expiresAt),
    verifiedAt: new Date().toISOString(),
    active: input.active !== false,
    classification,
  };
}

function jobPreference(job) {
  if (/^greenhouse:|^lever:/.test(job.sourceId)) return 4;
  if (job.sourceId === "francetravail") return 3;
  if (job.sourceId === "labonnealternance") return 2;
  return 1;
}

export function deduplicateJobs(jobs, limit = 120) {
  const byKey = new Map();
  for (const rawJob of jobs) {
    const job = rawJob?.classification ? rawJob : normalizedJob(rawJob || {});
    if (!job.url || !job.active) continue;
    const key = normalizedText(`${job.company}|${job.title}|${job.location}`);
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, job);
      continue;
    }
    const preferred = jobPreference(job) > jobPreference(existing) ? job : existing;
    preferred.sources = [...new Set([...(existing.sources || []), ...(job.sources || [])])];
    preferred.publishedAt = [existing.publishedAt, job.publishedAt].filter(Boolean).sort()[0] || "";
    preferred.updatedAt = [existing.updatedAt, job.updatedAt].filter(Boolean).sort().at(-1) || "";
    byKey.set(key, preferred);
  }
  return [...byKey.values()]
    .sort((first, second) => {
      const firstDate = first.updatedAt || first.publishedAt || first.verifiedAt;
      const secondDate = second.updatedAt || second.publishedAt || second.verifiedAt;
      return secondDate.localeCompare(firstDate) || first.title.localeCompare(second.title, "fr");
    })
    .slice(0, Math.max(1, Math.min(200, Number(limit) || 120)));
}

function atsSourceFromUrl(value) {
  try {
    const url = new URL(value);
    const segments = url.pathname.split("/").filter(Boolean);
    if (["boards.greenhouse.io", "job-boards.greenhouse.io"].includes(url.hostname)) {
      return segments[0] ? { type: "greenhouse", token: segments[0], company: segments[0], region: "global" } : null;
    }
    if (url.hostname === "jobs.lever.co" || url.hostname === "jobs.eu.lever.co") {
      return segments[0]
        ? {
            type: "lever",
            token: segments[0],
            company: segments[0],
            region: url.hostname === "jobs.eu.lever.co" ? "eu" : "global",
          }
        : null;
    }
  } catch {}
  return null;
}

export function validateAtsSources(values) {
  const entries = Array.isArray(values)
    ? values
    : String(values || "").split(/\r?\n|,/);
  const sources = [];
  const invalid = [];
  for (const rawValue of entries) {
    if (rawValue && typeof rawValue === "object" && ["greenhouse", "lever"].includes(rawValue.type)) {
      const token = String(rawValue.token || "").trim();
      if (/^[a-z0-9._-]{2,80}$/i.test(token)) {
        sources.push({
          type: rawValue.type,
          token,
          company: sanitizeText(rawValue.company || token).slice(0, 80),
          region: rawValue.region === "eu" ? "eu" : "global",
        });
      } else {
        invalid.push(String(rawValue.company || rawValue.token || rawValue.type));
      }
      continue;
    }
    const value = String(rawValue || "").trim();
    if (!value) continue;
    const fromUrl = atsSourceFromUrl(value);
    if (fromUrl) {
      sources.push(fromUrl);
      continue;
    }
    const shorthand = value.match(/^(greenhouse|lever):([a-z0-9._-]{2,80})$/i);
    if (shorthand) {
      sources.push({
        type: shorthand[1].toLowerCase(),
        token: shorthand[2],
        company: shorthand[2],
        region: "global",
      });
      continue;
    }
    invalid.push(value);
  }
  const unique = new Map(sources.map((source) => [`${source.type}:${source.region}:${source.token}`, source]));
  return {
    sources: [...unique.values()].slice(0, 30),
    invalid: [...new Set(invalid)].slice(0, 20),
  };
}

export function parseAtsSources(values) {
  return validateAtsSources(values).sources;
}

async function fetchJson(url, {
  method = "GET",
  headers = {},
  body = undefined,
  timeoutMs = DEFAULT_TIMEOUT_MS,
} = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method,
      headers: {
        Accept: "application/json",
        "User-Agent": "OpenApply/1.0",
        ...headers,
      },
      body,
      signal: controller.signal,
    });
    const text = await response.text();
    if (text.length > MAX_JSON_BYTES) throw new Error("Réponse trop volumineuse.");
    if (!response.ok) {
      const detail = text.slice(0, 240).replace(/\s+/g, " ").trim();
      throw new Error(`HTTP ${response.status}${detail ? `, ${detail}` : ""}`);
    }
    return text ? JSON.parse(text) : {};
  } finally {
    clearTimeout(timeout);
  }
}

async function searchGreenhouseSource(source, filters) {
  const endpoint = `https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(source.token)}/jobs?content=true`;
  const payload = await fetchJson(endpoint);
  const jobs = Array.isArray(payload.jobs) ? payload.jobs : [];
  return jobs
    .map((job) => normalizedJob({
      sourceId: `greenhouse:${source.token}`,
      sourceName: `Greenhouse, ${source.company}`,
      externalId: job.id,
      title: job.title,
      company: source.company,
      location: job.location?.name,
      department: Array.isArray(job.departments) ? job.departments.map((item) => item.name).join(", ") : "",
      description: [
        job.content,
        Array.isArray(job.metadata)
          ? job.metadata.map((item) => `${item.name || ""} ${item.value || ""}`).join(" ")
          : "",
      ].filter(Boolean).join(" "),
      url: jobPostingUrl(job.absolute_url, job.title),
      applyUrl: jobPostingUrl(job.absolute_url, job.title),
      updatedAt: job.updated_at,
      contract: contractFromText(`${job.title} ${JSON.stringify(job.metadata || [])}`),
    }))
    .filter((job) => matchesQuery(job, filters.query, { includeDescription: false }))
    .filter((job) => matchesLocation(job, filters.location))
    .filter((job) => matchesContract(job, filters.contract))
    .filter((job) => matchesSeniority(job, filters.seniority))
    .filter((job) => matchesFamily(job, filters.families));
}

async function searchLeverSource(source, filters) {
  const host = source.region === "eu" ? "api.eu.lever.co" : "api.lever.co";
  const endpoint = `https://${host}/v0/postings/${encodeURIComponent(source.token)}?mode=json`;
  const payload = await fetchJson(endpoint);
  const jobs = Array.isArray(payload) ? payload : [];
  return jobs
    .map((job) => normalizedJob({
      sourceId: `lever:${source.token}`,
      sourceName: `Lever, ${source.company}`,
      externalId: job.id,
      title: job.text,
      company: source.company,
      location: job.categories?.location || job.categories?.allLocations?.join(", "),
      department: job.categories?.department,
      team: job.categories?.team,
      description: [
        job.descriptionPlain,
        job.openingPlain,
        ...(Array.isArray(job.lists) ? job.lists.map((item) => `${item.text || ""} ${sanitizeText(item.content)}`) : []),
      ].filter(Boolean).join(" "),
      url: job.hostedUrl,
      applyUrl: job.applyUrl || job.hostedUrl,
      publishedAt: job.createdAt,
      workMode: job.workplaceType === "on-site" ? "onsite" : job.workplaceType,
      contract: contractFromText(`${job.categories?.commitment || ""} ${job.text || ""}`),
    }))
    .filter((job) => matchesQuery(job, filters.query, { includeDescription: false }))
    .filter((job) => matchesLocation(job, filters.location))
    .filter((job) => matchesContract(job, filters.contract))
    .filter((job) => matchesSeniority(job, filters.seniority))
    .filter((job) => matchesFamily(job, filters.families));
}

async function franceTravailToken(clientId, clientSecret) {
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
    scope: "api_offresdemploiv2 o2dsoffre",
  });
  const payload = await fetchJson(
    "https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=/partenaire",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    }
  );
  if (!payload.access_token) throw new Error("Jeton France Travail absent.");
  return payload.access_token;
}

function locationDepartment(value) {
  const normalized = normalizedText(value);
  const direct = normalized.match(/\b(?:dept|departement)?\s*(\d{2,3})\b/)?.[1];
  if (direct) return direct;
  if (normalized.includes("paris") || normalized.includes("ile-de-france")) return "75";
  return "";
}

export function franceTravailKeywords(value) {
  const keywords = [...new Map(
    String(value || "")
      .split(/[,;\n]+/)
      .map((keyword) => sanitizeText(keyword).trim())
      .filter((keyword) => keyword.length >= 2)
      .map((keyword) => [normalizedText(keyword), keyword])
  ).values()];
  if (keywords.length > 7) {
    const genericEnglishIndex = keywords.findIndex((keyword) => normalizedText(keyword) === "security");
    if (genericEnglishIndex >= 0) keywords.splice(genericEnglishIndex, 1);
  }
  return keywords.slice(0, 7).join(",");
}

async function searchFranceTravail(filters, credentials) {
  const token = await franceTravailToken(credentials.clientId, credentials.clientSecret);
  const query = new URLSearchParams({
    motsCles: franceTravailKeywords(filters.query) || "emploi",
    sort: "1",
    range: "0-49",
  });
  const department = locationDepartment(filters.location);
  if (department) query.set("departement", department);
  const payload = await fetchJson(
    `https://api.francetravail.io/partenaire/offresdemploi/v2/offres/search?${query}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const results = Array.isArray(payload.resultats) ? payload.resultats : [];
  return results
    .map((job) => {
      const originUrl = job.origineOffre?.urlOrigine || job.contact?.urlPostulation;
      const url = originUrl || `https://candidat.francetravail.fr/offres/recherche/detail/${job.id}`;
      return normalizedJob({
        sourceId: "francetravail",
        sourceName: job.origineOffre?.origine || "France Travail",
        externalId: job.id,
        title: job.intitule,
        company: job.entreprise?.nom,
        location: job.lieuTravail?.libelle,
        description: job.description,
        url,
        applyUrl: url,
        publishedAt: job.dateCreation,
        updatedAt: job.dateActualisation,
        contract: contractFromText(`${job.typeContrat || ""} ${job.typeContratLibelle || ""} ${job.natureContrat || ""}`),
      });
    })
    .filter((job) => matchesQuery(job, filters.query))
    .filter((job) => matchesContract(job, filters.contract))
    .filter((job) => matchesSeniority(job, filters.seniority))
    .filter((job) => matchesFamily(job, filters.families));
}

function objectText(value) {
  if (Array.isArray(value)) return value.map(objectText).filter(Boolean).join(", ");
  if (value && typeof value === "object") return Object.values(value).map(objectText).filter(Boolean).join(", ");
  return sanitizeText(value);
}

async function searchLaBonneAlternance(filters, credentials) {
  const query = new URLSearchParams({
    romes: credentials.romes?.join(",") || "M1802,M1805",
    target_diploma_level: String(credentials.targetDiplomaLevel || "7"),
  });
  if (Array.isArray(credentials.departments)) {
    credentials.departments.forEach((department) => query.append("departements", department));
  } else {
    const department = locationDepartment(filters.location);
    if (department) query.append("departements", department);
  }
  const payload = await fetchJson(
    `https://api.apprentissage.beta.gouv.fr/api/job/v1/search?${query}`,
    { headers: { Authorization: `Bearer ${credentials.token}` } }
  );
  const jobs = Array.isArray(payload.jobs) ? payload.jobs : [];
  const now = Date.now();
  return jobs
    .map((job) => {
      const workplace = job.workplace || {};
      const offer = job.offer || {};
      const publication = job.publication || {};
      const applyUrl = job.apply?.url;
      const location = objectText(workplace.location?.address || workplace.location);
      const company = workplace.name || workplace.brand || workplace.legal_name;
      const description = [
        offer.description,
        objectText(offer.desired_skills),
        objectText(offer.to_be_acquired_skills),
        offer.access_conditions,
      ].filter(Boolean).join(" ");
      return normalizedJob({
        sourceId: "labonnealternance",
        sourceName: job.identifier?.partner_label || "La Bonne Alternance",
        externalId: job.identifier?.id,
        title: offer.title,
        company,
        location,
        description,
        url: applyUrl,
        applyUrl,
        publishedAt: publication.creation,
        expiresAt: publication.expiration,
        contract: "alternance",
        workMode: objectText(job.contract?.remote),
        active: !publication.expiration || new Date(publication.expiration).getTime() > now,
      });
    })
    .filter((job) => matchesQuery(job, filters.query))
    .filter((job) => matchesLocation(job, filters.location))
    .filter((job) => matchesContract(job, filters.contract))
    .filter((job) => matchesSeniority(job, filters.seniority))
    .filter((job) => matchesFamily(job, filters.families));
}

export async function verifySourcingCredential(source, credentials = {}) {
  if (source === "francetravail") {
    const clientId = String(credentials.clientId || "").trim();
    const clientSecret = String(credentials.clientSecret || "").trim();
    if (!clientId || !clientSecret) {
      throw new Error("L’identifiant client et le secret France Travail sont nécessaires.");
    }
    await franceTravailToken(clientId, clientSecret);
    return {
      source,
      message: "Connexion France Travail vérifiée.",
    };
  }

  if (source === "labonnealternance") {
    const token = String(credentials.token || "").trim();
    if (!token) throw new Error("Le jeton La Bonne Alternance est nécessaire.");
    const jobs = await searchLaBonneAlternance(
      { query: "", location: "", contract: "alternance", seniority: "all", families: [] },
      {
        token,
        romes: Array.isArray(credentials.romes) ? credentials.romes : ["M1802", "M1805"],
        targetDiplomaLevel: credentials.targetDiplomaLevel || "7",
      }
    );
    return {
      source,
      message: `Connexion La Bonne Alternance vérifiée${jobs.length ? `, ${jobs.length} opportunité${jobs.length > 1 ? "s" : ""} accessible${jobs.length > 1 ? "s" : ""}` : ""}.`,
    };
  }

  throw new Error("Source officielle inconnue.");
}

function sourceStatus(id, state, message, count = 0, name = "") {
  const provider = SOURCING_PROVIDERS.find((entry) => entry.id === id);
  return {
    id,
    name: name || provider?.name || id,
    state,
    message,
    count,
  };
}

export async function searchJobs({
  query = "",
  location = "",
  contract = "all",
  seniority = "all",
  families = [],
  limit = 120,
  atsSources = DEFAULT_CYBER_ATS_SOURCES,
  franceTravail = null,
  laBonneAlternance = null,
} = {}) {
  const filters = { query, location, contract, seniority, families };
  const parsedSources = parseAtsSources(atsSources);
  const tasks = parsedSources.map((source) => ({
    id: `${source.type}:${source.token}`,
    providerId: source.type,
    name: `${source.type === "greenhouse" ? "Greenhouse" : "Lever"}, ${source.company}`,
    run: () => source.type === "greenhouse"
      ? searchGreenhouseSource(source, filters)
      : searchLeverSource(source, filters),
  }));
  if (franceTravail?.clientId && franceTravail?.clientSecret) {
    tasks.push({
      id: "francetravail",
      providerId: "francetravail",
      run: () => searchFranceTravail(filters, franceTravail),
    });
  }
  if (laBonneAlternance?.token && contract !== "cdi") {
    tasks.push({
      id: "labonnealternance",
      providerId: "labonnealternance",
      run: () => searchLaBonneAlternance(filters, laBonneAlternance),
    });
  }

  const settled = await Promise.allSettled(tasks.map((task) => task.run()));
  const jobs = [];
  const statuses = [];
  settled.forEach((result, index) => {
    const task = tasks[index];
    if (result.status === "fulfilled") {
      jobs.push(...result.value);
      statuses.push(sourceStatus(task.id, "ready", "Source actualisée.", result.value.length, task.name));
    } else {
      statuses.push(sourceStatus(
        task.id,
        "error",
        result.reason instanceof Error ? result.reason.message : "Source indisponible.",
        0,
        task.name
      ));
    }
  });
  if (!franceTravail?.clientId || !franceTravail?.clientSecret) {
    statuses.push(sourceStatus(
      "francetravail",
      "needs_configuration",
      "Ajoute les identifiants développeur France Travail."
    ));
  }
  if (!laBonneAlternance?.token && contract !== "cdi") {
    statuses.push(sourceStatus(
      "labonnealternance",
      "needs_configuration",
      "Ajoute un jeton La Bonne Alternance."
    ));
  }
  statuses.push(
    sourceStatus("linkedin", "restricted", "Accès réservé aux partenaires LinkedIn."),
    sourceStatus("wttj", "manual", "Les liens Welcome to the Jungle restent importables manuellement.")
  );
  const uniqueJobs = deduplicateJobs(jobs, limit);
  const activeSources = statuses.filter((status) => status.state === "ready").length;
  return {
    live: activeSources > 0,
    query,
    location,
    contract,
    seniority,
    families,
    checkedAt: new Date().toISOString(),
    total: uniqueJobs.length,
    jobs: uniqueJobs,
    sources: statuses,
    message: activeSources
      ? `${uniqueJobs.length} offre${uniqueJobs.length > 1 ? "s" : ""} active${uniqueJobs.length > 1 ? "s" : ""} détectée${uniqueJobs.length > 1 ? "s" : ""}.`
      : "Aucune source en direct n’est configurée.",
  };
}

function jobPostingObjects(value) {
  if (!value || typeof value !== "object") return [];
  if (Array.isArray(value)) return value.flatMap(jobPostingObjects);
  const objects = [];
  const type = Array.isArray(value["@type"]) ? value["@type"] : [value["@type"]];
  if (type.some((entry) => String(entry || "").toLowerCase() === "jobposting")) objects.push(value);
  for (const nested of Object.values(value)) {
    if (nested && typeof nested === "object") objects.push(...jobPostingObjects(nested));
  }
  return objects;
}

function structuredJobText(html) {
  const scripts = String(html || "").match(
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi
  ) || [];
  for (const script of scripts) {
    const body = script.replace(/^<script\b[^>]*>/i, "").replace(/<\/script>$/i, "").trim();
    try {
      const posting = jobPostingObjects(JSON.parse(decodeHtmlEntities(body)))[0];
      if (!posting) continue;
      const organization = typeof posting.hiringOrganization === "object"
        ? posting.hiringOrganization.name
        : posting.hiringOrganization;
      const location = Array.isArray(posting.jobLocation) ? posting.jobLocation[0] : posting.jobLocation;
      const address = location?.address || location;
      const locationText = typeof address === "object"
        ? [address.addressLocality, address.addressRegion, address.addressCountry].filter(Boolean).join(", ")
        : address;
      return [
        posting.title ? `Poste : ${sanitizeText(posting.title)}` : "",
        organization ? `Entreprise : ${sanitizeText(organization)}` : "",
        posting.employmentType ? `Contrat : ${sanitizeText(posting.employmentType)}` : "",
        locationText ? `Lieu : ${sanitizeText(locationText)}` : "",
        posting.description ? `Description : ${sanitizeText(posting.description)}` : "",
        posting.qualifications ? `Compétences : ${sanitizeText(posting.qualifications)}` : "",
        posting.responsibilities ? `Missions : ${sanitizeText(posting.responsibilities)}` : "",
      ].filter(Boolean).join("\n");
    } catch {}
  }
  return "";
}

function isPrivateHostname(hostname) {
  const host = String(hostname || "").replace(/^\[|\]$/g, "").toLowerCase();
  if (!host || host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local")) return true;
  if (host === "::1" || host.startsWith("fe80:") || host.startsWith("fc") || host.startsWith("fd")) return true;
  const parts = host.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return false;
  return parts[0] === 10
    || parts[0] === 127
    || parts[0] === 0
    || parts[0] === 169 && parts[1] === 254
    || parts[0] === 192 && parts[1] === 168
    || parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31;
}

function fetchUrlText(urlString, timeoutMs = 7_000, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    try {
      if (redirectCount > 4) throw new Error("Trop de redirections.");
      const parsed = new URL(urlString);
      if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("Protocole non autorisé.");
      if (isPrivateHostname(parsed.hostname)) throw new Error("Adresse locale ou privée non autorisée.");
      const transport = parsed.protocol === "https:" ? https : http;
      const request = transport.get(
        parsed,
        {
          headers: {
            Accept: "text/html,application/xhtml+xml",
            "User-Agent": "OpenApply/1.0",
          },
          timeout: timeoutMs,
        },
        (response) => {
          if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
            response.resume();
            const target = new URL(response.headers.location, parsed).toString();
            fetchUrlText(target, timeoutMs, redirectCount + 1).then(resolve, reject);
            return;
          }
          if (response.statusCode < 200 || response.statusCode >= 300) {
            response.resume();
            reject(new Error(`Réponse HTTP ${response.statusCode}.`));
            return;
          }
          let body = "";
          response.setEncoding("utf8");
          response.on("data", (chunk) => {
            if (body.length < 2_000_000) body += chunk;
          });
          response.on("end", () => resolve(body));
        }
      );
      request.on("error", reject);
      request.on("timeout", () => request.destroy(new Error("Délai réseau dépassé.")));
    } catch (error) {
      reject(error);
    }
  });
}

export async function fetchOfferDetails(urlString) {
  if (!urlString || typeof urlString !== "string") throw new Error("URL invalide.");
  try {
    const html = await fetchUrlText(urlString);
    const structured = structuredJobText(html);
    const pageText = sanitizeText(html);
    const rawText = [structured, pageText]
      .filter(Boolean)
      .join("\n\n")
      .slice(0, 20_000);
    return {
      url: urlString,
      rawText,
    };
  } catch (error) {
    return {
      url: urlString,
      rawText: "",
      error: error instanceof Error ? error.message : "Lecture de l’offre impossible.",
    };
  }
}
