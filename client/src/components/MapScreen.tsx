import * as React from 'react';
import Map, {Layer, Marker, Popup, Source} from 'react-map-gl';
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useState  } from 'react';
import Icon from './Icon';
import './MapScreen.css'

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
  // const [stops, setStops] = useState<Stop[]>([]);
  const [uniqueMarkers, setUniqueMarkers] = useState<Stop[]>([]);
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [lines, setLines] = useState<GeoJSON.Feature<GeoJSON.LineString>[]>([]);

  const metroColors: { [key: string]: string } = {
    "IDFM:C01371": "rgb(255,206,0)",
    "IDFM:C01372": "rgb(0,100,176)",
    "IDFM:C01373": "rgb(159,152,37)",
    "IDFM:C01386": "rgb(152,212,226)",
    "IDFM:C01374": "rgb(192,65,145)",
    "IDFM:C01375": "rgb(242,142,66)",
    "IDFM:C01376": "rgb(131,196,145)",
    "IDFM:C01377": "rgb(243,164,186)",
    "IDFM:C01387": "rgb(131,196,145)",
    "IDFM:C01378": "rgb(206,173,210)",
    "IDFM:C01379": "rgb(213,201,0)",
    "IDFM:C01380": "rgb(227,179,42)",
    "IDFM:C01381": "rgb(141,94,42)",
    "IDFM:C01382": "rgb(0,129,79)",
    "IDFM:C01383": "rgb(152,212,226)",
    "IDFM:C01384": "rgb(102,36,131)",
  };

  useEffect(() => {
    fetch('http://127.0.0.1:8000/stops/metro')
      .then(response => response.json())
      .then((data: Stop[]) => {
        if (!Array.isArray(data) || !data.length) {
          throw new Error('API response is not valid');
        }
        // setStops(data);
        const uniqueData = data.reduce((acc: Stop[], current: Stop) => {
          const x = acc.find(item => item.parent_station === current.parent_station && item.route_id === current.route_id);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);
        setUniqueMarkers(uniqueData);
        setlines(uniqueData);
      })
      .catch(error => console.error('Error:', error));
  }, []);

  function setlines(stops: Stop[]) {
    const newLines = [];
    for (let i = 0; i < Object.keys(metroColors).length; i++) {
      const line = stops.filter(stop => stop.route_id === Object.keys(metroColors)[i]);
      if (line.length > 0) {
        const lineFeatures: GeoJSON.Feature<GeoJSON.LineString> = {
          type: 'Feature',
          properties: {route_id: line.map((stop: Stop) => stop.route_id)[0]},
          geometry: {
            type: 'LineString',
            coordinates: line.map((stop: Stop) => [stop.stop_lat, stop.stop_lon]) // Corrected coordinates order
          }
        };
        newLines.push(lineFeatures);
      }
    }
    setLines(newLines);
  }

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
        uniqueMarkers.map((stop, index) => (
          <Marker
            key={index}
            longitude={stop.stop_lat}
            latitude={stop.stop_lon}
          >
            <Icon item="marker" color={metroColors[stop.route_id]} onMouseEnter={() => setSelectedStop(stop)} onMouseLeave={() => setSelectedStop(null)} />
          </Marker>
        ))
      }
      {
        <Popup
          longitude={selectedStop?.stop_lat || 0}
          latitude={selectedStop?.stop_lon || 0}
          closeButton={false}
          onClose={() => setSelectedStop(null)}
        >
          <div>
            <h2 style={{margin: "0px"}}>{selectedStop?.stop_name}</h2>
          </div>
        </Popup>
      }
      {
        lines.map((line, index) => {
          return (
            <Source key={index} id={`lineLayer${index}`} type="geojson" data={line}>
              <Layer
                id={`line${index}`}
                type="line"
                layout={{}}
                paint={{
                  'line-color': metroColors[line.properties?.route_id] || 'red', // Use the color from metroColors
                  'line-width': 5
                }}
              />
            </Source>
          );
        })
      }
    </Map>
  );
};

export default MapScreen;
