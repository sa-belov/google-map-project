import React, { FC, useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polyline } from '@react-google-maps/api';
import styles from './map.module.css';
import { observer } from 'mobx-react-lite';
import Input from '../../shared/Input';
import useDebounce from '../../shared/hooks/useDebounce';
import { MapStore } from './map.store';
import { ISearchResult } from './map.types';

const center = {
  lat: 55.75,
  lng: 37.57,
};

interface IProps {
  store: MapStore;
}

interface ISearchState {
  draftSearch: { search: string };
}

const MapComponent: FC<IProps> = ({ store }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyDHayf0jFYXaDG5OTpcyTkLLnmpj0htiOU',
  });
  const [searchTerm, setSearchTerm] = useState<ISearchState>({
    draftSearch: generateEmptySearch(),
  });
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm?.draftSearch?.search) {
      store.loadSearchResult(debouncedSearchTerm.draftSearch.search);
    } else {
      return;
    }
  }, [debouncedSearchTerm]);

  const onClickMap = (e: google.maps.MapMouseEvent) => {
    store.createMarker(Number(e.latLng?.lat()), Number(e.latLng?.lng()));
  };

  const dragMarkerHandler = (e: google.maps.MapMouseEvent, id: string) => {
    store.setMarkerPosition(id, Number(e.latLng?.lat()), Number(e.latLng?.lng()));
  };

  const dragMarkerEndHandler = (e: google.maps.MapMouseEvent, id: string) => {
    store.setAddressName(id, Number(e.latLng.lat()), Number(e.latLng.lng()));
  };

  const handleChange = (value: string, name: string) => {
    setSearchTerm((prev) => ({
      ...prev,
      draftSearch: { ...prev.draftSearch, [name]: value },
    }));
  };

  const handleAddMarkerWithSearch = (result: ISearchResult) => {
    store.createMarker(result.geometry.location.lat, result.geometry.location.lng);
    setSearchTerm((prev) => ({
      ...prev,
      draftSearch: generateEmptySearch(),
    }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <Input
          onChange={handleChange}
          value={searchTerm.draftSearch.search}
          name="search"
          type="text"
          placeholder="Найдите место"
        />
        {store.searchResults && store.searchResults.length !== 0 && debouncedSearchTerm?.draftSearch?.search && (
          <div className={styles.results}>
            {store.searchResults.map((result) => (
              <div className={styles.result} onClick={() => handleAddMarkerWithSearch(result)}>
                {result.formatted_address}, {result.name}
              </div>
            ))}
          </div>
        )}
      </div>
      {isLoaded ? (
        <GoogleMap mapContainerClassName={styles.map} onClick={onClickMap} center={center} zoom={100}>
          {store.markers.map((marker, idx) => (
            <Marker
              onDrag={(e) => dragMarkerHandler(e, marker.place_id)}
              onDragEnd={(e) => dragMarkerEndHandler(e, marker.place_id)}
              draggable
              key={idx}
              position={{
                lat: marker.geometry.location.lat,
                lng: marker.geometry.location.lng,
              }}
            />
          ))}
          {store.polyLines.map((polyLine, idx) => (
            <Polyline
              key={idx}
              path={polyLine}
              options={{
                strokeColor: '#ff2527',
                strokeWeight: 2,
              }}
            />
          ))}
        </GoogleMap>
      ) : (
        <></>
      )}
    </div>
  );
};

const generateEmptySearch = () => ({ search: '' });

export default observer(MapComponent);
