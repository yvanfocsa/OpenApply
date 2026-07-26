import assert from "node:assert/strict";
import {
  extractClipboardOfferLinks,
  extractOfferLinks,
  mergePastedOfferLinks,
} from "../app/public/link-import.js";

function clipboardData(formats) {
  return {
    getData(type) {
      return formats[type] || "";
    },
  };
}

assert.deepEqual(
  extractOfferLinks("https://a.example/jobs/1\thttps://b.example/jobs/2\nhttps://c.example/jobs/3"),
  [
    "https://a.example/jobs/1",
    "https://b.example/jobs/2",
    "https://c.example/jobs/3",
  ]
);

assert.deepEqual(
  extractClipboardOfferLinks(clipboardData({
    "text/plain": "Analyste SOC\tConsultant GRC",
    "text/html": `
      <table>
        <tr>
          <td><a href="https://jobs.example/analyste?source=excel&amp;lang=fr">Analyste SOC</a></td>
          <td><a href='https://careers.example/consultant-grc'>Consultant GRC</a></td>
        </tr>
      </table>
    `,
  })),
  [
    "https://jobs.example/analyste?source=excel&lang=fr",
    "https://careers.example/consultant-grc",
  ]
);

assert.deepEqual(
  extractClipboardOfferLinks(clipboardData({
    "text/plain": "https://jobs.example/1\nhttps://jobs.example/1",
    "text/uri-list": "# Export Excel\nhttps://jobs.example/2",
    "text/html": '<a href="https://jobs.example/3">Poste 3</a>',
  })),
  [
    "https://jobs.example/1",
    "https://jobs.example/2",
    "https://jobs.example/3",
  ]
);

assert.deepEqual(
  extractOfferLinks('(https://jobs.example/1), "https://jobs.example/2"; javascript:alert(1)'),
  [
    "https://jobs.example/1",
    "https://jobs.example/2",
  ]
);

assert.deepEqual(
  mergePastedOfferLinks(
    [""],
    0,
    [
      "https://jobs.example/soc",
      "https://jobs.example/grc",
      "https://jobs.example/pentest",
    ],
    10
  ),
  {
    links: [
      "https://jobs.example/soc",
      "https://jobs.example/grc",
      "https://jobs.example/pentest",
    ],
    includedPasted: [
      "https://jobs.example/soc",
      "https://jobs.example/grc",
      "https://jobs.example/pentest",
    ],
    omittedPasted: [],
    firstPastedIndex: 0,
    lastPastedIndex: 2,
    truncated: false,
  }
);

assert.deepEqual(
  mergePastedOfferLinks(
    ["https://jobs.example/existing-1", "", "https://jobs.example/existing-2"],
    1,
    ["https://jobs.example/new-1", "https://jobs.example/new-2"],
    10
  ).links,
  [
    "https://jobs.example/existing-1",
    "https://jobs.example/new-1",
    "https://jobs.example/new-2",
    "https://jobs.example/existing-2",
  ]
);

const limitedMerge = mergePastedOfferLinks(
  ["https://jobs.example/existing", ""],
  1,
  Array.from({ length: 12 }, (_, index) => `https://jobs.example/${index + 1}`),
  10
);
assert.equal(limitedMerge.links.length, 10);
assert.equal(limitedMerge.includedPasted.length, 9);
assert.equal(limitedMerge.omittedPasted.length, 3);
assert.equal(limitedMerge.truncated, true);

console.log("link-import: ok");
