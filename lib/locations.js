'use strict';

const levels = ['region', 'district', 'ward', 'street', 'place'];
const expectedRegions = ['ARUSHA', 'DAR ES SALAAM', 'DODOMA', 'GEITA', 'IRINGA', 'KAGERA',
  'KATAVI', 'KIGOMA', 'KILIMANJARO', 'LINDI', 'MANYARA', 'MARA', 'MBEYA', 'MOROGORO',
  'MTWARA', 'MWANZA', 'NJOMBE', 'PWANI', 'RUKWA', 'RUVUMA', 'SHINYANGA', 'SIMIYU',
  'SINGIDA', 'SONGWE', 'TABORA', 'TANGA', 'KASKAZINI UNGUJA', 'KUSINI UNGUJA',
  'MJINI MAGHARIBI', 'KASKAZINI PEMBA', 'KUSINI PEMBA'];
const normalize = value => value.trim().toLowerCase().replace(/[\s_-]+/g, ' ');
const clean = values => [...new Set((values || []).map(value => value.trim()).filter(Boolean))];

function coordinates(value) {
  if (!value || typeof value.latitude !== 'number' || typeof value.longitude !== 'number' ||
      !Number.isFinite(value.latitude) || !Number.isFinite(value.longitude) ||
      Math.abs(value.latitude) > 90 || Math.abs(value.longitude) > 180) {
    throw new TypeError('Coordinates require finite latitude (-90..90) and longitude (-180..180)');
  }
  return value;
}

/** Great-circle distance on a sphere; not road distance. */
function calculateDistance(from, to, options = {}) {
  coordinates(from);
  coordinates(to);
  const unit = options.unit === undefined ? 'km' : options.unit;
  const factors = { km: 1, m: 1000, mi: 1 / 1.609344 };
  if (!Object.hasOwn(factors, unit)) throw new TypeError('unit must be km, m, or mi');
  const rad = degrees => degrees * Math.PI / 180;
  const a = Math.sin(rad(to.latitude - from.latitude) / 2) ** 2 +
    Math.cos(rad(from.latitude)) * Math.cos(rad(to.latitude)) *
    Math.sin(rad(to.longitude - from.longitude) / 2) ** 2;
  return 6371.0088 * 2 * Math.asin(Math.sqrt(Math.max(0, Math.min(1, a)))) * factors[unit];
}

function createLocationAPI(regions) {
  let records;
  function all() {
    if (records) return records;
    records = [];
    function add(level, path, postcode) {
      records.push(Object.freeze({ level, name: path[level], ...path, postcode }));
    }
    for (const r of regions) {
      const rp = { region: r.REGION };
      add('region', rp, r.POSTCODE);
      for (const d of r.DISTRIC) {
        const dp = { ...rp, district: d.NAME };
        add('district', dp, d.POSTCODE);
        for (const w of d.WARD) {
          const wp = { ...dp, ward: w.NAME };
          add('ward', wp, w.POSTCODE);
          for (const s of w.STREETS) {
            const sp = { ...wp, street: s.NAME };
            add('street', sp, w.POSTCODE);
            for (const place of clean(s.PLACES)) add('place', { ...sp, place }, w.POSTCODE);
          }
        }
      }
    }
    return records;
  }

  function searchLocations(query, options = {}) {
    if (typeof query !== 'string') throw new TypeError('query must be a string');
    const { level, limit = 50, offset = 0 } = options;
    if (level !== undefined && !levels.includes(level)) throw new TypeError('Invalid location level');
    if (!Number.isInteger(limit) || limit < 1 || !Number.isInteger(offset) || offset < 0) {
      throw new TypeError('limit must be a positive integer and offset a non-negative integer');
    }
    for (const key of levels) {
      if (options[key] !== undefined && (typeof options[key] !== 'string' || !options[key].trim())) {
        throw new TypeError(key + ' must be a non-empty string');
      }
    }
    const term = normalize(query);
    return all().filter(record => (!level || record.level === level) && normalize(record.name).includes(term) &&
      levels.every(key => options[key] === undefined ||
        (record[key] !== undefined && normalize(record[key]) === normalize(options[key]))))
      .slice(offset, offset + limit).map(record => ({ ...record }));
  }

  function resolveLocation(selector) {
    if (!selector || typeof selector !== 'object' || Array.isArray(selector)) throw new TypeError('A location selector is required');
    const supplied = levels.filter(key => selector[key] !== undefined);
    if (!supplied.length) throw new TypeError('Specify region, district, ward, street, or place');
    const level = selector.level || supplied[supplied.length - 1];
    const matches = searchLocations('', { ...selector, level, limit: 2, offset: 0 });
    if (!matches.length) throw new Error('Location not found: ' + JSON.stringify(selector));
    if (matches.length > 1) throw new Error('Ambiguous location; specify its region, district, ward, and street as needed');
    return matches[0];
  }

  function getDistance(from, to, options = {}) {
    function point(input) {
      if (input && ('latitude' in Object(input) || 'longitude' in Object(input))) return coordinates(input);
      const location = resolveLocation(input);
      if (typeof options.resolveCoordinates !== 'function') {
        throw new Error('Coordinates unavailable for ' + location.name + '; provide resolveCoordinates or explicit coordinates');
      }
      const result = options.resolveCoordinates(location);
      if (result && typeof result.then === 'function') throw new TypeError('resolveCoordinates must be synchronous; fetch coordinates before calling getDistance');
      return coordinates(result);
    }
    return calculateDistance(point(from), point(to), options);
  }

  function getDataCoverage() {
    const counts = Object.fromEntries(levels.map(level => [level, 0]));
    for (const record of all()) counts[record.level]++;
    return {
      scope: 'Tanzania mainland and Zanzibar; bundled postal locality data, not a verified current administrative register',
      counts,
      missingRegions: expectedRegions.filter(name => !regions.some(region => normalize(region.REGION) === normalize(name))),
      hasCoordinates: false,
      completenessVerified: false,
    };
  }

  return { searchLocations, resolveLocation, calculateDistance, getDistance, getDataCoverage };
}

module.exports = { createLocationAPI };
