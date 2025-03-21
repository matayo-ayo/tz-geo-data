const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../data");

function getWardData(regionName, districtName) {
  const files = fs.readdirSync(dataPath);
  for (const file of files) {
    const regionData = JSON.parse(fs.readFileSync(path.join(dataPath, file)));
    if (regionData.REGION === regionName) {
      for (const district of regionData.DISTRIC) {
        if (district.NAME === districtName) {
          return district.WARD.map((ward) => ({
            ward: ward.NAME,
            postcode: ward.POSTCODE,
          }));
        }
      }
    }
  }
  return null;
}

module.exports = getWardData;
