const fs = require("fs");
const path = require("path");

// Function to get district names and postcodes in a specific region
function getDistrictsInRegion(regionName) {
  const regionData = loadRegionData(regionName);
  if (regionData) {
    return regionData.DISTRIC.map((district) => ({
      NAME: district.NAME,
      POSTCODE: district.POSTCODE,
    })); // Return district name and postcode
  }
  return []; // No districts found
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

module.exports = getDistrictsInRegion;
