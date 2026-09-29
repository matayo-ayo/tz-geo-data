# tz-geo-data

Offline Tanzania location and postcode lookup for address forms, delivery applications, and location search. No runtime dependencies, filesystem reads, network requests, or API keys. Supports CommonJS, ES modules, and TypeScript.

## Install

```sh
npm install tz-geo-data
```

## CommonJS and ES modules

```js
const { getAllRegions, getDistrictData } = require('tz-geo-data');
```

```js
import { getAllRegions, getDistrictData } from 'tz-geo-data';
// A default import is also available.
import geo from 'tz-geo-data';
```

Node.js 18 or later. Both entry points use the same dataset. JSON import attributes are unnecessary. Browser bundlers can bundle the static JSON imports; the full national dataset is included, so check bundle size for client applications.

## Address and postcode lookup

```js
import { getAllRegions, getDistrictData, getWardData,
  getStreetsData, getGeoData } from 'tz-geo-data';

getAllRegions();
getDistrictData('Dar es Salaam');
getWardData('Arusha', 'Arusha CBD');
getStreetsData('Arusha', 'Arusha CBD', 'Sekei');
getGeoData('23101'); // SEKEI, ARUSHA CBD, ARUSHA, with streets
getDistrictData('Mjini Magharibi'); // MAGHARIBI A, MAGHARIBI B, MJINI
getStreetsData('Kusini Pemba', 'Chake Chake', 'Kibokoni'); // shehia
getGeoData('74221'); // KIBOKONI, CHAKE CHAKE, KUSINI PEMBA
```

Names accept case differences, surrounding whitespace, spaces, hyphens, and underscores. Legacy return shapes are preserved: regions use `{ region, postcode }`, districts and wards use `{ name, postcode }`, and streets use `{ name, places }`. Place lists remove blanks and exact duplicates and are safe to modify.

Postcode lookup accepts 2?5 numeric digits and returns the first matching region, district, or ward in dataset order. Some legacy district codes overlap region codes; use hierarchical lookup for those districts. Place names are not postcodes. Invalid names and unknown postcodes throw errors.

## Search every location level

```js
import { searchLocations, resolveLocation, getDataCoverage } from 'tz-geo-data';

searchLocations('kivu', { region: 'Dar es Salaam', level: 'ward' });
searchLocations('majengo', { level: 'street', limit: 20, offset: 0 });
resolveLocation({ region: 'Arusha', district: 'Arusha CBD',
  ward: 'Sekei', street: 'Sanawari' });
getDataCoverage();
```

Search uses case-insensitive substring matching, exact hierarchy filters, a default limit of 50, and stable dataset order. An empty query lists locations. Results contain `level`, `name`, `postcode`, and the available hierarchy. Streets and places inherit ward postcodes. `resolveLocation` requires an exact unique match and throws for ambiguous names; add parent names to disambiguate. Levels are `region`, `district`, `ward`, `street`, and `place`.

## Calculate distances

```js
import { calculateDistance } from 'tz-geo-data';

calculateDistance(
  { latitude: -6.8, longitude: 39.3 },
  { latitude: -6.2, longitude: 35.7 },
  { unit: 'km' }
);
```

Returns great-circle (straight-line) distance using the Haversine formula and mean Earth radius 6371.0088 km. Units: `km` (default), `m`, or `mi`. Coordinates must be finite numbers within latitude ?90 and longitude ?180. Results are unrounded numbers, not driving distances or travel times.

### Street-to-street, place-to-place, or region-to-region

The bundled data has **no coordinates**. Supply verified coordinates from your own records or geocoding provider. A synchronous resolver receives the full matched location hierarchy, so repeated names can be distinguished. Fetch remote coordinates before calling this API.

```js
import { getDistance } from 'tz-geo-data';

// Demonstration coordinates only: replace with surveyed/geocoded points.
const points = {
  KIVUKONI: { latitude: -6.82, longitude: 39.29 },
  'SEA VIEW': { latitude: -6.80, longitude: 39.29 }
};
const parent = { region: 'Dar es Salaam', district: 'Ilala CBD', ward: 'Kivukoni' };
const km = getDistance(
  { ...parent, street: 'Kivukoni' },
  { ...parent, street: 'Sea View' },
  { resolveCoordinates: location => points[location.street] }
);
```

The same API accepts `{ region: 'Arusha' }`, district/ward selectors, or selectors ending in `place`. Either endpoint may also be explicit coordinates. For regions, districts, and wards, choose a consistent representative point (such as a centroid); the result measures between those points, not administrative boundaries. Missing coordinates, ambiguous names, and asynchronous resolvers throw errors. No automatic fallback to a parent location occurs.

## Coverage

Includes all 31 regions (26 mainland and five Zanzibar), 169 district entries, 4,055 postal ward entries, 17,116 street/locality entries, and 64,276 nonblank place entries after per-street deduplication. These are record counts, not independently verified counts of current administrative units.

## License

ISC; see [LICENCE.md](LICENCE.md).
