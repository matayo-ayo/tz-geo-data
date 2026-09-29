import api from './index.js';

export const {
  getAllRegions, getDistrictData, getWardData, getStreetsData, getGeoData,
  searchLocations, resolveLocation, calculateDistance, getDistance, getDataCoverage,
} = api;
export default api;
