const fs = require("fs");
const path = require("path");

// Function to get street names and places in a specific ward
function getStreetsInWard(regionName, wardName) {
  const ward = getWardData(regionName, wardName);
  if (ward) {
    return ward.STREETS.map((street) => ({
      NAME: street.NAME,
      PLACES: street.PLACES,
    })); // Return street name and places (which can be interpreted as the postcode or other names)
  }
  return []; // No streets found
}

// Function to get data for a specific ward (used in getStreetsInWard)
function getWardData(regionName, wardName) {
  const regionData = loadRegionData(regionName);
  if (regionData) {
    const ward = regionData.DISTRIC.flatMap((district) => district.WARD).find(
      (ward) => ward.NAME.toLowerCase() === wardName.toLowerCase()
    );
    return ward;
  }
  return null; // Ward not found in region
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

module.exports = getStreetsInWard;
