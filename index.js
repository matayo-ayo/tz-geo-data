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
      console.error(`Error reading/parsing file ${filePath}:`, error.message);
      return [];
    }
  });
}

//getAllRegions
function getAllRegions() {
  const regions = readJSONFiles().map((region) => ({
    region: region.REGION,
    postcode: region.POSTCODE,
  }));

  return regions.sort((a, b) => a.region.localeCompare(b.region));
}

// getDistrictData
function getDistrictData(regionName) {
  const region = readJSONFiles().find((region) => region.REGION === regionName);

  if (!region) return [];

  return region.DISTRIC.map((district) => ({
    name: district.NAME,
    postcode: district.POSTCODE,
  })).sort((a, b) => a.name.localeCompare(b.name));
}

//getWardData
function getWardData(regionName, districtName) {
  const region = readJSONFiles().find((region) => region.REGION === regionName);
  if (!region) return [];

  const district = region.DISTRIC.find(
    (district) => district.NAME === districtName
  );
  if (!district) return [];

  return district.WARD.map((ward) => ({
    name: ward.NAME,
    postcode: ward.POSTCODE,
  })).sort((a, b) => a.name.localeCompare(b.name));
}

//getStreetsData
function getStreetsData(regionName, districtName, wardName) {
  const region = readJSONFiles().find((region) => region.REGION === regionName);
  if (!region) return [];

  const district = region.DISTRIC.find(
    (district) => district.NAME === districtName
  );
  if (!district) return [];

  const ward = district.WARD.find((ward) => ward.NAME === wardName);
  if (!ward) return [];

  return ward.STREETS.map((street) => ({
    name: street.NAME,
    places: street.PLACES || [],
  })).sort((a, b) => a.name.localeCompare(b.name));
}

//getGeoData
function getGeoData(postcode) {
  const region = readJSONFiles().find(
    (region) =>
      region.POSTCODE === postcode ||
      region.DISTRIC.some(
        (d) =>
          d.POSTCODE === postcode ||
          d.WARD.some(
            (w) =>
              w.POSTCODE === postcode ||
              w.STREETS.some((s) => s.PLACES.includes(postcode))
          )
      )
  );

  if (!region) return null;

  const district = region.DISTRIC.find((d) => d.POSTCODE === postcode) || null;
  const ward = district?.WARD.find((w) => w.POSTCODE === postcode) || null;
  const street = ward?.STREETS.find((s) => s.PLACES.includes(postcode)) || null;

  return {
    region: region.REGION,
    regionPostcode: region.POSTCODE,
    district: district ? district.NAME : null,
    districtPostcode: district ? district.POSTCODE : null,
    ward: ward ? ward.NAME : null,
    wardPostcode: ward ? ward.POSTCODE : null,
    street: street ? street.NAME : null,
    places: street ? street.PLACES : [],
  };
}

module.exports = {
  getAllRegions,
  getDistrictData,
  getWardData,
  getStreetsData,
  getGeoData,
};
