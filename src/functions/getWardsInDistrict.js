const fs = require("fs");
const path = require("path");

function getWardsInDistrict(regionName, districtName) {
  const regionData = loadRegionData(regionName);
  if (regionData) {
    const district = regionData.DISTRIC.find(
      (district) => district.NAME.toLowerCase() === districtName.toLowerCase()
    );
    if (district) {
      return district.WARD.map((ward) => ({
        NAME: ward.NAME,
        POSTCODE: ward.POSTCODE,
      }));
    }
  }
  return [];
}

function loadRegionData(regionName) {
  const filePath = path.join(
    __dirname,
    "..",
    "regions",
    `${regionName.toLowerCase().replace(/\s+/g, "-")}.json`
  );
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return `Kata hazikupatikana : ${error.message}`;
  }
}

module.exports = getWardsInDistrict;
