import path from "node:path";
import { readFile } from "node:fs/promises";
import { inflateRawSync } from "node:zlib";

const MAX_PACK_APPLICATIONS = 100;
const MAX_PACK_BYTES = 50 * 1024 * 1024;

const CRC32_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let index = 0; index < 256; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) {
      value = (value & 1) ? (0xedb88320 ^ (value >>> 1)) : (value >>> 1);
    }
    table[index] = value >>> 0;
  }
  return table;
})();

function crc32(buffer) {
  let value = 0xffffffff;
  for (const byte of buffer) value = CRC32_TABLE[(value ^ byte) & 0xff] ^ (value >>> 8);
  return (value ^ 0xffffffff) >>> 0;
}

function dosTimestamp(date = new Date()) {
  const year = Math.max(1980, date.getFullYear());
  return {
    time: ((date.getHours() & 0x1f) << 11) | ((date.getMinutes() & 0x3f) << 5) | Math.floor(date.getSeconds() / 2),
    date: (((year - 1980) & 0x7f) << 9) | (((date.getMonth() + 1) & 0x0f) << 5) | (date.getDate() & 0x1f),
  };
}

function createZipBuffer(entries) {
  const localParts = [];
  const centralParts = [];
  let offset = 0;
  const timestamp = dosTimestamp();

  for (const entry of entries) {
    const name = Buffer.from(String(entry.name).replaceAll("\\", "/").replace(/^\/+/, ""), "utf8");
    const data = Buffer.isBuffer(entry.data) ? entry.data : Buffer.from(entry.data);
    const checksum = crc32(data);
    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0x0800, 6);
    localHeader.writeUInt16LE(0, 8);
    localHeader.writeUInt16LE(timestamp.time, 10);
    localHeader.writeUInt16LE(timestamp.date, 12);
    localHeader.writeUInt32LE(checksum, 14);
    localHeader.writeUInt32LE(data.length, 18);
    localHeader.writeUInt32LE(data.length, 22);
    localHeader.writeUInt16LE(name.length, 26);
    localHeader.writeUInt16LE(0, 28);
    localParts.push(localHeader, name, data);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0x0800, 8);
    centralHeader.writeUInt16LE(0, 10);
    centralHeader.writeUInt16LE(timestamp.time, 12);
    centralHeader.writeUInt16LE(timestamp.date, 14);
    centralHeader.writeUInt32LE(checksum, 16);
    centralHeader.writeUInt32LE(data.length, 20);
    centralHeader.writeUInt32LE(data.length, 24);
    centralHeader.writeUInt16LE(name.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(offset, 42);
    centralParts.push(centralHeader, name);
    offset += localHeader.length + name.length + data.length;
  }

  const centralDirectory = Buffer.concat(centralParts);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralDirectory.length, 12);
  end.writeUInt32LE(offset, 16);
  end.writeUInt16LE(0, 20);
  return Buffer.concat([...localParts, centralDirectory, end]);
}

function findEndOfCentralDirectory(buffer) {
  const lowerBound = Math.max(0, buffer.length - 65_557);
  for (let offset = buffer.length - 22; offset >= lowerBound; offset -= 1) {
    if (buffer.readUInt32LE(offset) === 0x06054b50) return offset;
  }
  throw new Error("Le fichier DOCX ne contient pas de répertoire ZIP valide.");
}

function extractZipEntry(buffer, wantedName) {
  const endOffset = findEndOfCentralDirectory(buffer);
  const entryCount = buffer.readUInt16LE(endOffset + 10);
  let offset = buffer.readUInt32LE(endOffset + 16);

  for (let index = 0; index < entryCount; index += 1) {
    if (buffer.readUInt32LE(offset) !== 0x02014b50) {
      throw new Error("Le répertoire du fichier DOCX est invalide.");
    }
    const compression = buffer.readUInt16LE(offset + 10);
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const expectedSize = buffer.readUInt32LE(offset + 24);
    const fileNameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const localOffset = buffer.readUInt32LE(offset + 42);
    const fileName = buffer.subarray(offset + 46, offset + 46 + fileNameLength).toString("utf8");

    if (fileName === wantedName) {
      if (buffer.readUInt32LE(localOffset) !== 0x04034b50) {
        throw new Error("L’entrée principale du fichier DOCX est invalide.");
      }
      const localNameLength = buffer.readUInt16LE(localOffset + 26);
      const localExtraLength = buffer.readUInt16LE(localOffset + 28);
      const dataOffset = localOffset + 30 + localNameLength + localExtraLength;
      const compressed = buffer.subarray(dataOffset, dataOffset + compressedSize);
      const data = compression === 0
        ? compressed
        : compression === 8
          ? inflateRawSync(compressed)
          : null;
      if (!data) throw new Error("Le format de compression du DOCX n’est pas pris en charge.");
      if (data.length !== expectedSize) throw new Error("Le contenu du DOCX est incomplet.");
      return data;
    }
    offset += 46 + fileNameLength + extraLength + commentLength;
  }
  throw new Error(`L’entrée ${wantedName} est absente du fichier DOCX.`);
}

function decodeXmlText(value) {
  return String(value)
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", "\"")
    .replaceAll("&apos;", "'")
    .replaceAll("&amp;", "&")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)));
}

export function extractDocxTextBuffer(docxBuffer) {
  const xml = extractZipEntry(docxBuffer, "word/document.xml").toString("utf8");
  const paragraphs = xml.match(/<w:p(?:\s[^>]*)?>[\s\S]*?<\/w:p>/g) || [];
  const lines = paragraphs
    .map((paragraph) => decodeXmlText(
      paragraph
        .replace(/<w:tab\b[^>]*\/>/g, "\t")
        .replace(/<w:(?:br|cr)\b[^>]*\/>/g, "\n")
        .replace(/<[^>]+>/g, "")
    ).replace(/[ \t]+\n/g, "\n").trim())
    .filter(Boolean);
  return `${lines.join("\n").trim()}\n`;
}

function slugify(value, fallback = "candidature", maxLength = 44) {
  const normalized = String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, maxLength)
    .replace(/-+$/g, "");
  return normalized || fallback;
}

function normalizedSearchText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function isHttpUrl(value) {
  try {
    const parsed = new URL(String(value || "").trim());
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

function itemUrl(bundle, item) {
  if (bundle.sourceType === "spontaneous") return String(item.spontaneousTarget?.website || "").trim();
  return String(item.offer || "").trim();
}

function selectedSourceCv(sourceCvPaths, language) {
  const selected = language === "en" && sourceCvPaths.en ? sourceCvPaths.en : sourceCvPaths.fr;
  return selected ? path.basename(selected) : "";
}

function verifiedEvidenceCounts(item) {
  const strengths = Array.isArray(item.analysis?.matchedStrengths) ? item.analysis.matchedStrengths : [];
  const questions = Array.isArray(item.analysis?.questions) ? item.analysis.questions : [];
  const answers = new Map((Array.isArray(item.answers) ? item.answers : []).map((answer) => [answer.id, answer.level]));
  const confirmedRequirements = questions.filter((question) => {
    const level = answers.get(question.id);
    return level && level !== "none";
  }).length;
  return {
    verifiedStrengths: strengths.length,
    confirmedRequirements,
  };
}

function missingRequirements(item) {
  const omitted = Array.isArray(item.result?.omittedRequirements) ? item.result.omittedRequirements : [];
  const answers = new Map((Array.isArray(item.answers) ? item.answers : []).map((answer) => [answer.id, answer.level]));
  const unanswered = (Array.isArray(item.analysis?.questions) ? item.analysis.questions : [])
    .filter((question) => !answers.has(question.id) || answers.get(question.id) === "none")
    .map((question) => question.requirement);
  return [...new Set([...omitted, ...unanswered].map((value) => String(value || "").trim()).filter(Boolean))].slice(0, 6);
}

function companyAppearsInLetter(company, letterText) {
  const tokens = slugify(company, "", 80).split("-").filter((token) => token.length >= 4);
  const normalizedLetter = normalizedSearchText(letterText);
  return !tokens.length || tokens.some((token) => normalizedLetter.includes(token));
}

function assertPdf(buffer, label) {
  if (buffer.length < 100 || buffer.subarray(0, 5).toString("ascii") !== "%PDF-") {
    throw new Error(`${label} n’est pas un PDF valide.`);
  }
}

function csvCell(value) {
  return `"${String(value ?? "").replaceAll("\"", "\"\"")}"`;
}

function trackerCsv(rows) {
  const columns = [
    "id",
    "url",
    "company",
    "jobTitle",
    "selectedSourceCv",
    "verifiedStrengths",
    "confirmedRequirements",
    "missingRequirements",
    "generatedCv",
    "generatedLetter",
    "qualityNotes",
  ];
  return `${columns.join(",")}\n${rows.map((row) => columns.map((column) => csvCell(row[column])).join(",")).join("\n")}\n`;
}

function packName(profile, createdAt) {
  const period = new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).format(createdAt);
  return `Candidatures ${profile.headline || profile.name || "ciblées"} | ${period}`;
}

function uniqueApplicationId(item, company, role, usedIds) {
  const prefix = String(item.index + 1).padStart(3, "0");
  const base = `${prefix}-${slugify(company, "entreprise", 30)}-${slugify(role, "poste", 34)}`;
  let candidate = base;
  let suffix = 2;
  while (usedIds.has(candidate)) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  usedIds.add(candidate);
  return candidate;
}

function applicationAnswers(item) {
  const answers = Array.isArray(item.formAnswers) ? item.formAnswers : [];
  return {
    answers: answers
      .map((entry) => ({
        question: String(entry?.question || "").trim(),
        answer: String(entry?.answer || "").trim(),
      }))
      .filter((entry) => entry.question && entry.answer),
  };
}

function verificationEntry(id, company, role, reason) {
  return { id, company, jobTitle: role, reason };
}

export async function createProfileCandidateExtensionPack({
  bundle,
  profile,
  sourceCvPaths,
  createdAt = new Date(),
}) {
  if (!bundle || !Array.isArray(bundle.items)) throw new Error("Le lot de candidatures est invalide.");
  if (bundle.items.length > MAX_PACK_APPLICATIONS) throw new Error("Le pack dépasse 100 candidatures.");

  const entries = [];
  const manifestApplications = [];
  const trackerRows = [];
  const verificationRequired = [];
  const usedIds = new Set();
  let preparedFolders = 0;

  for (const item of bundle.items) {
    const company = String(item.result?.company || item.analysis?.company || item.spontaneousTarget?.company || "Entreprise").trim();
    const role = String(item.result?.role || item.analysis?.role || item.spontaneousTarget?.role || "Poste ciblé").trim();
    const id = uniqueApplicationId(item, company, role, usedIds);
    const url = itemUrl(bundle, item);
    const evidence = verifiedEvidenceCounts(item);
    const missing = missingRequirements(item);
    const sourceCv = selectedSourceCv(sourceCvPaths, item.result?.language || item.analysis?.language);
    const notes = [];
    let generatedCv = false;
    let generatedLetter = false;

    if (item.state !== "completed" || !item.result) {
      notes.push(item.error || "Candidature non générée");
      trackerRows.push({
        id,
        url,
        company,
        jobTitle: role,
        selectedSourceCv: sourceCv,
        verifiedStrengths: evidence.verifiedStrengths,
        confirmedRequirements: evidence.confirmedRequirements,
        missingRequirements: missing.join("; "),
        generatedCv,
        generatedLetter,
        qualityNotes: notes.join(" | "),
      });
      verificationRequired.push(verificationEntry(id, company, role, notes[0]));
      continue;
    }

    try {
      const [cvPdf, letterPdf, letterDocx] = await Promise.all([
        readFile(item.result.pdfPath),
        readFile(item.result.coverLetterPdfPath),
        readFile(item.result.coverLetterDocxPath),
      ]);
      assertPdf(cvPdf, "Le CV");
      assertPdf(letterPdf, "La lettre");
      const letterText = extractDocxTextBuffer(letterDocx);
      if (letterText.trim().length < 80) throw new Error("Le texte extrait de la lettre est vide ou incomplet.");

      const nameParts = String(profile?.name || "Candidat")
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
      const formattedName = nameParts.length ? nameParts.join("_") : "Candidat";
      const folder = `applications/${id}`;
      const cvPath = `${folder}/CV_${formattedName}.pdf`;
      const letterPath = `${folder}/LM_${formattedName}.pdf`;
      const letterTextPath = `${folder}/lettre.txt`;
      const answersPath = `${folder}/reponses.json`;
      entries.push(
        { name: cvPath, data: cvPdf },
        { name: letterPath, data: letterPdf },
        { name: letterTextPath, data: Buffer.from(letterText, "utf8") },
        { name: answersPath, data: Buffer.from(`${JSON.stringify(applicationAnswers(item), null, 2)}\n`, "utf8") }
      );
      preparedFolders += 1;
      generatedCv = true;
      generatedLetter = true;

      if (missing.length) notes.push("Écarts de compétences à vérifier");
      if (!companyAppearsInLetter(company, letterText)) notes.push("Vérifier que la lettre cite clairement l’entreprise");

      if (isHttpUrl(url)) {
        manifestApplications.push({
          id,
          url,
          matchUrls: [],
          company,
          jobTitle: role,
          applicationType: bundle.sourceType === "spontaneous" ? "spontaneous" : "job",
          cv: cvPath,
          coverLetterFile: letterPath,
          coverLetterText: letterTextPath,
          answers: answersPath,
        });
      } else {
        notes.push("Lien http/https absent, dossier non importé automatiquement");
      }

      if (notes.length) {
        verificationRequired.push(verificationEntry(id, company, role, notes.join("; ")));
      }
    } catch (error) {
      notes.push(error instanceof Error ? error.message : "Fichiers impossibles à valider");
      verificationRequired.push(verificationEntry(id, company, role, notes.at(-1)));
    }

    trackerRows.push({
      id,
      url,
      company,
      jobTitle: role,
      selectedSourceCv: sourceCv,
      verifiedStrengths: evidence.verifiedStrengths,
      confirmedRequirements: evidence.confirmedRequirements,
      missingRequirements: missing.join("; "),
      generatedCv,
      generatedLetter,
      qualityNotes: notes.length ? notes.join(" | ") : "PDF validés, lettre texte extraite du DOCX",
    });
  }

  const manifest = {
    formatVersion: "1.0",
    packName: packName(profile, createdAt),
    createdAt: createdAt.toISOString(),
    applications: manifestApplications,
  };
  if (!manifest.applications.length) {
    throw new Error("Aucune candidature n’est importable dans l’extension. Vérifie les fichiers générés et ajoute un lien http ou https à chaque cible spontanée.");
  }
  if (manifest.applications.length > MAX_PACK_APPLICATIONS) throw new Error("Le manifeste dépasse 100 candidatures.");

  const declaredPaths = new Set(entries.map((entry) => entry.name));
  const ids = new Set();
  for (const application of manifest.applications) {
    if (!/^[a-z0-9_-]+$/.test(application.id) || ids.has(application.id)) {
      throw new Error("Le manifeste contient un identifiant invalide ou dupliqué.");
    }
    ids.add(application.id);
    if (!isHttpUrl(application.url)) throw new Error(`L’URL de ${application.id} est invalide.`);
    for (const declaredPath of [application.cv, application.coverLetterFile, application.coverLetterText, application.answers]) {
      if (!declaredPaths.has(declaredPath)) throw new Error(`Le fichier ${declaredPath} est absent du pack.`);
    }
  }

  const tracker = trackerCsv(trackerRows);
  entries.unshift(
    { name: "tracker.csv", data: Buffer.from(tracker, "utf8") },
    { name: "pack.json", data: Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`, "utf8") }
  );
  const buffer = createZipBuffer(entries);
  if (buffer.length > MAX_PACK_BYTES) throw new Error("Le pack compatible avec l’extension dépasse 50 Mo.");

  return {
    buffer,
    manifest,
    tracker,
    summary: {
      total: bundle.items.length,
      prepared: preparedFolders,
      applications: manifest.applications.length,
      excluded: bundle.items.length - manifest.applications.length,
      sizeBytes: buffer.length,
      verificationRequired,
    },
  };
}
