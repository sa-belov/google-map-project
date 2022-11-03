import http from './index';

// const loadSearchResults = (text: string) => {
//   return http.get(
//     `/place/findplacefromtext/json?fields=formatted_address,name,geometry&input=${text}&inputtype=textquery&key=AIzaSyDHayf0jFYXaDG5OTpcyTkLLnmpj0htiOU`
//   );
// };

const loadSearchResults = (text: string) => {
  return http.get(`/place/textsearch/json?query=${text}&key=AIzaSyDHayf0jFYXaDG5OTpcyTkLLnmpj0htiOU`);
};

const searchService = {
  loadSearchResults,
};

export default searchService;
