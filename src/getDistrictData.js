const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../data");

function getDistrictData(regionName) {
  const files = fs.readdirSync(dataPath);
  for (const file of files) {
    const regionData = JSON.parse(fs.readFileSync(path.join(dataPath, file)));
    if (regionData.REGION === regionName) {
      return regionData.DISTRIC.map((district) => ({
        district: district.NAME,
        postcode: district.POSTCODE,
      }));
    }
  }
  return null;
}

module.exports = getDistrictData;
