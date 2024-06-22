  import * as React from 'react';
  import { useState } from 'react';
  import Map from 'react-map-gl';
  import "mapbox-gl/dist/mapbox-gl.css";
  import Icon from '../Shared/Icon';
  import './MapScreen.css';
  import MapItineraire from './MapItineraire';
  import MapElements from './MapElements';
  import { useHomeContext } from '../Home/HomeContext';

  const ControlButton: React.FC<{ selectedButton: string; onSelectButton: (buttonType: string) => void; }> = ({ selectedButton, onSelectButton }) => {
    return (
      <div className="control-button">
        <div
          className={`icon-container ${selectedButton === 'metro' ? 'selected' : ''}`}
          onClick={() => onSelectButton('metro')}
        >
          <Icon item="metro" />
        </div>
        <div
          className={`icon-container ${selectedButton === 'rer' ? 'selected' : ''}`}
          onClick={() => onSelectButton('rer')}
        >
          <Icon item="rer" />
        </div>
      </div>
    );
  };

  const MapScreen: React.FC = React.memo(() => {
    const [selectedButton, setSelectedButton] = useState<string>('metro');
    const { ItinerairePage } = useHomeContext();

    const handleSelectButton = (buttonType: string) => {
      setSelectedButton(buttonType);
    };

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
            ItinerairePage ? <MapItineraire /> : <MapElements selectedButton={selectedButton} />
          }
        </Map>
        {
          !ItinerairePage && <ControlButton selectedButton={selectedButton} onSelectButton={handleSelectButton} />
        }
      </>
    );
  });

  export default MapScreen;
