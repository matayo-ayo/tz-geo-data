const fs = require("fs");
const path = require("path");

function getRegionData(regionName) {
  const regionData = loadRegionData(regionName);
  if (regionData) {
    return { REGION: regionData.REGION, POSTCODE: regionData.POSTCODE };
  }
  return `Mkoa haukupatinaka`; // Region not found
}

// Function to read region data from a JSON file
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
    return null; // Region file not found or error in reading the file
  }
}

module.exports = getRegionData;
