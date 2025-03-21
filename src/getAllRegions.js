const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../data");

function getAllRegions() {
  const files = fs.readdirSync(dataPath);
  return files.map((file) => {
    const regionData = JSON.parse(fs.readFileSync(path.join(dataPath, file)));
    return {
      region: regionData.REGION,
      postcode: regionData.POSTCODE,
    };
  });
}

module.exports = getAllRegions;
