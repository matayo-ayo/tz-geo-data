const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../data");

function getGeoData(postcode) {
  const files = fs.readdirSync(dataPath);
  for (const file of files) {
    const regionData = JSON.parse(fs.readFileSync(path.join(dataPath, file)));
    if (regionData.POSTCODE === postcode) {
      return {
        region: regionData.REGION,
        postcode: regionData.POSTCODE,
        districts: regionData.DISTRIC,
      };
    }
    for (const district of regionData.DISTRIC) {
      if (district.POSTCODE === postcode) {
        return {
          region: regionData.REGION,
          district: district.NAME,
          postcode: district.POSTCODE,
          wards: district.WARD,
        };
      }
      for (const ward of district.WARD) {
        if (ward.POSTCODE === postcode) {
          return {
            region: regionData.REGION,
            district: district.NAME,
            ward: ward.NAME,
            postcode: ward.POSTCODE,
            streets: ward.STREETS,
          };
        }
      }
    }
  }
  return null;
}

module.exports = getGeoData;
