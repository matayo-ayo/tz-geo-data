const fs = require("fs");
const path = require("path");

// Function to get ward names and postcodes in a specific district and region
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
      })); // Return ward name and postcode
    }
  }
  return []; // No wards found
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

module.exports = getWardsInDistrict;
