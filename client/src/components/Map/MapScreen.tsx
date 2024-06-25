import * as React from 'react';
import { useState } from 'react';
import Map from 'react-map-gl';
import "mapbox-gl/dist/mapbox-gl.css";
import Icon from '../Shared/Icon';
import './MapScreen.css';
import MapItineraire from './MapItineraire';
import MapElements from './MapElements';
import { useHomeContext } from '../Home/HomeContext';
import { ActiveRightPage, ActiveRoutes } from '../Shared/enum';

const ControlButton: React.FC<{ selectedButton: ActiveRoutes; onSelectButton: (buttonType: ActiveRoutes) => void; }> = ({ selectedButton, onSelectButton }) => {
  return (
    <div className="control-button">
      <div
        className={`icon-container ${selectedButton === ActiveRoutes.Metro ? 'selected' : ''}`}
        onClick={() => onSelectButton(ActiveRoutes.Metro)}
      >
        <Icon item="metro" />
      </div>
      <div
        className={`icon-container ${selectedButton === ActiveRoutes.Rer ? 'selected' : ''}`}
        onClick={() => onSelectButton(ActiveRoutes.Rer)}
      >
        <Icon item="rer" />
      </div>
    </div>
  );
};

const MapScreen: React.FC = () => {
  const [selectedButton, setSelectedButton] = useState<ActiveRoutes>(ActiveRoutes.Metro);
  const { activeRightPage: activeRightPage } = useHomeContext();

  return (
    <>
      <Map
        mapboxAccessToken={import.meta.env.VITE_REACT_APP_MAPBOX_TOKEN}
        initialViewState={{
          latitude: 48.8566,
          longitude: 2.3522,
          zoom: 11
        }}
        style={{ flex: 1, margin: 0, padding: 0 }}
        reuseMaps
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        {
          activeRightPage === ActiveRightPage.Trip ? <MapItineraire /> : <MapElements selectedButton={selectedButton} />
        }
      </Map>
      {
        activeRightPage === ActiveRightPage.Map && <ControlButton selectedButton={selectedButton} onSelectButton={setSelectedButton} />
      }
    </>
  );
};

export default MapScreen;
