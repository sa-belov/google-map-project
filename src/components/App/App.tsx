import React from 'react';
import styles from './app.module.css';
import { MapStore } from '../Map/map.store';
import AddressList from '../AddressList';
import MapComponent from '../Map';

const store = new MapStore();

const App = () => {
  return (
    <div className={styles.container}>
      <MapComponent store={store} />
      <AddressList store={store} />
    </div>
  );
};

export default App;
