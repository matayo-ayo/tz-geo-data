const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "data");

function getAllRegions() {
  const files = fs
    .readdirSync(dataPath)
    .filter((file) => file.endsWith(".json"));

  return files
    .map((file) => {
      const filePath = path.join(dataPath, file);

      let regionData;
      try {
        regionData = JSON.parse(fs.readFileSync(filePath));
      } catch (error) {
        console.error(`Error reading/parsing file ${filePath}:`, error);
        return null;
      }

      return regionData.map((region) => ({
        region: region.REGION,
        postcode: region.POSTCODE,
      }));
    })
    .filter((region) => region !== null);
}

function getDistrictData(regionName) {
  const files = fs
    .readdirSync(dataPath)
    .filter((file) => file.endsWith(".json"));

  console.log("Files found in data folder:", files);

  for (const file of files) {
    const filePath = path.join(dataPath, file);
    console.log("Reading file:", filePath);

    let regionData;
    try {
      regionData = JSON.parse(fs.readFileSync(filePath));
    } catch (error) {
      console.error(`Error reading/parsing file ${filePath}:`, error);
      return null;
    }

    if (regionData.REGION === regionName) {
      return regionData.DISTRIC.map((district) => ({
        district: district.NAME,
        postcode: district.POSTCODE,
      }));
    }
  }
  return null;
}

function getWardData(regionName, districtName) {
  const files = fs
    .readdirSync(dataPath)
    .filter((file) => file.endsWith(".json"));

  console.log("Files found in data folder:", files);

  for (const file of files) {
    const filePath = path.join(dataPath, file);
    console.log("Reading file:", filePath);

    let regionData;
    try {
      regionData = JSON.parse(fs.readFileSync(filePath));
    } catch (error) {
      console.error(`Error reading/parsing file ${filePath}:`, error);
      return null;
    }

    if (regionData.REGION === regionName) {
      for (const district of regionData.DISTRIC) {
        if (district.NAME === districtName) {
          return district.WARD.map((ward) => ({
            ward: ward.NAME,
            postcode: ward.POSTCODE,
          }));
        }
      }
    }
  }
  return null;
}

function getStreetsData(regionName, districtName, wardName) {
  const files = fs
    .readdirSync(dataPath)
    .filter((file) => file.endsWith(".json"));

  console.log("Files found in data folder:", files);

  for (const file of files) {
    const filePath = path.join(dataPath, file);
    console.log("Reading file:", filePath);

    let regionData;
    try {
      regionData = JSON.parse(fs.readFileSync(filePath));
    } catch (error) {
      console.error(`Error reading/parsing file ${filePath}:`, error);
      return null;
    }

    if (regionData.REGION === regionName) {
      for (const district of regionData.DISTRIC) {
        if (district.NAME === districtName) {
          for (const ward of district.WARD) {
            if (ward.NAME === wardName) {
              return ward.STREETS.map((street) => ({
                street: street.NAME,
                places: street.PLACES,
              }));
            }
          }
        }
      }
    }
  }
  return null;
}

function getGeoData(postcode) {
  const files = fs
    .readdirSync(dataPath)
    .filter((file) => file.endsWith(".json"));

  console.log("Files found in data folder:", files);

  for (const file of files) {
    const filePath = path.join(dataPath, file);
    console.log("Reading file:", filePath);

    let regionData;
    try {
      regionData = JSON.parse(fs.readFileSync(filePath));
    } catch (error) {
      console.error(`Error reading/parsing file ${filePath}:`, error);
      return null;
    }

    if (regionData.POSTCODE === postcode) {
      return {
        region: regionData.REGION,
        postcode: regionData.POSTCODE,
        districts: regionData.DISTRIC,
      };
    }

    for (const district of regionData.DISTRIC) {
      if (district.POSTCODE === postcode) {
        return {
          region: regionData.REGION,
          district: district.NAME,
          postcode: district.POSTCODE,
          wards: district.WARD,
        };
      }

      for (const ward of district.WARD) {
        if (ward.POSTCODE === postcode) {
          return {
            region: regionData.REGION,
            district: district.NAME,
            ward: ward.NAME,
            postcode: ward.POSTCODE,
            streets: ward.STREETS,
          };
        }
      }
    }
  }
  return null;
}

module.exports = {
  getAllRegions,
  getDistrictData,
  getWardData,
  getStreetsData,
  getGeoData,
};
