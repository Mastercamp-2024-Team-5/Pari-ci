  import * as React from 'react';
  import { useState } from 'react';
  import Map from 'react-map-gl';
  import "mapbox-gl/dist/mapbox-gl.css";
  import Icon from '../Shared/Icon';
  import './MapScreen.css';
  import MapItineraire from './MapItineraire';
  import MapElements from './MapElements';

  export interface Stop {
    stop_id: string;
    stop_name: string;
    stop_lat: number;
    stop_lon: number;
    location_type: number;
    parent_station: string;
    wheelchair_boarding: number;
    route_id: string;
    route_short_name: string;
    route_long_name: string;
    route_type: number;
    color?: string;
  }

  export interface RouteTrace {
    id: string;
    route_id: string;
    shape: string;
    route_type: number;
    color: string;
  }

  export interface Route {
    route_id: string,
    agency_id: string,
    short_name: string,
    long_name: string,
    description?: string,
    route_type: number,
    url?: string,
    color: string,
    text_color?: string,
    sort_order?: number
  }

  export interface RouteCollection {
    collection: GeoJSON.FeatureCollection
    route_id: string
    route_color: string
  }

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
    const [onItineraire, setOnItineraire] = useState<boolean>(false);

    const handleSelectButton = (buttonType: string) => {
      setSelectedButton(buttonType);
    };

    React.useEffect(() => {
      setOnItineraire(false);
    }
    , [selectedButton]);

    if (onItineraire) {
      return (
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
          <MapItineraire />
        </Map>
      );
    }
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
          <MapElements selectedButton={selectedButton} />
        </Map>
        <ControlButton selectedButton={selectedButton} onSelectButton={handleSelectButton} />
      </>
    );
  });

  export default MapScreen;
