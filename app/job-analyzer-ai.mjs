import { classifyJob } from "./job-classifier.mjs";

export function analyzeJobFitAI(job) {
  const classification = classifyJob(job);
  return {
    jobId: job.id,
    classification,
    recommendation: classification.family.id === "other"
      ? "Le domaine reste ambigu. Ouvre l’offre ou colle son texte avant de générer des documents."
      : `Poste classé dans la famille ${classification.family.label}. La compatibilité candidat sera vérifiée pendant l’analyse du profil.`,
    detectedTools: classification.tools,
    analyzedAt: new Date().toISOString(),
  };
}
