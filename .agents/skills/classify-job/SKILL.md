---
name: classify-job
description: Classify a job vacancy or spontaneous application target into a stable job family, contract type, seniority, language, work mode, and detected tools before AI tailoring. Use for single offers and bundles when OpenApply needs fast deterministic routing, category detection, token-saving pre-analysis, or resume decisions. Never use it to score candidate fit or assert candidate skills.
---

# Classify Job

Use this skill before an AI comparison when an offer, job title, pasted vacancy, or spontaneous application target must be routed quickly.

## Purpose

Return deterministic routing metadata without spending model tokens:

- primary job family and up to two secondary families;
- confidence and the exact text signals that triggered the classification;
- CDI, alternance, or ambiguous contract detection;
- student, junior, senior, or unspecified seniority;
- French, English, or unknown language;
- remote, hybrid, onsite, or unspecified work mode;
- named tools explicitly present in the supplied text.

The current families are:

- GRC, risks, and compliance;
- SOC, CSIRT, and incident response;
- IAM and identity management;
- cloud security and DevSecOps;
- network and infrastructure security;
- AppSec, technical audit, and pentest;
- security architecture and engineering;
- security awareness and change management;
- software engineering;
- data, analytics, and artificial intelligence;
- IT systems and operations;
- product and project management;
- sales and business development;
- marketing and communications;
- finance, audit, and accounting;
- people and legal;
- operations, procurement, and supply chain;
- design and creative;
- customer success and support;
- health, care, and social services;
- education, training, and research;
- engineering, industry, and production;
- construction, trades, and technical work;
- hospitality, food service, and tourism;
- retail and distribution;
- transport and logistics;
- administration, public service, and nonprofit;
- other or ambiguous.

## Non-negotiable rules

- Never invent an offer requirement.
- Never infer or score candidate fit.
- Never claim that a detected tool belongs to the candidate.
- Treat a manual `cdi` or `alternance` override as authoritative.
- Keep evidence strings so a reviewer can understand every classification.
- Return `other` and `unknown` when signals are insufficient.
- Do not use the em dash character.

## Deterministic command

Run:

```bash
node .agents/skills/classify-job/scripts/classify-job.mjs --file /absolute/path/to/offer.txt
```

For direct text:

```bash
node .agents/skills/classify-job/scripts/classify-job.mjs --text "Alternance analyste SOC, SIEM Splunk et EDR"
```

Optional manual contract:

```bash
node .agents/skills/classify-job/scripts/classify-job.mjs --file /absolute/path/to/offer.txt --contract alternance
```

The command prints one JSON object. Use its result as a routing hint in the later AI prompt. The exact vacancy always remains the source of truth.

## Bundle workflow

1. Classify every item locally.
2. Group only for scheduling and interface navigation.
3. Reuse the same cached classification while the offer text and classifier version are unchanged.
4. Send the compact classification plus the exact offer to the AI.
5. If the AI contradicts the classifier based on stronger exact evidence, keep the AI result and record the discrepancy for review.

## Quality check

Before returning a result, verify:

- the primary family has at least one evidence signal unless it is `other`;
- the contract is `ambiguous` when both CDI and alternance appear without a manual override;
- detected tools occur in the supplied text;
- no candidate facts or match percentage appear in the output.
