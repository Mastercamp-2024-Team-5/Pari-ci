import * as React from 'react';
import Map, {Marker} from 'react-map-gl';
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useState  } from 'react';
import Icon from './Icon';

// // Custom Marker Icon
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// const customIcon = new Icon({
//   iconUrl: markerIcon,
//   iconRetinaUrl: markerIconRetina,
//   shadowUrl: markerShadow,
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41]
// });

// Stadia Maps (e.g., 'dark', 'light', 'outdoors', 'satellite')
// Thunderforest (e.g., 'cycle', 'landscape', 'transport', 'atlas')
// Mapbox (requires API key) (e.g., 'streets', 'outdoors', 'light', 'dark', 'satellite')

interface Stop {
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
}

const MapScreen = () => {
  const [stops, setStops] = useState<Stop[]>([]);

  function getStops() {
    fetch('http://127.0.0.1:8000/stops/metro')
      .then(response => response.json())
      .then(data => setStops(data))
      .catch(error => console.error('Error:', error));
    for (let i = 0; i < stops.length; i++) {
      console.log(stops[i]);
    }
  }


  useEffect(() => {
    getStops();
  }, []);

  return (
    <Map
      mapboxAccessToken={import.meta.env.VITE_REACT_APP_MAPBOX_TOKEN}
      initialViewState={{
        latitude: 48.8566,
        longitude: 2.3522,
        zoom: 12
      }}
      style={{flex: 1, margin: 0, padding: 0}}
      reuseMaps
      mapStyle="mapbox://styles/mapbox/streets-v9"
    >
      {
        stops.map((stop, index) => (
          <Marker
            key={index}
            longitude={stop.stop_lat}
            latitude={stop.stop_lon}
          >
            <Icon item="marker" color="a" />
          </Marker>
        ))
      }
    </Map>
  );
};

export default MapScreen;
