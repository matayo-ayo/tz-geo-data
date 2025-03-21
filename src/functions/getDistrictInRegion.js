const fs = require("fs");
const path = require("path");

function getDistrictsInRegion(regionName) {
  const regionData = loadRegionData(regionName);
  if (regionData) {
    return regionData.DISTRIC.map((district) => ({
      NAME: district.NAME,
      POSTCODE: district.POSTCODE,
    }));
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
    return `Wilaya hazikupatikana : ${error.message}`;
  }
}

module.exports = getDistrictsInRegion;
