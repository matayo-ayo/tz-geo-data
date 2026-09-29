// Refresh the public TCRA snapshot. Run explicitly; never used at package runtime.
const fs = require('node:fs');
const path = require('node:path');
const endpoint = 'https://www.tcra.go.tz/api/naps';
async function request(operation, variables) {
  const response = await fetch(endpoint, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operation, variables }), signal: AbortSignal.timeout(45000),
  });
  if (!response.ok) throw new Error('HTTP ' + response.status);
  const json = await response.json();
  const result = json.data?.[operation];
  if (!result?.status || !result.data) throw new Error(JSON.stringify(json));
  return result.data;
}
const filter = (field, value) => ({ field, operator: 'EQUALS', value });
async function main() {
  const regions = await request('getNonPaginatedAdministrativeAreasMini', { filters: [filter('type', 'REGION')] });
  const names = ['Mjini Magharibi', 'Kusini Unguja', 'Kaskazini Unguja', 'Kusini Pemba', 'Kaskazini Pemba'];
  const snapshot = { source: 'https://www.tcra.go.tz/services/postcodes', endpoint, retrievedAt: new Date().toISOString(), regions: [] };
  for (const name of names) {
    const region = regions.find(r => r.locationName === name);
    if (!region) throw new Error('Missing region: ' + name);
    const districts = await request('getNonPaginatedAdministrativeAreasMini', { filters: [filter('type', 'DISTRICT'), filter('parent.uniqueId', region.uniqueId)] });
    const entry = { ...region, districts: [], locations: [] };
    for (const district of districts) {
      const wards = [];
      for (let page = 0; ; page++) {
        const data = await request('getPaginatedAdministrativeAreasMini', {
          filters: [filter('type', 'WARD'), filter('parent.uniqueId', district.uniqueId)],
          pageableParam: { first: page, size: 100, sortBy: 'locationName', sortDirection: 'ASC' },
        });
        wards.push(...data.content);
        if (!data.hasNext) break;
        if (page >= 100) throw new Error('Pagination overflow');
      }
      entry.districts.push({ ...district, wards });
    }
    for (let page = 0; ; page++) {
      const data = await request('getPaginatedLocationSearch', { keyword: name, pageableParam: { first: page, size: 100 } });
      entry.locations.push(...data.content);
      if (entry.locations.length >= data.totalElements) break;
      if (!data.content.length || page >= 100) throw new Error('Incomplete search pagination');
    }
    snapshot.regions.push(entry);
    console.log(name, 'districts:', districts.length, 'wards:', entry.districts.reduce((n,d) => n+d.wards.length,0), 'search records:', entry.locations.length);
  }
  const dir = path.join(__dirname, '..', 'sources');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'zanzibar-tcra.json'), JSON.stringify(snapshot, null, 2) + '\n');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
