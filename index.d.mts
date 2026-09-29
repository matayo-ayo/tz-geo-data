export type LocationLevel = 'region' | 'district' | 'ward' | 'street' | 'place';
export interface LocationSelector {
  region?: string;
  district?: string;
  ward?: string;
  street?: string;
  place?: string;
  level?: LocationLevel;
}
export interface LocationRecord extends LocationSelector {
  level: LocationLevel;
  name: string;
  region: string;
  /** Streets and places inherit their ward postcode. */
  postcode: number;
}
export interface Coordinates { latitude: number; longitude: number }
export interface DistanceOptions { unit?: 'km' | 'm' | 'mi' }
export interface PlaceDistanceOptions extends DistanceOptions {
  resolveCoordinates?: (location: LocationRecord) => Coordinates;
}
export interface NamedPostcode { name: string; postcode: number }
export interface StreetData { name: string; places: string[] }
export interface GeoData {
  region: string | null;
  regionPostcode: number | null;
  district: string | null;
  districtPostcode: number | null;
  ward: string | null;
  wardPostcode: number | null;
  streets: StreetData[];
}
export function getAllRegions(): { region: string; postcode: number }[];
export function getDistrictData(regionName: string): NamedPostcode[];
export function getWardData(regionName: string, districtName: string): NamedPostcode[];
export function getStreetsData(regionName: string, districtName: string, wardName: string): StreetData[];
export function getGeoData(postcode: string | number): GeoData;
export function searchLocations(query: string, options?: LocationSelector & { limit?: number; offset?: number }): LocationRecord[];
export function resolveLocation(selector: LocationSelector): LocationRecord;
export function calculateDistance(from: Coordinates, to: Coordinates, options?: DistanceOptions): number;
export function getDistance(from: LocationSelector | Coordinates, to: LocationSelector | Coordinates, options?: PlaceDistanceOptions): number;
export function getDataCoverage(): {
  scope: string;
  counts: Record<LocationLevel, number>;
  missingRegions: string[];
  hasCoordinates: false;
  completenessVerified: false;
};

declare const api: {
  getAllRegions: typeof getAllRegions;
  getDistrictData: typeof getDistrictData;
  getWardData: typeof getWardData;
  getStreetsData: typeof getStreetsData;
  getGeoData: typeof getGeoData;
  searchLocations: typeof searchLocations;
  resolveLocation: typeof resolveLocation;
  calculateDistance: typeof calculateDistance;
  getDistance: typeof getDistance;
  getDataCoverage: typeof getDataCoverage;
};
export default api;
