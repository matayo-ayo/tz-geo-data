'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const api = require('tz-geo-data');

test('package supports require, named import, and default import', async () => {
  const esm = await import('tz-geo-data');
  assert.equal(esm.default, api);
  for (const name of Object.keys(api)) assert.equal(esm[name], api[name]);
  assert.equal(api.getAllRegions().length, 31);
});

test('legacy hierarchical APIs support normalized names and defensive results', () => {
  assert.deepEqual(api.getDistrictData(' Dar_es-Salaam '), api.getDistrictData('DAR ES SALAAM'));
  assert.ok(api.getWardData('Arusha', 'Arusha CBD').length);
  const streets = api.getStreetsData('Arusha', 'Arusha CBD', 'Sekei');
  assert.ok(streets.length);
  assert.ok(streets.every(s => s.places.every(Boolean)));
  streets[0].places.push('MUTATED');
  assert.ok(!api.getStreetsData('Arusha', 'Arusha CBD', 'Sekei')[0].places.includes('MUTATED'));
  assert.throws(() => api.getDistrictData(null), TypeError);
  assert.throws(() => api.getWardData('Arusha', 'nonexistent'), /not found/);
});

test('postcode lookup rejects place names and blank input', () => {
  assert.equal(api.getGeoData(23101).ward, 'SEKEI');
  assert.equal(api.getGeoData('23').region, 'ARUSHA');
  for (const input of ['', ' ', 'SANAWARI', '123456', null]) assert.throws(() => api.getGeoData(input), /Incorrect postcode/);
});

test('search includes every level and rejects ambiguous locations', () => {
  for (const level of ['region', 'district', 'ward', 'street', 'place']) {
    const matches = api.searchLocations('', { level, limit: 2 });
    assert.equal(matches.length, 2);
    assert.ok(matches.every(m => m.level === level));
    assert.deepEqual(api.searchLocations('', { level, offset: 1, limit: 1 }), [matches[1]]);
  }
  const street = api.resolveLocation({ region: 'Arusha', district: 'Arusha CBD', ward: 'Sekei', street: 'Sanawari' });
  assert.equal(street.level, 'street');
  assert.equal(street.postcode, 23101);
  assert.throws(() => api.resolveLocation({ street: 'MAJENGO' }), /Ambiguous/);
  assert.throws(() => api.resolveLocation({ region: 'not a region' }), /not found/);
  assert.throws(() => api.searchLocations('', { limit: 0 }), TypeError);
  assert.throws(() => api.resolveLocation({}), TypeError);
});

test('haversine handles known arcs, units, antipodes and invalid coordinates', () => {
  const a = { latitude: 0, longitude: 0 };
  const b = { latitude: 0, longitude: 1 };
  const km = api.calculateDistance(a, b);
  assert.ok(Math.abs(km - 111.19508) < 0.00001);
  assert.equal(api.calculateDistance(a, a), 0);
  assert.equal(api.calculateDistance(b, a), km);
  assert.equal(api.calculateDistance(a, b, { unit: 'm' }), km * 1000);
  assert.ok(Math.abs(api.calculateDistance(a, b, { unit: 'mi' }) - km / 1.609344) < 1e-10);
  assert.ok(Math.abs(api.calculateDistance(a, { latitude: 0, longitude: 180 }) - Math.PI * 6371.0088) < 1e-8);
  for (const point of [{ latitude: 91, longitude: 0 }, { latitude: 0, longitude: Infinity }, { latitude: '0', longitude: 0 }, null]) {
    assert.throws(() => api.calculateDistance(a, point), TypeError);
  }
  assert.throws(() => api.calculateDistance(a, b, { unit: 'feet' }), TypeError);
});

test('distance resolves regions through places without silently substituting coordinates', () => {
  for (const level of ['region', 'district', 'ward', 'street', 'place']) {
    const record = api.searchLocations('', { level, limit: 1 })[0];
    const selector = Object.fromEntries(['region','district','ward','street','place'].filter(k => record[k]).map(k => [k, record[k]]));
    const seen = [];
    assert.equal(api.getDistance(selector, selector, { resolveCoordinates(location) {
      seen.push(location.level);
      return { latitude: -6, longitude: 39 };
    }}), 0);
    assert.deepEqual(seen, [level, level]);
  }
  assert.throws(() => api.getDistance({ region: 'Arusha' }, { region: 'Tanga' }), /Coordinates unavailable/);
  assert.throws(() => api.getDistance({ region: 'Arusha' }, { region: 'Tanga' }, { resolveCoordinates: async () => ({ latitude: 0, longitude: 0 }) }), /synchronous/);
  assert.equal(api.getDistance({ latitude: 0, longitude: 0 }, { latitude: 0, longitude: 1 }), api.calculateDistance({ latitude: 0, longitude: 0 }, { latitude: 0, longitude: 1 }));
});

test('coverage makes missing data explicit', () => {
  const coverage = api.getDataCoverage();
  assert.equal(coverage.counts.region, 31);
  assert.equal(coverage.missingRegions.length, 0);
  assert.equal(coverage.hasCoordinates, false);
  coverage.counts.region = 0;
  assert.equal(api.getDataCoverage().counts.region, 31);
});
