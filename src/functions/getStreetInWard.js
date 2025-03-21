const fs = require("fs");
const path = require("path");

function getStreetsInWard(regionName, wardName) {
  const ward = getWardData(regionName, wardName);
  if (ward) {
    return ward.STREETS.map((street) => ({
      NAME: street.NAME,
      PLACES: street.PLACES,
    }));
  }
  return [];
}

function getWardData(regionName, wardName) {
  const regionData = loadRegionData(regionName);
  if (regionData) {
    const ward = regionData.DISTRIC.flatMap((district) => district.WARD).find(
      (ward) => ward.NAME.toLowerCase() === wardName.toLowerCase()
    );
    return ward;
  }
  return `Mitaa haikupatikana`;
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
    return `Mitaa haikupatikana : ${error.message}`;
  }
}

module.exports = getStreetsInWard;
