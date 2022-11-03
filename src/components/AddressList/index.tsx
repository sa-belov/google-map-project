import { DragEvent } from 'react';
import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import styles from './addressList.module.css';
import { MapStore } from '../Map/map.store';
import { IMarker } from '../Map/map.types';

interface IProps {
  store: MapStore;
}

const AddressList: FC<IProps> = ({ store }) => {
  const dragStartHandler = (address: IMarker) => {
    store.setCurrentAddress(address);
  };

  const dragEndHandler = (e: DragEvent<HTMLDivElement>) => {
    e.currentTarget.style.background = 'white';
  };

  const dragOverHandler = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.style.background = 'lightgrey';
  };

  const dropHandler = (e: DragEvent<HTMLDivElement>, address: IMarker) => {
    e.preventDefault();
    store.setAddressList(address);
    e.currentTarget.style.background = 'white';
  };

  return (
    <div className={styles.list}>
      {store.markers.map((marker) => (
        <div
          onDragStart={() => dragStartHandler(marker)}
          onDragLeave={(e) => dragEndHandler(e)}
          onDrag={(e) => dragEndHandler(e)}
          onDragOver={(e) => dragOverHandler(e)}
          onDrop={(e) => dropHandler(e, marker)}
          draggable
          className={styles.item}
          key={marker.place_id}
        >
          <span>{marker.formatted_address}</span>
          <button className={styles.button} onClick={() => store.removeAddress(marker.place_id)}>
            Удалить
          </button>
        </div>
      ))}
    </div>
  );
};

export default observer(AddressList);
