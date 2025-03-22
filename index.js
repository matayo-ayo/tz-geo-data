const fs = require("fs");
const path = require("path");
const dataPath = path.join(__dirname, "data");

function readJSONFiles() {
  const files = fs
    .readdirSync(dataPath)
    .filter((file) => file.endsWith(".json"));

  return files.flatMap((file) => {
    const filePath = path.join(dataPath, file);
    try {
      const data = JSON.parse(fs.readFileSync(filePath));
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      return error.message;
    }
  });
}

//getAllRegions
function getAllRegions() {
  try {
    const regions = readJSONFiles().map((region) => ({
      region: region.REGION,
      postcode: region.POSTCODE,
    }));
    return regions.sort((a, b) => a.region.localeCompare(b.region));
  } catch (error) {
    return `Imeshindwa kupata list ya mikoa`;
  }
}

// getDistrictData
function getDistrictData(regionName) {
  try {
    const regions = readJSONFiles();
    const formatString = (str) => str.trim().toLowerCase().replace(/\s+/g, "-");
    const region = regions.find(
      (r) => formatString(r.REGION) === formatString(regionName)
    );
    if (!region) throw new Error(`Wilaya haukupatikana katika mkoa ${regionName}`);
    return region.DISTRIC.map((district) => ({
      name: district.NAME,
      postcode: district.POSTCODE,
    })).sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    return error.message;
  }
}

//getWardData
function getWardData(regionName, districtName) {
  try {
    const regions = readJSONFiles();
    const formatString = (str) => str.trim().toLowerCase().replace(/\s+/g, "-");
    const region = regions.find(
      (r) => formatString(r.REGION) === formatString(regionName)
    );
    if (!region) throw new Error(`Mkoa ${regionName} haukupatikana`);
    const district = region.DISTRIC.find(
      (d) => formatString(d.NAME) === formatString(districtName)
    );
    if (!district)
      throw new Error(
        `Wilaya ${districtName} haikupatikana katika mkoa ${regionName}`
      );
    if (!district.WARD || district.WARD.length === 0)
      throw new Error(`Hakuna kata katika wilaya ya ${districtName}`);
    return district.WARD.map((ward) => ({
      name: ward.NAME,
      postcode: ward.POSTCODE,
    })).sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    return error.message;
  }
}

//getStreetsData
function getStreetsData(regionName, districtName, wardName) {
  try {
    const regions = readJSONFiles();
    const formatString = (str) => str.trim().toLowerCase().replace(/\s+/g, "-");
    const region = regions.find(
      (r) => formatString(r.REGION) === formatString(regionName)
    );
    if (!region) throw new Error(`Mkoa ${regionName} haukupatikana`);

    const district = region.DISTRIC.find(
      (d) => formatString(d.NAME) === formatString(districtName)
    );
    if (!district)
      throw new Error(
        `Wilaya ${districtName} haikupatikana katika mkoa ${regionName}`
      );

    const ward = district.WARD.find(
      (w) => formatString(w.NAME) === formatString(wardName)
    );
    if (!ward)
      throw new Error(
        `Kata ${wardName} haikupatikana katika wilaya ${districtName}`
      );

    if (!ward.STREETS || ward.STREETS.length === 0)
      throw new Error(`Mitaa haikupatikana katika kata ${wardName}`);

    return ward.STREETS.map((street) => ({
      name: street.NAME,
      places: street.PLACES || [],
    })).sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    return error.message;
  }
}

//getGeoData
function getGeoData(postcode) {
  try {
    const searchPostcode = String(postcode).trim();

    const regions = readJSONFiles();

    // 5 digits postcode
    if (searchPostcode.length === 5) {
      for (const region of regions) {
        for (const district of region.DISTRIC) {
          for (const ward of district.WARD) {
            const wardPostcode = String(ward.POSTCODE).trim();
            if (wardPostcode === searchPostcode) {
              return {
                region: region.REGION,
                regionPostcode: region.POSTCODE,
                district: district.NAME,
                districtPostcode: district.POSTCODE,
                ward: ward.NAME,
                wardPostcode: ward.POSTCODE,
              };
            }
          }
        }
      }
    }

    // 3 digits postcode
    if (searchPostcode.length === 3) {
      for (const region of regions) {
        for (const district of region.DISTRIC) {
          const districtPostcode = String(district.POSTCODE).trim();
          if (districtPostcode === searchPostcode) {
            return {
              region: region.REGION,
              regionPostcode: region.POSTCODE,
              district: district.NAME,
              districtPostcode: district.POSTCODE,
              ward: null,
              wardPostcode: null,
            };
          }
        }
      }
    }

    // 2 digits postcode
    if (searchPostcode.length === 2) {
      const region = regions.find(
        (r) => String(r.POSTCODE).trim() === searchPostcode
      );
      if (region) {
        return {
          region: region.REGION,
          regionPostcode: region.POSTCODE,
          district: null,
          districtPostcode: null,
          ward: null,
          wardPostcode: null,
        };
      }

      for (const region of regions) {
        for (const district of region.DISTRIC) {
          const districtPostcode = String(district.POSTCODE).trim();
          if (districtPostcode === searchPostcode) {
            return {
              region: region.REGION,
              regionPostcode: region.POSTCODE,
              district: district.NAME,
              districtPostcode: district.POSTCODE,
              ward: null,
              wardPostcode: null,
            };
          }
        }
      }
    }

    throw new Error(`postcode ${postcode} si sahihi`);
  } catch (error) {
    return error.message;
  }
}

module.exports = {
  getAllRegions,
  getDistrictData,
  getWardData,
  getStreetsData,
  getGeoData,
};
