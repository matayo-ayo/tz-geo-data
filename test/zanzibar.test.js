'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const api = require('tz-geo-data');
const source = require('../sources/zanzibar-tcra.json');
const clean = value => value.trim().replace(/\s+/g, ' ').toUpperCase();

test('all five Zanzibar regions and eleven districts are exposed', async () => {
  const esm = await import('tz-geo-data');
  let districts = 0;
  for (const region of source.regions) {
    const name = clean(region.locationName);
    assert.ok(api.getAllRegions().some(r => r.region === name));
    assert.deepEqual(esm.getDistrictData(name), api.getDistrictData(name));
    districts += api.getDistrictData(name).length;
  }
  assert.equal(districts, 11);
  assert.deepEqual(api.getDistrictData('Mjini Magharibi').map(d => d.name), ['MAGHARIBI A', 'MAGHARIBI B', 'MJINI']);
  assert.equal(api.getGeoData(71).region, 'MJINI MAGHARIBI');
  assert.equal(api.getGeoData(713).district, 'MAGHARIBI B');
});

test('every imported ward and shehia matches its official source hierarchy', () => {
  let wards = 0;
  let shehia = 0;
  for (const region of source.regions) {
    const name = clean(region.locationName);
    for (const district of region.districts) {
      const districtName = clean(district.locationName).replace(/"/g, '');
      assert.equal(api.getWardData(name, districtName).length, district.wards.length);
      for (const ward of district.wards) {
        wards++;
        const result = api.getGeoData(ward.postcode);
        assert.equal(result.region, name);
        assert.equal(result.district, districtName);
        assert.equal(result.ward, clean(ward.locationName));
        const expected = region.locations.filter(row => row.regionId === region.locationId && row.wardId === ward.locationId && row.locationType === 'SHEHIA');
        assert.deepEqual(result.streets.map(s => s.name).sort(), expected.map(s => clean(s.locationName)).sort());
        assert.ok(result.streets.every(s => s.places.length === 0));
        shehia += result.streets.length;
      }
    }
    const raw = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'regions', name.toLowerCase().replace(/ /g, '-') + '.json')));
    assert.ok(raw[0].DISTRIC.flatMap(d => d.WARD).flatMap(w => w.STREETS).every(s => s.TYPE === 'SHEHIA'));
  }
  assert.equal(wards, 110);
  assert.equal(shehia, 388);
});

test('Zanzibar shehia support search, resolution and coordinate-based distances', () => {
  const selector = { region: 'Kusini Pemba', district: 'Chake Chake', ward: 'Kibokoni', street: 'Mgogoni' };
  const location = api.resolveLocation(selector);
  assert.equal(location.postcode, 74221);
  assert.equal(api.searchLocations('Mgogoni', { region: 'Kusini Pemba', level: 'street' }).length, 1);
  assert.equal(api.getDistance(selector, selector, { resolveCoordinates: () => ({ latitude: -5, longitude: 40 }) }), 0);
  assert.throws(() => api.getDistance(selector, { region: 'Arusha' }), /Coordinates unavailable/);
});
