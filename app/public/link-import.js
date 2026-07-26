function decodeHtmlAttribute(value) {
  return String(value || "")
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", "\"")
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function isHttpUrl(value) {
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

function cleanLinkCandidate(value) {
  return decodeHtmlAttribute(value)
    .trim()
    .replace(/^[("'[\]<>]+/, "")
    .replace(/[)"'\]>,;.]+$/, "");
}

function uniqueHttpLinks(values) {
  const seen = new Set();
  const links = [];
  values.forEach((value) => {
    const candidate = cleanLinkCandidate(value);
    if (!isHttpUrl(candidate) || seen.has(candidate)) return;
    seen.add(candidate);
    links.push(candidate);
  });
  return links;
}

export function extractOfferLinks(value) {
  return uniqueHttpLinks(
    String(value || "")
      .split(/[\s,;]+/)
      .filter(Boolean)
  );
}

function extractHtmlLinks(value) {
  const links = [];
  const html = String(value || "");
  const hrefPattern = /\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi;
  for (const match of html.matchAll(hrefPattern)) {
    links.push(match[1] || match[2] || match[3] || "");
  }
  return uniqueHttpLinks(links);
}

export function extractClipboardOfferLinks(clipboardData) {
  if (!clipboardData || typeof clipboardData.getData !== "function") return [];
  const plainText = clipboardData.getData("text/plain") || clipboardData.getData("text") || "";
  const uriList = clipboardData.getData("text/uri-list") || "";
  const html = clipboardData.getData("text/html") || "";
  return uniqueHttpLinks([
    ...extractOfferLinks(plainText),
    ...extractOfferLinks(uriList.replace(/^\s*#.*$/gm, "")),
    ...extractHtmlLinks(html),
  ]);
}

export function mergePastedOfferLinks(existing, index, pasted, limit = 10) {
  const current = Array.isArray(existing) ? existing : [];
  const insertionIndex = Math.max(0, Math.min(Number(index) || 0, Math.max(0, current.length - 1)));
  const prefix = current.slice(0, insertionIndex).map((value) => String(value || "").trim()).filter(Boolean);
  const suffix = current.slice(insertionIndex + 1).map((value) => String(value || "").trim()).filter(Boolean);
  const pastedLinks = uniqueHttpLinks(Array.isArray(pasted) ? pasted : []);
  const combined = [...new Set([...prefix, ...pastedLinks, ...suffix])];
  const links = combined.slice(0, Math.max(1, Number(limit) || 10));
  const includedPasted = pastedLinks.filter((link) => links.includes(link));
  const pastedIndices = includedPasted.map((link) => links.indexOf(link));
  return {
    links: links.length ? links : [""],
    includedPasted,
    omittedPasted: pastedLinks.filter((link) => !links.includes(link)),
    firstPastedIndex: pastedIndices.length ? Math.min(...pastedIndices) : -1,
    lastPastedIndex: pastedIndices.length ? Math.max(...pastedIndices) : 0,
    truncated: combined.length > links.length,
  };
}
