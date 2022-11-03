import { makeAutoObservable } from 'mobx';
import searchService from '../../services/search';
import { IMarker, IPolyline, ISearchResult } from './map.types';
import mapService from '../../services/map';

export class MapStore {
  markers: IMarker[] = [];
  polyLines: IPolyline[][] = [];
  currentAddress: IMarker | null = null;
  searchResults: ISearchResult[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  loadSearchResult = (text: string) => {
    searchService.loadSearchResults(text).then(({ data }) => {
      this.searchResults = data.results;
    });
  };

  createMarker = (lat: number, lng: number) => {
    if (this.markers.length === 0) {
      mapService.loadAddress(lat, lng).then(({ data }) => {
        this.markers.push(data.results[0]);
      });
    } else {
      mapService.loadAddress(lat, lng).then(({ data }) => {
        this.markers.push(data.results[0]);
        this.setPolyLines();
      });
    }
  };

  setCurrentAddress = (currentAddress: IMarker) => {
    this.currentAddress = currentAddress;
  };

  removeAddress = (id: string) => {
    const index = this.markers.findIndex((marker) => marker.place_id === id);

    this.markers.splice(index, 1);
    this.setPolyLines();
  };

  setMarkerPosition = (id: string, lat: number, lng: number) => {
    const index = this.markers.findIndex((markerItem) => markerItem.place_id === id);

    this.markers[index].geometry.location.lat = lat;
    this.markers[index].geometry.location.lng = lng;
    this.setPolyLines();
  };

  setAddressName = (id: string, lat: number, lng: number) => {
    const index = this.markers.findIndex((markerItem) => markerItem.place_id === id);

    mapService.loadAddress(lat, lng).then(({ data }) => {
      this.markers[index] = data.results[0];
      this.setPolyLines();
    });
  };

  setAddressList = (address: IMarker) => {
    if (address.place_id === this.currentAddress?.place_id) {
      return;
    }
    if (address.place_id !== this.currentAddress?.place_id) {
      const firstIndex = this.markers.findIndex((addressItem) => addressItem.place_id === address.place_id);
      const secondIndex = this.markers.findIndex(
        (addressItem) => addressItem.place_id === this.currentAddress?.place_id
      );
      const temporaryVariable = this.markers[firstIndex];
      this.markers[firstIndex] = this.markers[secondIndex];
      this.markers[secondIndex] = temporaryVariable;
      this.setPolyLines();
    }
  };

  setPolyLines = () => {
    const newPolyLines: IPolyline[][] = [];
    for (let i = 0; i < this.markers.length - 1; i++) {
      newPolyLines.push([
        { lat: this.markers[i].geometry.location.lat, lng: this.markers[i].geometry.location.lng },
        { lat: this.markers[i + 1].geometry.location.lat, lng: this.markers[i + 1].geometry.location.lng },
      ]);
    }
    this.polyLines = newPolyLines;
  };
}
