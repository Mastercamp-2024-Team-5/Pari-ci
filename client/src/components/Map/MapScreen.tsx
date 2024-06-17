import * as React from 'react';
import Map, { Layer, Marker, Popup, Source } from 'react-map-gl';
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useState } from 'react';
import Icon from '../Shared/Icon';
import './MapScreen.css';
import coordinates from './coordinates/coordinates';
import type {FeatureCollection} from 'geojson';

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
      {/* <div
        className={`icon-container ${selectedButton === 'train' ? 'selected' : ''}`}
        onClick={() => onSelectButton('train')}
      >
        <Icon item="train" />
      </div> */}
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

interface Route {
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
  const [lines, setLines] = useState<GeoJSON.Feature<GeoJSON.LineString>[]>([]);
  const [geojson, setGeojson] = useState<RouteCollection[]>([]);
  const [selectedButton, setSelectedButton] = useState<string>('metro');

  const colors: { [key: string]: { [key: string]: string } } = {
    "metro": {
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
    },
    "rer": {
      "IDFM:C01742": "rgb(227,5,28)",
      "IDFM:C01743": "rgb(82,145,206)",
      "IDFM:C01727": "rgb(255,206,0)",
      "IDFM:C01728": "rgb(0,129,79)",
      "IDFM:C01729": "rgb(192,65,145)",
    },
    "train": {
      "IDFM:C01737": "rgb(141,94,42)",
      "IDFM:C01739": "rgb(213,201,0)",
      "IDFM:C01738": "rgb(159,152,37)",
      "IDFM:C01740": "rgb(206,173,210)"
    },
    "tram": {
      "IDFM:C01737": "rgb(141,94,42)",
      "IDFM:C01739": "rgb(213,201,0)",
      "IDFM:C01738": "rgb(159,152,37)",
      "IDFM:C01740": "rgb(206,173,210)"
    }
  };

  useEffect(() => {
    fetchStops(selectedButton);
    fetchGeojson(selectedButton);
  }, [selectedButton]);

  const fetchStops = async (buttonType: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/stops?${buttonType === 'train' ? 'rer' : buttonType}`);
      let data: Stop[] = await response.json();

      if (!Array.isArray(data) || !data.length) {
        throw new Error('API response is not valid');
      }

      if (buttonType !== 'metro') {
        data = data.filter(stop => colors[buttonType][stop.route_id] !== undefined);
      }

      setUniqueMarkers(data.filter(stop => coordinates[buttonType].flat(2).includes(stop.stop_id)));

      // await setlines(data, buttonType);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const setlines = async (stops: Stop[], buttonType: string) => {
    const newLines: GeoJSON.Feature<GeoJSON.LineString>[] = [];
    for (const line of coordinates[buttonType]) {
      for (const route of line) {
        const routeStops = route.map(stopId => stops.find(stop => stop.stop_id === stopId) || undefined);
        const validRouteStops = routeStops.filter((stop): stop is Stop => stop !== undefined);
        
        if (validRouteStops.length > 0) {
          const lineFeatures: GeoJSON.Feature<GeoJSON.LineString> = {
            type: 'Feature',
            properties: { route_id: Object.keys(colors[buttonType])[coordinates[buttonType].indexOf(line)] },
            geometry: {
              type: 'LineString',
              coordinates: validRouteStops.map((stop: Stop) => [stop.stop_lon, stop.stop_lat])
            }
          };
          newLines.push(lineFeatures);
        }
      }
    }
    setLines(newLines);
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
            features: route_traces.map(route_trace => {
              return {
                type: "Feature",
                geometry: {
                  type: "LineString",
                  coordinates: JSON.parse(route_trace.shape).coordinates
                },
                properties: {
                  route_id: route_trace.route_id
                }
              }
            }),
          },
          route_id: route.route_id,
          // parse color from hex string
          route_color: `#${route.color}`
        }
        geojson_output.push(lineCollection);
      }
      setGeojson(geojson_output);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  

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
          uniqueMarkers.map((stop, index) => (
            <Marker
              key={index}
              longitude={stop.stop_lon}
              latitude={stop.stop_lat}
            >
              <Icon item="marker" color={colors[selectedButton][stop.route_id]} onMouseEnter={() => setSelectedStop(stop)} onMouseLeave={() => setSelectedStop(null)} />
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
                <h2 style={{ margin: "0px" }}>{selectedStop.stop_name} {selectedStop.stop_id}</h2>
              </div>
            </Popup>
          )
        }
        {
          // lines.map((line, index) => {
          //   console.log("hey");
          //   return (
          //     <Source key={index} id={`lineLayer${index}`} type="geojson" data={line}>
          //     <Layer
          //       id={`line${index}`}
          //       type="line"
          //       layout={{}}
          //       paint={{
          //         'line-color': colors[selectedButton][line.properties?.route_id] || 'red',
          //         'line-width': 5
          //       }}
          //     />
          //   </Source>
          //   )
          // }
          // )
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
