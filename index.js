// regions
const arusha = require("./regions/arusha.json");
const darEsSalaam = require("./regions/dar-es-salaam.json");
const dodoma = require("./regions/dodoma.json");
const geita = require("./regions/geita.json");
const iringa = require("./regions/iringa.json");
const kagera = require("./regions/kagera.json");
const katavi = require("./regions/katavi.json");
const kigoma = require("./regions/kigoma.json");
const kilimanjaro = require("./regions/kilimanjaro.json");
const lindi = require("./regions/lindi.json");
const manyara = require("./regions/manyara.json");
const mara = require("./regions/mara.json");
const mbeya = require("./regions/mbeya.json");
const morogoro = require("./regions/morogoro.json");
const mtwara = require("./regions/mtwara.json");
const mwanza = require("./regions/mwanza.json");
const njombe = require("./regions/njombe.json");
const pwani = require("./regions/pwani.json");
const rukwa = require("./regions/rukwa.json");
const ruvuma = require("./regions/ruvuma.json");
const shinyanga = require("./regions/shinyanga.json");
const simiyu = require("./regions/simiyu.json");
const singida = require("./regions/singida.json");
const songwe = require("./regions/songwe.json");
const tabora = require("./regions/tabora.json");
const tanga = require("./regions/tanga.json");
const mjiniMagharibi = require("./regions/mjini-magharibi.json");
const kusiniUnguja = require("./regions/kusini-unguja.json");
const kaskaziniUnguja = require("./regions/kaskazini-unguja.json");
const kusiniPemba = require("./regions/kusini-pemba.json");
const kaskaziniPemba = require("./regions/kaskazini-pemba.json");

const regions = [
  arusha,
  darEsSalaam,
  dodoma,
  geita,
  iringa,
  kagera,
  katavi,
  kigoma,
  kilimanjaro,
  lindi,
  manyara,
  mara,
  mbeya,
  morogoro,
  mtwara,
  mwanza,
  njombe,
  pwani,
  rukwa,
  ruvuma,
  shinyanga,
  simiyu,
  singida,
  songwe,
  tabora,
  tanga,
  mjiniMagharibi,
  kusiniUnguja,
  kaskaziniUnguja,
  kusiniPemba,
  kaskaziniPemba,
].flat();

const formatString = (str) => {
  if (typeof str !== 'string' || !str.trim()) throw new TypeError('Location names must be non-empty strings');
  return str.trim().toLowerCase().replace(/[\s_-]+/g, '-');
};
const cleanPlaces = (places) => [...new Set((places || []).map(p => p.trim()).filter(Boolean))];

// getAllRegions
function getAllRegions() {
  try {
    const regionsData = regions.map((region) => ({
      region: region.REGION,
      postcode: region.POSTCODE,
    }));
    return regionsData.sort((a, b) => a.region.localeCompare(b.region));
  } catch (error) {
    throw new Error("Failed to get region list");
  }
}

// getDistrictData
function getDistrictData(regionName) {
  try {
    const region = regions.find(
      (r) => formatString(r.REGION) === formatString(regionName)
    );
    if (!region) throw new Error(`Failed to get districts from ${regionName}`);
    return region.DISTRIC.map((district) => ({
      name: district.NAME,
      postcode: district.POSTCODE,
    })).sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    throw error;
  }
}

// getWardData
function getWardData(regionName, districtName) {
  try {
    const region = regions.find(
      (r) => formatString(r.REGION) === formatString(regionName)
    );
    if (!region) throw new Error(`Region ${regionName} not found`);
    const district = region.DISTRIC.find(
      (d) => formatString(d.NAME) === formatString(districtName)
    );
    if (!district)
      throw new Error(`District ${districtName} not found in ${regionName}`);
    if (!district.WARD || district.WARD.length === 0)
      throw new Error(`No wards found in ${districtName}`);
    return district.WARD.map((ward) => ({
      name: ward.NAME,
      postcode: ward.POSTCODE,
    })).sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    throw error;
  }
}

// getStreetsData
function getStreetsData(regionName, districtName, wardName) {
  try {
    const region = regions.find(
      (r) => formatString(r.REGION) === formatString(regionName)
    );
    if (!region) throw new Error(`Region ${regionName} not found`);

    const district = region.DISTRIC.find(
      (d) => formatString(d.NAME) === formatString(districtName)
    );
    if (!district)
      throw new Error(`District ${districtName} not found in ${regionName}`);

    const ward = district.WARD.find(
      (w) => formatString(w.NAME) === formatString(wardName)
    );
    if (!ward) throw new Error(`Ward ${wardName} not found in ${districtName}`);
    if (!ward.STREETS || ward.STREETS.length === 0)
      throw new Error(`Streets not found in ${wardName}`);

    return ward.STREETS.map((street) => ({
      name: street.NAME,
      places: cleanPlaces(street.PLACES),
    })).sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    throw error;
  }
}

// getGeoData
function getGeoData(postcode) {
  try {
    const searchPostcode = String(postcode).trim();
    if (!/^\d{2,5}$/.test(searchPostcode)) throw new Error('Incorrect postcode ' + postcode);
    let result = {
      region: null,
      regionPostcode: null,
      district: null,
      districtPostcode: null,
      ward: null,
      wardPostcode: null,
      streets: [],
    };

    for (const region of regions) {
      if (String(region.POSTCODE).trim() === searchPostcode) {
        result.region = region.REGION;
        result.regionPostcode = region.POSTCODE;
        return result;
      }

      for (const district of region.DISTRIC) {
        if (String(district.POSTCODE).trim() === searchPostcode) {
          result.region = region.REGION;
          result.regionPostcode = region.POSTCODE;
          result.district = district.NAME;
          result.districtPostcode = district.POSTCODE;
          return result;
        }

        for (const ward of district.WARD) {
          if (String(ward.POSTCODE).trim() === searchPostcode) {
            result.region = region.REGION;
            result.regionPostcode = region.POSTCODE;
            result.district = district.NAME;
            result.districtPostcode = district.POSTCODE;
            result.ward = ward.NAME;
            result.wardPostcode = ward.POSTCODE;

            result.streets = ward.STREETS.map((street) => ({
              name: street.NAME,
              places: cleanPlaces(street.PLACES),
            })).sort((a, b) => a.name.localeCompare(b.name));

            return result;
          }


        }
      }
    }

    throw new Error(`Incorrect postcode ${postcode}`);
  } catch (error) {
    throw error;
  }
}

const { createLocationAPI } = require('./lib/locations.js');
module.exports = { getAllRegions, getDistrictData, getWardData, getStreetsData, getGeoData, ...createLocationAPI(regions) };
