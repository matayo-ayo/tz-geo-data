// regions
import arusha from './regions/arusha.json';
import darEsSalaam from './regions/dar-es-salaam.json';
import dodoma from './regions/dodoma.json';
import geita from './regions/geita.json';
import iringa from './regions/iringa.json';
import kagera from './regions/kagera.json';
import katavi from './regions/katavi.json';
import kigoma from './regions/kigoma.json';
import kilimanjaro from './regions/kilimanjaro.json';
import lindi from './regions/lindi.json';
import manyara from './regions/manyara.json';
import mara from './regions/mara.json';
import mbeya from './regions/mbeya.json';
import morogoro from './regions/morogoro.json';
import mtwara from './regions/mtwara.json';
import mwanza from './regions/mwanza.json';
import njombe from './regions/njombe.json';
import pwani from './regions/pwani.json';
import rukwa from './regions/rukwa.json';
import ruvuma from './regions/ruvuma.json';
import shinyanga from './regions/shinyanga.json';
import simiyu from './regions/simiyu.json';
import singida from './regions/singida.json';
import songwe from './regions/songwe.json';
import tabora from './regions/tabora.json';
import tanga from './regions/tanga.json';

const regions = [arusha, darEsSalaam, dodoma, geita, iringa, kagera, katavi, kigoma, kilimanjaro, lindi, manyara, mara, mbeya, morogoro, mtwara, mwanza, njombe, pwani, rukwa, ruvuma, shinyanga, simiyu, singida, songwe, tabora, tanga].flat();

const formatString = (str) => str.trim().toLowerCase().replace(/\s+/g, '-');

// getAllRegions
export function getAllRegions() {
  try {
    const regionsData = regions.map((region) => ({
      region: region.REGION,
      postcode: region.POSTCODE,
    }));
    return regionsData.sort((a, b) => a.region.localeCompare(b.region));
  } catch (error) {
    throw new Error('Imeshindwa kupata list ya mikoa');
  }
}

// getDistrictData
export function getDistrictData(regionName) {
  try {
    const region = regions.find(
      (r) => formatString(r.REGION) === formatString(regionName)
    );
    if (!region) throw new Error(`Wilaya haikupatikana katika mkoa ${regionName}`);
    return region.DISTRIC.map((district) => ({
      name: district.NAME,
      postcode: district.POSTCODE,
    })).sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    throw error;
  }
}

// getWardData
export function getWardData(regionName, districtName) {
  try {
    const region = regions.find(
      (r) => formatString(r.REGION) === formatString(regionName)
    );
    if (!region) throw new Error(`Mkoa ${regionName} haukupatikana`);
    const district = region.DISTRIC.find(
      (d) => formatString(d.NAME) === formatString(districtName)
    );
    if (!district) throw new Error(`Wilaya ${districtName} haikupatikana katika mkoa ${regionName}`);
    if (!district.WARD || district.WARD.length === 0) throw new Error(`Hakuna kata katika wilaya ya ${districtName}`);
    return district.WARD.map((ward) => ({
      name: ward.NAME,
      postcode: ward.POSTCODE,
    })).sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    throw error;
  }
}

// getStreetsData
export function getStreetsData(regionName, districtName, wardName) {
  try {
    const region = regions.find(
      (r) => formatString(r.REGION) === formatString(regionName)
    );
    if (!region) throw new Error(`Mkoa ${regionName} haukupatikana`);

    const district = region.DISTRIC.find(
      (d) => formatString(d.NAME) === formatString(districtName)
    );
    if (!district) throw new Error(`Wilaya ${districtName} haikupatikana katika mkoa ${regionName}`);

    const ward = district.WARD.find(
      (w) => formatString(w.NAME) === formatString(wardName)
    );
    if (!ward) throw new Error(`Kata ${wardName} haikupatikana katika wilaya ${districtName}`);
    if (!ward.STREETS || ward.STREETS.length === 0) throw new Error(`Mitaa haikupatikana katika kata ${wardName}`);

    return ward.STREETS.map((street) => ({
      name: street.NAME,
      places: street.PLACES || [],
    })).sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    throw error;
  }
}

// getGeoData
export function getGeoData(postcode) {
  try {
    const searchPostcode = String(postcode).trim();
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
              places: street.PLACES || [],
            })).sort((a, b) => a.name.localeCompare(b.name));

            return result;
          }

          for (const street of ward.STREETS) {
            if (street.PLACES.includes(searchPostcode)) {
              result.region = region.REGION;
              result.regionPostcode = region.POSTCODE;
              result.district = district.NAME;
              result.districtPostcode = district.POSTCODE;
              result.ward = ward.NAME;
              result.wardPostcode = ward.POSTCODE;
              result.streets = [
                {
                  name: street.NAME,
                  places: street.PLACES,
                },
              ];
              return result;
            }
          }
        }
      }
    }

    throw new Error(`Postcode ${postcode} si sahihi`);
  } catch (error) {
    console.error('Error in getGeoData:', error);
    throw error;
  }
}
