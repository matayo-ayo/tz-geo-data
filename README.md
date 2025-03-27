# 🗺️ tz-geo-data

Welcome, this package is for poviding Tanzanian geodata info. It covers the following functions

- Regions
- Districts in region
- Wards in district
- Streets and small towns in wards
- Postcode to location info

---

# Note down before installation

- Use version 2.0.1 you are
- - Not using `nextJs`
- - Using `comonJS`
- - Getting this error `fs error`
- - Getting this error `throw new ERR_IMPORT_ATTRIBUTE_MISSING(url, 'type', validType)`

- Use version 2.1.1
- - Your using `nextJs`
- - Having `fs error` on development or building your app
- - Having `throw new ERR_IMPORT_ATTRIBUTE_MISSING(url, 'type', validType)`

---

## 1. Installation

```bash
npm i tz-geo-data # Latest version
npm i tz-geo-data@2.1.1 # Version 2.1.1 for nextJs
```

## 2. Matumizi

### a. Usng import

```javascript
import {
  getAllRegions,
  getDistrictData,
  getWardData,
  getStreetsData,
  getGeoData,
} from "tz-geo-data";

// Regions list
getAllRegions();
// Districts in region
getDistrictData("regionName");
// Wards in district and region
getWardData("regionName", "districtName");
// Streets and known places in a ward
getStreetsData("regionName", "districtName", "wardName");
// Geolocation Data using postcode
getGeoData("postcode");
```

### b. Using require

```javascript
const {
  getAllRegions,
  getDistrictData,
  getWardData,
  getStreetsData,
  getGeoData,
} = require("tz-geo-data");

// Regions list
getAllRegions();
// Districts in region
getDistrictData("regionName");
// Wards in district and region
getWardData("regionName", "districtName");
// Streets and known places in a ward
getStreetsData("regionName", "districtName", "wardName");
// Geolocation Data using postcode
getGeoData("postcode");
```

---

## 3. Tafsiri ya baadhi ya errors

We hope everything to work fine, But things slide away then here is your guide

- ### getAllRegions()
- "Failed to get region list"
- - Delete node caches and make a library clean installation

### getDistrictData()

- "Failed to get districts from region"
- - Double check region name _(spellings, Symbols and space)_
- - **Hint :** Regions with more than one word use (-) or space

### getWardData()

- "Region not found"
- - Double check region name
- "District not found in"
- - Double check district name
- "No wards found"
- - No wards in found dstrict

### getStreetsData();

- "Region not found"
- - Double check region name
- "District not found in"
- - Double check district name
- "No wards found"
- - No wards in found dstrict
- "Streets not found"
- - Streets not found in selected ward

### getGeoData()

- "Incorrect postcode"
- - Incorect postcode number
- - Postcode numbers should be 2 to 5 digits