const fs = require("fs");
const path = require("path");

// Function to get all regions (place name and postcode)
function getAllRegions() {
  const regionFiles = fs.readdirSync(path.join(__dirname, "..", "regions"));
  return regionFiles.map((file) => {
    const regionData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "..", "regions", file), "utf-8")
    );
    return { REGION: regionData.REGION, POSTCODE: regionData.POSTCODE }; // Return region name and postcode
  });
}

module.exports = getAllRegions;
