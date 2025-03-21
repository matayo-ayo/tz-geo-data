const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../data");

function getStreetsData(regionName, districtName, wardName) {
  const files = fs.readdirSync(dataPath);
  for (const file of files) {
    const regionData = JSON.parse(fs.readFileSync(path.join(dataPath, file)));
    if (regionData.REGION === regionName) {
      for (const district of regionData.DISTRIC) {
        if (district.NAME === districtName) {
          for (const ward of district.WARD) {
            if (ward.NAME === wardName) {
              return ward.STREETS.map((street) => ({
                street: street.NAME,
                places: street.PLACES,
              }));
            }
          }
        }
      }
    }
  }
  return null;
}

module.exports = getStreetsData;
