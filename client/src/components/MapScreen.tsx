import * as React from 'react';
import Map from 'react-map-gl';

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

const MapScreen = () => {

  return (
    <Map
      mapboxAccessToken={import.meta.env.VITE_REACT_APP_MAPBOX_TOKEN}
      initialViewState={{
        longitude: -122.4,
        latitude: 37.8,
        zoom: 14
      }}
      style={{flex: 1}}
      reuseMaps
      mapStyle="mapbox://styles/mapbox/streets-v9"
    />
  );
};

export default MapScreen;
