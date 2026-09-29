'use strict';

const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const { getDataCoverage } = require('../index.js');
const issues = [];
let blankPlaces = 0;
let duplicatePlaces = 0;
const wardCodes = new Map();
function checkSiblings(items, field, parent) {
  const seen = new Set();
  for (const item of items) {
    const name = item[field];
    if (typeof name !== 'string' || !name.trim()) issues.push({ type: 'missing-name', path: parent });
    else {
      const key = name.trim().toLowerCase().replace(/[\s_-]+/g, ' ');
      if (seen.has(key)) issues.push({ type: 'duplicate-name', path: [...parent, name] });
      seen.add(key);
      if (name !== name.trim()) issues.push({ type: 'name-whitespace', path: [...parent, name] });
    }
  }
}
for (const file of fs.readdirSync(path.join(root, 'regions')).filter(f => f.endsWith('.json')).sort()) {
  for (const r of JSON.parse(fs.readFileSync(path.join(root, 'regions', file), 'utf8'))) {
    checkSiblings(r.DISTRIC, 'NAME', [r.REGION]);
    for (const d of r.DISTRIC) {
      const dp = [r.REGION, d.NAME];
      if (!d.WARD.length) issues.push({ type: 'missing-wards', path: dp });
      if (!/^\d{3}$/.test(String(d.POSTCODE))) issues.push({ type: 'district-postcode-length', path: dp, postcode: d.POSTCODE });
      checkSiblings(d.WARD, 'NAME', dp);
      for (const w of d.WARD) {
        const wp = [...dp, w.NAME];
        if (!/^\d{5}$/.test(String(w.POSTCODE))) issues.push({ type: 'ward-postcode-length', path: wp, postcode: w.POSTCODE });
        if (wardCodes.has(w.POSTCODE)) issues.push({ type: 'shared-ward-postcode', path: wp, otherPath: wardCodes.get(w.POSTCODE), postcode: w.POSTCODE });
        else wardCodes.set(w.POSTCODE, wp);
        if (!w.STREETS.length) issues.push({ type: 'missing-streets', path: wp });
        checkSiblings(w.STREETS, 'NAME', wp);
        for (const s of w.STREETS) {
          const seen = new Set();
          for (const place of s.PLACES || []) {
            if (!place.trim()) blankPlaces++;
            else if (seen.has(place.trim())) duplicatePlaces++;
            else seen.add(place.trim());
          }
        }
      }
    }
  }
}
const report = { ...getDataCoverage(), blankPlaceEntries: blankPlaces, duplicatePlaceEntries: duplicatePlaces, issueCount: issues.length, issues };
fs.writeFileSync(path.join(root, 'data-quality.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ ...report, issues: undefined }, null, 2));
