const fs = require("fs");
const path = require("path");

function getRegionData(regionName) {
  const regionData = loadRegionData(regionName);
  if (regionData) {
    return { REGION: regionData.REGION, POSTCODE: regionData.POSTCODE };
  }
  return `Mkoa haukupatinaka`;
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
    return null;
  }
}

module.exports = getRegionData;
