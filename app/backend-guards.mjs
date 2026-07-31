import { randomUUID } from "node:crypto";
import { lookup as dnsLookup } from "node:dns/promises";
import { rename, unlink, writeFile } from "node:fs/promises";
import { isIP } from "node:net";
import path from "node:path";

function ipv4Parts(value) {
  const parts = String(value || "").split(".").map(Number);
  return parts.length === 4 && parts.every((part) => Number.isInteger(part) && part >= 0 && part <= 255)
    ? parts
    : null;
}

function privateIpv4(value) {
  const parts = ipv4Parts(value);
  if (!parts) return false;
  const [first, second] = parts;
  return first === 0
    || first === 10
    || first === 127
    || first >= 224
    || (first === 100 && second >= 64 && second <= 127)
    || (first === 169 && second === 254)
    || (first === 172 && second >= 16 && second <= 31)
    || (first === 192 && second === 168)
    || (first === 198 && (second === 18 || second === 19));
}

function expandedIpv6(value) {
  const address = String(value || "")
    .replace(/^\[|\]$/g, "")
    .split("%")[0]
    .toLowerCase();
  if (!address.includes(":")) return null;

  let source = address;
  const ipv4 = source.match(/(?:^|:)(\d{1,3}(?:\.\d{1,3}){3})$/)?.[1];
  if (ipv4) {
    const parts = ipv4Parts(ipv4);
    if (!parts) return null;
    const high = ((parts[0] << 8) | parts[1]).toString(16);
    const low = ((parts[2] << 8) | parts[3]).toString(16);
    source = `${source.slice(0, -ipv4.length)}${high}:${low}`;
  }

  const halves = source.split("::");
  if (halves.length > 2) return null;
  const left = halves[0] ? halves[0].split(":") : [];
  const right = halves.length === 2 && halves[1] ? halves[1].split(":") : [];
  const missing = 8 - left.length - right.length;
  if (missing < 0 || (halves.length === 1 && missing !== 0)) return null;
  const groups = [
    ...left,
    ...Array(halves.length === 2 ? missing : 0).fill("0"),
    ...right,
  ].map((group) => Number.parseInt(group || "0", 16));
  return groups.length === 8 && groups.every((group) => Number.isInteger(group) && group >= 0 && group <= 0xffff)
    ? groups
    : null;
}

function privateIpv6(value) {
  const groups = expandedIpv6(value);
  if (!groups) return false;
  if (groups.every((group) => group === 0)) return true;
  if (groups.slice(0, 7).every((group) => group === 0) && groups[7] === 1) return true;
  if ((groups[0] & 0xfe00) === 0xfc00) return true;
  if ((groups[0] & 0xffc0) === 0xfe80) return true;
  if ((groups[0] & 0xff00) === 0xff00) return true;
  if (groups.slice(0, 5).every((group) => group === 0) && groups[5] === 0xffff) {
    return privateIpv4(`${groups[6] >> 8}.${groups[6] & 0xff}.${groups[7] >> 8}.${groups[7] & 0xff}`);
  }
  return false;
}

export function isPrivateOrLocalHostname(value) {
  const host = String(value || "").replace(/^\[|\]$/g, "").toLowerCase();
  if (!host) return true;
  if (
    host === "localhost"
    || host === "localdomain"
    || host.endsWith(".localhost")
    || host.endsWith(".local")
    || host.endsWith(".lan")
    || host.endsWith(".internal")
  ) return true;
  if (isIP(host) === 4) return privateIpv4(host);
  if (isIP(host) === 6) return privateIpv6(host);
  return false;
}

export function validatePublicHttpUrl(value, {
  label = "Le lien",
  maxLength = 2_000,
} = {}) {
  const input = String(value || "").trim();
  if (!input) return "";
  if (input.length > maxLength) throw new Error(`${label} est trop long.`);
  let parsed;
  try {
    parsed = new URL(input);
  } catch {
    throw new Error(`${label} doit être une URL complète.`);
  }
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error(`${label} doit commencer par http:// ou https://.`);
  }
  if (parsed.username || parsed.password) {
    throw new Error(`${label} ne doit pas contenir d’identifiant ni de mot de passe.`);
  }
  if (isPrivateOrLocalHostname(parsed.hostname)) {
    throw new Error(`${label} ne peut pas cibler une adresse locale ou privée.`);
  }
  return parsed.toString();
}

export async function resolvePublicAddress(hostname, lookupFunction = dnsLookup) {
  const host = String(hostname || "").replace(/^\[|\]$/g, "");
  if (isPrivateOrLocalHostname(host)) {
    throw new Error("Adresse locale ou privée non autorisée.");
  }
  const literalFamily = isIP(host);
  if (literalFamily) return { address: host, family: literalFamily };
  const addresses = await lookupFunction(host, { all: true, verbatim: true });
  const entries = Array.isArray(addresses) ? addresses : [addresses];
  if (!entries.length || entries.some((entry) => isPrivateOrLocalHostname(entry?.address))) {
    throw new Error("Le nom de domaine pointe vers une adresse locale ou privée.");
  }
  const selected = entries.find((entry) => entry?.family === 4) || entries[0];
  if (!selected?.address || ![4, 6].includes(selected.family)) {
    throw new Error("Le nom de domaine n’a pas pu être résolu.");
  }
  return { address: selected.address, family: selected.family };
}

export async function atomicWriteFile(filePath, data, options = undefined) {
  const directory = path.dirname(filePath);
  const temporaryPath = path.join(
    directory,
    `.${path.basename(filePath)}.${process.pid}.${randomUUID()}.tmp`
  );
  try {
    await writeFile(temporaryPath, data, options);
    await rename(temporaryPath, filePath);
  } catch (error) {
    await unlink(temporaryPath).catch(() => {});
    throw error;
  }
}
