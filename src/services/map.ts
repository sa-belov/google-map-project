import http from './index';

const loadAddress = (lat: number, lng: number) => {
  return http.get(`geocode/json?latlng=${lat},${lng}&key=AIzaSyDHayf0jFYXaDG5OTpcyTkLLnmpj0htiOU`);
};

const mapService = {
  loadAddress,
};

export default mapService;
