'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const snapshot = require('../sources/zanzibar-tcra.json');
const clean = value => value.trim().replace(/\s+/g, ' ').toUpperCase();
const expected = ['MJINI MAGHARIBI', 'KUSINI UNGUJA', 'KASKAZINI UNGUJA', 'KUSINI PEMBA', 'KASKAZINI PEMBA'];
assert.deepEqual(snapshot.regions.map(r => clean(r.locationName)).sort(), [...expected].sort());
const output = [];
for (const region of snapshot.regions) {
  // Search also matches identically named mainland localities. Match source IDs.
  const rows = region.locations.filter(row => row.regionId === region.locationId);
  assert.ok(rows.every(row => ['WARD', 'SHEHIA'].includes(row.locationType)));
  const wardIds = new Set(region.districts.flatMap(d => d.wards.map(w => w.locationId)));
  assert.ok(rows.every(row => wardIds.has(row.wardId)), 'Unmatched locality');
  const districts = region.districts.map(district => {
    const wards = district.wards.map(ward => {
      assert.match(ward.postcode, /^7[1-5]\d{3}$/);
      const localities = rows.filter(row => row.wardId === ward.locationId && row.locationType === 'SHEHIA');
      assert.ok(localities.length, 'Ward has no shehia: ' + ward.locationName);
      for (const row of localities) {
        assert.equal(row.districtId, district.locationId);
        assert.equal(row.wardPostcode, ward.postcode);
      }
      const streets = localities.map(row => ({ NAME: clean(row.locationName), TYPE: 'SHEHIA', PLACES: [] }))
        .sort((a,b) => a.NAME.localeCompare(b.NAME));
      assert.equal(new Set(streets.map(s => s.NAME)).size, streets.length, 'Duplicate shehia');
      return { NAME: clean(ward.locationName), POSTCODE: Number(ward.postcode), STREETS: streets };
    }).sort((a,b) => a.POSTCODE - b.POSTCODE);
    const prefixes = new Set(wards.map(w => Math.floor(w.POSTCODE / 100)));
    assert.equal(prefixes.size, 1, 'District has inconsistent postcode prefixes');
    // Existing API stores region/district prefixes, not standalone delivery codes.
    return { NAME: clean(district.locationName).replace(/"/g, ''), POSTCODE: [...prefixes][0], WARD: wards };
  }).sort((a,b) => a.POSTCODE - b.POSTCODE);
  const prefixes = new Set(districts.map(d => Math.floor(d.POSTCODE / 10)));
  assert.equal(prefixes.size, 1, 'Region has inconsistent postcode prefixes');
  const data = { REGION: clean(region.locationName), POSTCODE: [...prefixes][0], DISTRIC: districts };
  output.push({ filename: data.REGION.toLowerCase().replace(/ /g, '-') + '.json', data: [data] });
}
// Validate the entire snapshot before writing any region files.
for (const entry of output) fs.writeFileSync(path.join(__dirname, '..', 'regions', entry.filename), JSON.stringify(entry.data, null, 2) + '\n');
console.log('Imported 5 Zanzibar regions from ' + snapshot.retrievedAt);
