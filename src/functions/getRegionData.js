const fs = require("fs");
const path = require("path");

// Function to get region data for a specific region (place name and postcode)
function getRegionData(regionName) {
  const regionData = loadRegionData(regionName);
  if (regionData) {
    return { REGION: regionData.REGION, POSTCODE: regionData.POSTCODE }; // Return region name and postcode
  }
  return null; // Region not found
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
