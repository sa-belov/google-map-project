import axios, { AxiosInstance } from 'axios';

const URL = 'https://maps.googleapis.com/maps/api/';

const http: AxiosInstance = axios.create({
  baseURL: URL,
  headers: {
    'Access-Control-Allow-Headers':
      'Origin, X-Requested-With, Content-Type, Accept, AIzaSyDHayf0jFYXaDG5OTpcyTkLLnmpj0htiOU',
  },
});

export default http;
