import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";

// Custom Marker Icon
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIconRetina from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const customIcon = new Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Stadia Maps (e.g., 'dark', 'light', 'outdoors', 'satellite')
// Thunderforest (e.g., 'cycle', 'landscape', 'transport', 'atlas')
// Mapbox (requires API key) (e.g., 'streets', 'outdoors', 'light', 'dark', 'satellite')

const Map = () => {
  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      style={{
        height: "100vh",
        width: "100%",
        margin: 0,
        padding: 0,
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      }}
    >
      <TileLayer
        url="https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> contributors'
        subdomains={["a", "b", "c", "d"]}
        tileSize={512}
        zoomOffset={-1}
        detectRetina={true}
      />
      <Marker position={[51.505, -0.09]} icon={customIcon}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
