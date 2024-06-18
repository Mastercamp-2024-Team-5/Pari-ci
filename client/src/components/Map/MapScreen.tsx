import * as React from 'react';
import Map, { Layer, Marker, Popup, Source } from 'react-map-gl';
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useState } from 'react';
import Icon from '../Shared/Icon';
import './MapScreen.css';
import coordinates from './coordinates/coordinates';
import MapItineraire from './MapItineraire';

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

interface RouteTrace {
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

interface RouteCollection {
  collection: GeoJSON.FeatureCollection
  route_id: string
  route_color: string
}


const MapScreen: React.FC = React.memo(() => {
  const [uniqueMarkers, setUniqueMarkers] = useState<Stop[]>([]);
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [geojson, setGeojson] = useState<RouteCollection[]>([]);
  const [selectedButton, setSelectedButton] = useState<string>('metro');
  const [onItineraire, setOnItineraire] = useState<boolean>(false);

  useEffect(() => {
    fetchStops(selectedButton);
    fetchGeojson(selectedButton);
  }, [selectedButton]);

  const fetchStops = async (buttonType: string) => {
    try {
      const route_response = await fetch(`http://localhost:8000/routes?${buttonType}`);
      const routes:Route[] = await route_response.json();

      const response = await fetch(`http://127.0.0.1:8000/stops?${buttonType}`);
      const data: Stop[] = await response.json();

      if (!Array.isArray(data) || !data.length) {
        throw new Error('API response is not valid');
      }

      data.map(
        (stop) => {
          stop.color = `#${routes.find(route => route.route_id === stop.route_id)?.color}`;
        }
      )

      setUniqueMarkers(data.filter(stop => coordinates[buttonType].flat(2).includes(stop.stop_id)));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchGeojson = async (buttonType: string) => {
    try {
      const route_response = await fetch(`http://localhost:8000/routes?${buttonType}`);
      const routes:Route[] = await route_response.json();

      const response = await fetch(`http://localhost:8000/routes_trace?${buttonType}`);
      const data:RouteTrace[] = await response.json();

      const geojson_output:RouteCollection[] = [];
      for (const route of routes) {
        const route_traces:RouteTrace[] = data.filter(route_trace => route_trace.route_id === route.route_id);
        
        const lineCollection:RouteCollection = {
          collection: {
            type: "FeatureCollection",
            features: route_traces.map(route_trace => 
              ({
                type: "Feature",
                geometry: {
                  type: "LineString",
                  coordinates: JSON.parse(route_trace.shape).coordinates
                },
                properties: {
                  route_id: route_trace.route_id
                }
              })
            ),
          },
          route_id: route.route_id,
          // parse color from hex string
          route_color: `#${route.color}`
        }
        geojson_output.push(lineCollection);
      }
      setGeojson(geojson_output);
      setOnItineraire(true); //TODO: change this
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleSelectButton = (buttonType: string) => {
    setSelectedButton(buttonType);
  };

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
        {
          uniqueMarkers.map((stop, index) => (
            <Marker
              key={index}
              longitude={stop.stop_lon}
              latitude={stop.stop_lat}
            >
              <Icon item="marker" color={stop.color || "red"} onMouseEnter={() => setSelectedStop(stop)} onMouseLeave={() => setSelectedStop(null)} />
            </Marker>
          ))
        }
        {
          selectedStop && (
            <Popup
              longitude={selectedStop.stop_lon}
              latitude={selectedStop.stop_lat}
              closeButton={false}
              onClose={() => setSelectedStop(null)}
            >
              <div>
              <Icon item={selectedStop.route_short_name} size={23} /><h2 style={{ margin: "0px" }}>{selectedStop.stop_name}</h2>
              </div>
            </Popup>
          )
        }
        {
          geojson.map((line, index) => {
            return (
              <Source key={index} id={`lineLayer${index}`} type="geojson" data={line.collection}>
                <Layer
                  id={`line${index}`}
                  type="line"
                  layout={{}}
                  paint={{
                    'line-color': line.route_color || 'red',
                    'line-width': 5
                  }}
                />
              </Source>
            )
          })
        }
      </Map>
      <ControlButton selectedButton={selectedButton} onSelectButton={handleSelectButton} />
    </>
  );
});

export default MapScreen;
