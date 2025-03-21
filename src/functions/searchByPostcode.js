const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../data");
const regionFiles = fs.readdirSync(dataPath);

function searchByPostcode(postcode) {
  for (const file of regionFiles) {
    const regionData = JSON.parse(
      fs.readFileSync(path.join(dataPath, file), "utf-8")
    );

    for (const region of regionData) {
      if (region.POSTCODE === postcode) {
        return {
          type: "Region",
          name: region.REGION,
          postcode: region.POSTCODE,
        };
      }

      for (const district of region.DISTRIC) {
        if (district.POSTCODE === postcode) {
          return {
            type: "District",
            name: district.NAME,
            region: region.REGION,
            postcode: district.POSTCODE,
          };
        }

        for (const ward of district.WARD) {
          if (ward.POSTCODE === postcode) {
            return {
              type: "Ward",
              name: ward.NAME,
              district: district.NAME,
              region: region.REGION,
              postcode: ward.POSTCODE,
            };
          }

          for (const street of ward.STREETS) {
            if (street.PLACES.includes(postcode)) {
              return {
                type: "Street",
                name: street.NAME,
                ward: ward.NAME,
                district: district.NAME,
                region: region.REGION,
                postcode: postcode,
              };
            }
          }
        }
      }
    }
  }
  return { error: "Hakuna eneo lenye postikodi hii." };
}

module.exports = searchByPostcode;
