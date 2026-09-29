# Zanzibar source snapshot

`zanzibar-tcra.json` records public data retrieved from the [TCRA postcode search](https://www.tcra.go.tz/services/postcodes) on 2026-09-25. Its `retrievedAt` field records the exact timestamp. The read-only search operations are sent as POST requests to the same public endpoint used by that page: `https://www.tcra.go.tz/api/naps`.

The snapshot contains the five region records, their district and ward records, and all paginated location-search results for each region name. Search results can include mainland namesakes; the importer filters by region ID, then matches ward and district IDs. It imports 11 districts, 110 postal wards and 388 shehia. These are postal-service records, not a claim of current census completeness.

Transformations:

- Names are uppercased, trimmed, and consecutive whitespace is collapsed to match the existing dataset style.
- District names `MAGHARIBI "A"` and `MAGHARIBI "B"` become `MAGHARIBI A` and `MAGHARIBI B`.
- Five-digit ward postcodes are converted to numbers. Region/district `POSTCODE` fields contain the two-/three-digit prefixes derived from their wards, consistent with the existing API; TCRA returns null for those parent fields. The prefixes are not standalone delivery postcodes.
- TCRA `SHEHIA` rows become `STREETS` entries with `TYPE: "SHEHIA"`. They are localities, not verified physical roads. `PLACES` is empty because the source provides no lower-level place data.
- Source ward records are not duplicated as streets. No coordinates are inferred.

Refresh explicitly from the repository root:

```sh
node scripts/fetch-zanzibar.cjs
node scripts/import-zanzibar.cjs
npm run audit:data
npm test
```

Review source changes before importing. The importer validates hierarchy joins, postcode prefixes, and duplicate shehia before writing region files. The fetch script is never executed by the runtime package or automatically during installation. Source snapshots and scripts are repository review materials; only generated region data and coverage documentation are distributed in the npm package.
