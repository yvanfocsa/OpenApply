export const JOB_CLASSIFIER_VERSION = "1.2.0";

const FAMILY_RULES = [
  {
    id: "grc",
    label: "GRC, risques et conformité",
    signals: [
      ["grc", 7],
      ["gouvernance", 4],
      ["governance", 4],
      ["gestion des risques", 6],
      ["risk management", 6],
      ["conformité", 5],
      ["compliance", 5],
      ["iso 27001", 5],
      ["iso 27005", 5],
      ["ebios", 5],
      ["nis2", 4],
      ["dora", 4],
      ["politique de sécurité", 4],
      ["pca", 3],
      ["pra", 3],
    ],
  },
  {
    id: "soc-csirt",
    label: "SOC, CSIRT et réponse aux incidents",
    signals: [
      ["soc", 6],
      ["csirt", 8],
      ["cert", 7],
      ["réponse aux incidents", 7],
      ["incident response", 7],
      ["threat hunting", 6],
      ["siem", 5],
      ["soar", 5],
      ["edr", 4],
      ["forensic", 4],
      ["investigation", 3],
      ["détection", 3],
    ],
  },
  {
    id: "iam",
    label: "IAM et gestion des identités",
    signals: [
      ["iam", 8],
      ["identity and access", 7],
      ["gestion des identités", 7],
      ["gestion des accès", 6],
      ["pam", 5],
      ["sailpoint", 5],
      ["cyberark", 5],
      ["entra id", 5],
      ["active directory", 4],
      ["zero trust", 3],
    ],
  },
  {
    id: "cloud-devsecops",
    label: "Cloud security et DevSecOps",
    signals: [
      ["devsecops", 8],
      ["cloud security", 7],
      ["sécurité cloud", 7],
      ["ci/cd", 4],
      ["pipeline", 3],
      ["sast", 5],
      ["dast", 5],
      ["kubernetes", 4],
      ["docker", 3],
      ["terraform", 4],
      ["aws", 3],
      ["azure", 3],
      ["gcp", 3],
    ],
  },
  {
    id: "network-infrastructure",
    label: "Sécurité réseau et infrastructures",
    signals: [
      ["sécurité réseau", 7],
      ["network security", 7],
      ["pare-feu", 5],
      ["firewall", 5],
      ["fortinet", 4],
      ["fortigate", 4],
      ["palo alto", 4],
      ["vpn", 3],
      ["segmentation", 4],
      ["durcissement", 4],
      ["hardening", 4],
      ["infrastructure", 2],
    ],
  },
  {
    id: "appsec-pentest",
    label: "AppSec, audit technique et pentest",
    signals: [
      ["appsec", 8],
      ["pentest", 7],
      ["test d'intrusion", 7],
      ["test d’intrusion", 7],
      ["penetration test", 7],
      ["audit technique", 5],
      ["sécurité applicative", 6],
      ["application security", 6],
      ["owasp", 5],
      ["burp suite", 4],
      ["revue de code", 3],
      ["vulnerability assessment", 4],
    ],
  },
  {
    id: "security-architecture",
    label: "Architecture et ingénierie sécurité",
    signals: [
      ["architecte sécurité", 8],
      ["security architect", 8],
      ["architecture sécurité", 7],
      ["security engineering", 5],
      ["ingénieur sécurité", 4],
      ["security engineer", 4],
      ["security by design", 4],
      ["analyse de risques projet", 3],
      ["homologation", 4],
    ],
  },
  {
    id: "security-awareness",
    label: "Sensibilisation et conduite du changement cyber",
    signals: [
      ["sensibilisation", 7],
      ["security awareness", 7],
      ["phishing simulation", 4],
      ["formation cybersécurité", 5],
      ["conduite du changement", 4],
      ["culture sécurité", 4],
    ],
  },
  {
    id: "software-engineering",
    label: "Développement logiciel",
    signals: [
      ["software engineer", 7],
      ["développeur", 7],
      ["developer", 6],
      ["développement logiciel", 7],
      ["full stack", 6],
      ["frontend", 5],
      ["backend", 5],
      ["react", 3],
      ["node.js", 3],
      ["java", 2],
    ],
  },
  {
    id: "data-ai",
    label: "Data, analytique et intelligence artificielle",
    signals: [
      ["data analyst", 8],
      ["data scientist", 8],
      ["data engineer", 8],
      ["machine learning", 6],
      ["intelligence artificielle", 6],
      ["business intelligence", 6],
      ["power bi", 4],
      ["tableau", 3],
      ["sql", 3],
    ],
  },
  {
    id: "it-operations",
    label: "Systèmes, réseau et opérations IT",
    signals: [
      ["administrateur système", 7],
      ["system administrator", 7],
      ["support informatique", 6],
      ["it support", 6],
      ["helpdesk", 5],
      ["technicien informatique", 6],
      ["sre", 5],
      ["site reliability", 6],
      ["network engineer", 5],
    ],
  },
  {
    id: "product-project",
    label: "Produit et gestion de projet",
    signals: [
      ["product manager", 8],
      ["product owner", 8],
      ["chef de projet", 7],
      ["project manager", 7],
      ["pmo", 6],
      ["scrum master", 6],
      ["gestion de projet", 5],
      ["roadmap", 3],
    ],
  },
  {
    id: "sales-business",
    label: "Commercial et développement d’affaires",
    signals: [
      ["business developer", 8],
      ["business development", 7],
      ["commercial", 6],
      ["sales manager", 7],
      ["account executive", 7],
      ["ingénieur d'affaires", 7],
      ["ingénieur d’affaires", 7],
      ["avant-vente", 5],
      ["presales", 5],
    ],
  },
  {
    id: "marketing-communications",
    label: "Marketing et communication",
    signals: [
      ["marketing", 6],
      ["communication", 5],
      ["community manager", 7],
      ["content manager", 6],
      ["seo", 4],
      ["sea", 4],
      ["acquisition", 4],
      ["relations presse", 5],
    ],
  },
  {
    id: "finance-accounting",
    label: "Finance, audit et comptabilité",
    signals: [
      ["contrôleur de gestion", 8],
      ["financial analyst", 7],
      ["analyste financier", 7],
      ["comptable", 7],
      ["accountant", 7],
      ["trésorerie", 5],
      ["audit financier", 6],
      ["consolidation", 5],
    ],
  },
  {
    id: "people-legal",
    label: "Ressources humaines et juridique",
    signals: [
      ["ressources humaines", 7],
      ["human resources", 7],
      ["recruteur", 6],
      ["talent acquisition", 7],
      ["juriste", 7],
      ["legal counsel", 7],
      ["droit social", 5],
      ["paie", 5],
    ],
  },
  {
    id: "operations-supply",
    label: "Opérations, achats et supply chain",
    signals: [
      ["supply chain", 7],
      ["logistique", 6],
      ["achats", 6],
      ["procurement", 6],
      ["planificateur", 5],
      ["production manager", 6],
      ["amélioration continue", 5],
      ["lean management", 5],
    ],
  },
  {
    id: "design-creative",
    label: "Design et création",
    signals: [
      ["product designer", 8],
      ["ux designer", 8],
      ["ui designer", 8],
      ["graphiste", 7],
      ["graphic designer", 7],
      ["directeur artistique", 7],
      ["figma", 4],
      ["design system", 5],
    ],
  },
  {
    id: "customer-success",
    label: "Relation client et customer success",
    signals: [
      ["customer success", 8],
      ["service client", 6],
      ["relation client", 6],
      ["customer support", 7],
      ["chargé de clientèle", 7],
      ["support client", 6],
    ],
  },
  {
    id: "health-care",
    label: "Santé, soins et médico-social",
    signals: [
      ["infirmier", 8],
      ["infirmière", 8],
      ["aide-soignant", 8],
      ["médecin", 8],
      ["pharmacien", 7],
      ["kinésithérapeute", 8],
      ["éducateur spécialisé", 7],
      ["médico-social", 6],
      ["soins aux patients", 6],
      ["patient care", 6],
    ],
  },
  {
    id: "education-research",
    label: "Éducation, formation et recherche",
    signals: [
      ["enseignant", 8],
      ["professeur", 8],
      ["teacher", 8],
      ["formateur", 7],
      ["ingénieur pédagogique", 7],
      ["chercheur", 7],
      ["researcher", 7],
      ["doctorant", 6],
      ["pédagogie", 5],
      ["enseignement", 6],
    ],
  },
  {
    id: "engineering-industry",
    label: "Ingénierie, industrie et production",
    signals: [
      ["ingénieur mécanique", 8],
      ["mechanical engineer", 8],
      ["ingénieur électrique", 8],
      ["electrical engineer", 8],
      ["ingénieur qualité", 7],
      ["industrial engineer", 7],
      ["maintenance industrielle", 7],
      ["bureau d'études", 6],
      ["méthodes industrielles", 6],
      ["production industrielle", 6],
    ],
  },
  {
    id: "construction-trades",
    label: "Bâtiment, artisanat et métiers techniques",
    signals: [
      ["conducteur de travaux", 8],
      ["chef de chantier", 8],
      ["électricien", 8],
      ["plombier", 8],
      ["menuisier", 8],
      ["maçon", 8],
      ["technicien bâtiment", 7],
      ["génie civil", 7],
      ["construction", 4],
      ["chantier", 5],
    ],
  },
  {
    id: "hospitality-tourism",
    label: "Hôtellerie, restauration et tourisme",
    signals: [
      ["réceptionniste", 8],
      ["chef de cuisine", 8],
      ["serveur", 7],
      ["serveuse", 7],
      ["hôtel", 5],
      ["hospitality", 7],
      ["restauration", 6],
      ["tourisme", 6],
      ["travel advisor", 7],
      ["agent de voyage", 7],
    ],
  },
  {
    id: "retail-commerce",
    label: "Commerce, distribution et vente",
    signals: [
      ["vendeur", 7],
      ["vendeuse", 7],
      ["conseiller de vente", 8],
      ["responsable de magasin", 8],
      ["store manager", 8],
      ["retail", 6],
      ["grande distribution", 6],
      ["mise en rayon", 6],
      ["merchandising", 5],
    ],
  },
  {
    id: "transport-logistics",
    label: "Transport et logistique",
    signals: [
      ["chauffeur", 7],
      ["conducteur routier", 8],
      ["cariste", 8],
      ["préparateur de commandes", 8],
      ["agent logistique", 8],
      ["transport planner", 7],
      ["transport", 5],
      ["entrepôt", 5],
      ["warehouse", 5],
    ],
  },
  {
    id: "administration-public",
    label: "Administration, secteur public et associatif",
    signals: [
      ["assistant administratif", 8],
      ["assistante administrative", 8],
      ["office manager", 7],
      ["secrétaire", 7],
      ["collectivité territoriale", 7],
      ["service public", 6],
      ["association", 4],
      ["nonprofit", 6],
      ["gestion administrative", 6],
    ],
  },
];

const TOOL_RULES = [
  ["Active Directory", ["active directory"]],
  ["Ansible", ["ansible"]],
  ["AWS", ["aws", "amazon web services"]],
  ["Azure", ["azure"]],
  ["BloodHound", ["bloodhound"]],
  ["Burp Suite", ["burp suite"]],
  ["CyberArk", ["cyberark"]],
  ["Docker", ["docker"]],
  ["Elastic", ["elastic", "elasticsearch"]],
  ["Entra ID", ["entra id", "azure ad"]],
  ["Fortinet", ["fortinet", "fortigate"]],
  ["Figma", ["figma"]],
  ["GCP", ["gcp", "google cloud"]],
  ["GitHub Actions", ["github actions"]],
  ["GitLab CI", ["gitlab ci", "gitlab-ci"]],
  ["Jenkins", ["jenkins"]],
  ["Kubernetes", ["kubernetes", "k8s"]],
  ["Microsoft Sentinel", ["microsoft sentinel", "azure sentinel"]],
  ["Nessus", ["nessus"]],
  ["Nmap", ["nmap"]],
  ["Node.js", ["node.js", "nodejs"]],
  ["Palo Alto", ["palo alto"]],
  ["Power BI", ["power bi"]],
  ["Python", ["python"]],
  ["Qualys", ["qualys"]],
  ["SailPoint", ["sailpoint"]],
  ["ServiceNow", ["servicenow"]],
  ["Splunk", ["splunk"]],
  ["SQL", ["sql"]],
  ["Salesforce", ["salesforce"]],
  ["SAP", ["sap"]],
  ["Adobe Creative Cloud", ["adobe creative cloud", "photoshop", "illustrator", "indesign"]],
  ["AutoCAD", ["autocad"]],
  ["Canva", ["canva"]],
  ["Excel", ["microsoft excel", "excel"]],
  ["HubSpot", ["hubspot"]],
  ["Jira", ["jira"]],
  ["Microsoft 365", ["microsoft 365", "office 365"]],
  ["Notion", ["notion"]],
  ["Revit", ["revit"]],
  ["SolidWorks", ["solidworks"]],
  ["WordPress", ["wordpress"]],
  ["Tableau", ["tableau"]],
  ["Terraform", ["terraform"]],
  ["Tenable", ["tenable"]],
  ["Wireshark", ["wireshark"]],
];

function normalizeText(value) {
  return String(value || "")
    .normalize("NFKC")
    .replace(/[’‘`]/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase("fr");
}

function inputText(input) {
  if (typeof input === "string") return normalizeText(input);
  return normalizeText([
    input?.title,
    input?.role,
    input?.company,
    input?.description,
    input?.rawText,
    ...(Array.isArray(input?.tags) ? input.tags : []),
  ].filter(Boolean).join(" "));
}

function containsSignal(text, rawSignal) {
  const signal = normalizeText(rawSignal);
  if (!signal) return false;
  const escaped = signal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const startsWithWord = /^[a-z0-9]/i.test(signal);
  const endsWithWord = /[a-z0-9]$/i.test(signal);
  const pattern = `${startsWithWord ? "(^|[^a-z0-9])" : ""}${escaped}${endsWithWord ? "([^a-z0-9]|$)" : ""}`;
  return new RegExp(pattern, "iu").test(text);
}

function collectRuleMatches(text, signals) {
  return signals
    .filter(([signal]) => containsSignal(text, signal))
    .map(([signal, weight]) => ({ signal, weight }));
}

function detectContract(text) {
  const alternanceSignals = [
    "alternance",
    "apprentissage",
    "apprenti",
    "apprenticeship",
    "contrat pro",
    "contrat de professionnalisation",
  ].filter((signal) => text.includes(signal));
  const permanentSignals = [
    "cdi",
    "permanent contract",
    "permanent position",
    "full-time permanent",
  ].filter((signal) => text.includes(signal));
  if (alternanceSignals.length && !permanentSignals.length) {
    return { value: "alternance", confidence: "high", evidence: alternanceSignals.slice(0, 3) };
  }
  if (permanentSignals.length && !alternanceSignals.length) {
    return { value: "cdi", confidence: "high", evidence: permanentSignals.slice(0, 3) };
  }
  return {
    value: "ambiguous",
    confidence: alternanceSignals.length || permanentSignals.length ? "low" : "unknown",
    evidence: [...alternanceSignals, ...permanentSignals].slice(0, 3),
  };
}

function detectSeniority(text) {
  const seniorSignals = [
    "senior",
    "staff ",
    "director",
    "directeur",
    "head of",
    "principal",
    "lead ",
    "chief ",
    "vice president",
    "vp ",
    "manager",
    "responsable",
    "expert",
    "5 ans",
    "7 ans",
    "10 ans",
  ];
  const juniorSignals = ["junior", "débutant", "graduate", "première expérience", "0 à 2 ans", "1 à 2 ans"];
  const studentSignals = ["alternance", "apprentissage", "apprenti", "stage", "internship", "étudiant"];
  if (studentSignals.some((signal) => text.includes(signal))) return "student";
  const statedYears = [
    ...text.matchAll(/\b(\d{1,2})\s*\+?\s*years?(?:\s+of)?(?:\s+[a-z-]+){0,2}\s+experience\b/g),
    ...text.matchAll(/\b(\d{1,2})\s*\+?\s*ans?\s+d['’ ]experience\b/g),
    ...text.matchAll(/\b(?:minimum|at least)\s+(\d{1,2})\s*\+?\s*(?:years?|ans?)\b/g),
  ]
    .map((match) => Number(match[1]))
    .filter(Number.isFinite);
  if (seniorSignals.some((signal) => text.includes(signal)) || statedYears.some((years) => years >= 3)) return "senior";
  if (juniorSignals.some((signal) => text.includes(signal))) return "junior";
  return "unspecified";
}

function detectLanguage(text) {
  const frenchSignals = [" le ", " la ", " les ", " des ", " vous ", " poste ", " mission ", " expérience ", " compétences "];
  const englishSignals = [" the ", " and ", " you ", " role ", " position ", " experience ", " skills ", " responsibilities "];
  const frenchScore = frenchSignals.filter((signal) => ` ${text} `.includes(signal)).length;
  const englishScore = englishSignals.filter((signal) => ` ${text} `.includes(signal)).length;
  if (frenchScore === englishScore) return "unknown";
  return frenchScore > englishScore ? "fr" : "en";
}

function detectWorkMode(text) {
  if (["full remote", "fully remote", "100% remote", "télétravail complet"].some((signal) => text.includes(signal))) {
    return "remote";
  }
  if (["hybride", "hybrid", "télétravail", "remote"].some((signal) => text.includes(signal))) {
    return "hybrid";
  }
  if (["sur site", "on-site", "onsite", "présentiel"].some((signal) => text.includes(signal))) {
    return "onsite";
  }
  return "unspecified";
}

export function classifyJob(input, options = {}) {
  const text = inputText(input);
  const ranked = FAMILY_RULES
    .map((family) => {
      const matches = collectRuleMatches(text, family.signals);
      return {
        id: family.id,
        label: family.label,
        score: matches.reduce((sum, match) => sum + match.weight, 0),
        evidence: matches.map((match) => match.signal),
      };
    })
    .filter((family) => family.score > 0)
    .sort((first, second) => second.score - first.score || first.label.localeCompare(second.label, "fr"));

  const primary = ranked[0] || { id: "other", label: "Autre domaine", score: 0, evidence: [] };
  const runnerUp = ranked[1];
  const confidence = primary.score >= 12 && (!runnerUp || primary.score >= runnerUp.score + 4)
    ? "high"
    : primary.score >= 6
      ? "medium"
      : primary.score > 0
        ? "low"
        : "unknown";
  const tools = TOOL_RULES
    .filter(([, signals]) => signals.some((signal) => containsSignal(text, signal)))
    .map(([label]) => label);
  const selectedContract = ["cdi", "alternance"].includes(options.contractOverride)
    ? {
        value: options.contractOverride,
        confidence: "manual",
        evidence: ["choix utilisateur"],
      }
    : detectContract(text);

  return {
    version: JOB_CLASSIFIER_VERSION,
    family: {
      id: primary.id,
      label: primary.label,
      confidence,
      evidence: primary.evidence.slice(0, 6),
    },
    secondaryFamilies: ranked.slice(1, 3).map(({ id, label, evidence }) => ({
      id,
      label,
      evidence: evidence.slice(0, 4),
    })),
    contract: selectedContract,
    seniority: detectSeniority(text),
    language: detectLanguage(text),
    workMode: detectWorkMode(text),
    tools,
    classifiedAt: new Date().toISOString(),
  };
}

export function classificationForPrompt(classification) {
  if (!classification) return "";
  return JSON.stringify({
    classifierVersion: classification.version,
    primaryFamily: classification.family,
    secondaryFamilies: classification.secondaryFamilies,
    contract: classification.contract,
    seniority: classification.seniority,
    language: classification.language,
    workMode: classification.workMode,
    detectedTools: classification.tools,
  });
}
