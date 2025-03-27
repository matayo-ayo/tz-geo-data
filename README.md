# 🗺️ tz-geo-data

Welcome, this package is for poviding Tanzanian geodata info. It covers the following functions

- Regions
- Districts in region
- Wards in district
- Streets and small towns in wards
- Postcode to location info

[Sample site](https://tz-geo-data.vercel.app/)

---

### note down before installation

**Use version 2.0.1**
- Using `comonJS`
- Not using `nextJs`
- Getting this bug `fs error`
- Getting this bug `throw new ERR_IMPORT_ATTRIBUTE_MISSING(url, 'type', validType)`

**Use version 2.1.5**
- You're using `nextJs`
- Having this bug `fs error`
- Having this bug `throw new ERR_IMPORT_ATTRIBUTE_MISSING(url, 'type', validType)`
---

## 1. Installation
```bash
npm i tz-geo-data # Latest version
# or
npm i tz-geo-data@2.1.5 # Version 2.1.5 for nextJs
```

## 2. Usage

### a. Using import
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

## 3. Errors
_We hope everything to work fine, But things slide away then here is your guide_

### getAllRegions()
"Failed to get region list"
- Delete node caches and make a library clean installation

### getDistrictData()
"Failed to get districts from region"
- Double check region name _(spellings, Symbols and space)_
- **Hint :** Regions with more than one word use (-) or space

### getWardData
"Region not found"
-  Double check region name
"District not found in"
-  Double check district name
"No wards found"
-  No wards in found dstrict

### getStreetsData();
"Region not found"
- Double check region name
"District not found in"
- Double check district name
"No wards found"
- No wards in found dstrict
"Streets not found"
- Streets not found in selected ward

### getGeoData()
"Incorrect postcode"
- Incorect postcode number
- Postcode numbers should be 2 to 5 digits