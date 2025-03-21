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

Tumia amri hii kusanikisha maktaba:

```bash
npm install tz-geo-data
```

## 2. Matumizi

### a. Kwa kutumia import

```javascript
import tzGeoData from "tz-geo-data";

// List ya mikoa
tzGeoData.getAllRegions();
// List za wilaya katika mkoa
tzGeoData.getRegionData("JinaLaMkoa");
// List ya kata katika wilaya husika
tzGeoData.getWardsInDistrict("jinaLaMkoa", "jinaLaWilaya");
// List ya mitaa katika kata husika
tzGeoData.getStreetsInWard("jinaLaMkoa", "jinaLaWilaya", "jinaLaKata");
// Data kutokana na postkodi
tzGeoData.searchByPostcode("postikodi");
```

### b. Kwa kutumia require

```javascript
const tzGeoData = require("tz-geo-data");

// List ya mikoa
tzGeoData.getAllRegions();
// List za wilaya katika mkoa
tzGeoData.getRegionData("JinaLaMkoa");
// List ya kata katika wilaya husika
tzGeoData.getWardsInDistrict("jinaLaMkoa", "jinaLaWilaya");
// List ya mitaa katika kata husika
tzGeoData.getStreetsInWard("jinaLaMkoa", "jinaLaWilaya", "jinaLaKata");
// Data kutokana na postkodi
tzGeoData.searchByPostcode("postikodi");
```

---

## 3. Tafsiri ya baadhi ya jumbe

### "Mkoa haukupatikana"
- Jina la mkoa si sahihi

### "Wilaya haukupatikana"
- Jina la Mkoa au Wilaya si sahihi

### "Mitaa haikupatikana"
- Jina la Mkoa, Wilaya au Kata si sahihi

### "Hakuna eneo lenye postikodi hii"
- Namba ya postikodi si sahihi. Andika postikodi kwa usahihi