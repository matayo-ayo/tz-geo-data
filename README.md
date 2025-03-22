# 🗺️ Tanzania Geolocation Data

Karibu kwenye tz-geo-data, npm package hii kwa data za geo data za Tanzania.
Package hii ni maalumu kwa taarifa zifuatazo

- Mikoa
- Wilaya
- Kata
- Mitaa
- postkodi za eneo

---

## 1. Installation

```bash
npm i tz-geo-data
```

## 2. Matumizi

### a. Kwa kutumia import

```javascript
import {
  getAllRegions,
  getDistrictData,
  getWardData,
  getStreetsData,
  getGeoData,
} from "tz-geo-data";

// List ya mikoa
getAllRegions();
// List za wilaya katika mkoa
getDistrictData("JinaLaMkoa");
// List ya kata katika wilaya husika
getWardData("jinaLaMkoa", "jinaLaWilaya");
// List ya mitaa katika kata husika
getStreetsData("jinaLaMkoa", "jinaLaWilaya", "jinaLaKata");
// Data kutokana na postkodi
getGeoData("postikodi");
```

### b. Kwa kutumia require

```javascript
const {
  getAllRegions,
  getDistrictData,
  getWardData,
  getStreetsData,
  getGeoData,
} = require("tz-geo-data");

// List ya mikoa
getAllRegions();
// List za wilaya katika mkoa
getDistrictData("JinaLaMkoa");
// List ya kata katika wilaya husika
getWardData("jinaLaMkoa", "jinaLaWilaya");
// List ya mitaa katika kata husika
getStreetsData("jinaLaMkoa", "jinaLaWilaya", "jinaLaKata");
// Data kutokana na postkodi
getGeoData("postikodi");
```

---

## 3. Tafsiri ya baadhi ya errors
Tunategemea kila kitu kiwe sawa ila ukikutana na magumu hizi zitakusaidia

- ### getAllRegions()
- "Imeshindwa kupata list ya mikoa"
- - Futa node caches na ufanye installation ya library upya

### getDistrictData()
- "Wilaya haukupatikana katika mkoa"
- - Hakikisha jina la mkoa ni sahihi
- - Kwa mikoa yenye nafasi kama dar zingatia nafasi au tumia (-)

### getWardData()
- "Mkoa haukupatikana"
- - Hakikisha jina la mkoa ni sahihi
- "Wilaya haikupatikana katika mkoa"
- - Hakikisha jina la wilaya ni sahihi
- "Hakuna kata katika wilaya"
- - Kata ndani ya Wilaya hazikupatikana

### getStreetsData();
- "Mkoa haukupatikana"
- - Hakikisha jina la mkoa ni sahihi
- "Wilaya haikupatikana katika mkoa"
- - Hakikisha jina la wilaya ni sahihi
- "Hakuna kata katika wilaya"
- - Kata ndani ya Wilaya hazikupatikana
- "Mitaa haikupatikana katika kata"
- - Mitaa ndani ya kata haikupatikana

### getGeoData()
- "postcode si sahihi"
- - Namba za postikodi si sahihi
- - Namba za postikodi ziwe kuanzia mbili hadi tano