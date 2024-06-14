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

  const colors: { [key: string]: string } = {
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
    "IDFM:C01742": "rgb(227,5,28)",
    "IDFM:C01743": "rgb(82,145,206)",
    "IDFM:C01727": "rgb(255,206,0)",
    "IDFM:C01728": "rgb(0,129,79)",
    "IDFM:C01729": "rgb(192,65,145)",
    "IDFM:C01737": "rgb(141,94,42)",
    "IDFM:C01739": "rgb(213,201,0)",
    "IDFM:C01738": "rgb(159,152,37)",
    "IDFM:C01740": "rgb(206,173,210)"
  };

  useEffect(() => {
    const fetchStops = async () => {
      try {
        const metroResponse = await fetch('http://127.0.0.1:8000/stops?metro');
        const metroData: Stop[] = await metroResponse.json();
        
        // const rerResponse = await fetch('http://127.0.0.1:8000/stops?rer');
        // const rerData: Stop[] = await rerResponse.json();

        // if (!Array.isArray(metroData) || !metroData.length || !Array.isArray(rerData) || !rerData.length) {
        //   throw new Error('API response is not valid');
        // }
        if (!Array.isArray(metroData) || !metroData.length) {
          throw new Error('API response is not valid');
        }

        // const combinedData = [...metroData, ...rerData.filter(stop => colors[stop.route_id] !== undefined)];
        const combinedData = metroData;
        

        const uniqueData = combinedData.reduce((acc: Stop[], current: Stop) => {
          const x = acc.find(item => item.parent_station === current.parent_station && item.route_id === current.route_id);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);
        
        setUniqueMarkers(uniqueData);
        await setlines(combinedData);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchStops();
  }, []);

  async function setlines(stops: Stop[]) {
    const newLines: GeoJSON.Feature<GeoJSON.LineString>[] = [];
    const visitedStops = new Set<string>();
    // const routeId = 'IDFM:C01384';
    for (const routeId of Object.keys(colors)) {
      const routeStops = stops.filter(stop => stop.route_id === routeId);
      if (routeStops.length > 0) {
        const graphsResponse = await fetch(`http://127.0.0.1:8000/route/${routeId}/stops`);
        const graphs: string[][] = await graphsResponse.json();
        if (!Array.isArray(graphs) || !graphs.length) {
          throw new Error('API response is not valid');
        }
        if (graphs.length === 1) {
          const lineFeatures: GeoJSON.Feature<GeoJSON.LineString> = {
            type: 'Feature',
            properties: {route_id: routeId},
            geometry: {
              type: 'LineString',
              coordinates: routeStops.map((stop: Stop) => [stop.stop_lon, stop.stop_lat])
            }
          };
          newLines.push(lineFeatures);
          continue;
        }
        graphs.sort((a, b) => b.length - a.length);
        const stopsToBeAdded = new Set<string>();
        for (const graph of graphs) {
          const lineFeatures: GeoJSON.Feature<GeoJSON.LineString> = {
            type: 'Feature',
            properties: {route_id: routeId},
            geometry: {
              type: 'LineString',
              coordinates: []
            }
          };
          for (const stop of graph) {
            if (visitedStops.has(stops.find(stop_gen => stop_gen.stop_id === stop)?.parent_station || "") && stopsToBeAdded.size === 0) {
              continue;
            }
            if (graph.indexOf(stop) != 0) {
              // stopsToBeAdded.add(graph[graph.indexOf(stop) - 1]);
              stopsToBeAdded.add(stops.find(stop_gen => stop_gen.stop_id === graph[graph.indexOf(stop) - 1])?.parent_station || "");
            }
            visitedStops.add(stops.find(stop_gen => stop_gen.stop_id === stop)?.parent_station || "");
            // stopsToBeAdded.add(stop);
            stopsToBeAdded.add(stops.find(stop_gen => stop_gen.stop_id === stop)?.parent_station || "");
          }
          stopsToBeAdded.forEach((stopToBeAdded: string) => {
            const stopData = stops.find(stopData => stopData.parent_station === stopToBeAdded && stopData.route_id === routeId);
            if (stopData) {
              lineFeatures.geometry.coordinates.push([stopData.stop_lon, stopData.stop_lat]);
            } else {
              console.warn(`Stop with ID ${stopToBeAdded} not found in stops array.`);
            }
          });
          stopsToBeAdded.clear();
          newLines.push(lineFeatures);
        }
        visitedStops.clear();
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
            longitude={stop.stop_lon}
            latitude={stop.stop_lat}
          >
            <Icon item="marker" color={colors[stop.route_id]} onMouseEnter={() => setSelectedStop(stop)} onMouseLeave={() => setSelectedStop(null)} />
          </Marker>
        ))
      }
      {/* {
        uniqueMarkers.filter(stop => stop.route_id === 'IDFM:C01384').map((stop, index) => (
          <Marker
            key={index}
            longitude={stop.stop_lon}
            latitude={stop.stop_lat}
          >
            <Icon item="marker" color={colors[stop.route_id]} onMouseEnter={() => setSelectedStop(stop)} onMouseLeave={() => setSelectedStop(null)} />
          </Marker>
        ))
      } */}
      {
        <Popup
          longitude={selectedStop?.stop_lon || 0}
          latitude={selectedStop?.stop_lat || 0}
          closeButton={false}
          onClose={() => setSelectedStop(null)}
        >
          <div>
            <h2 style={{margin: "0px"}}>{selectedStop?.stop_name} {selectedStop?.stop_id}</h2>
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
                  'line-color': colors[line.properties?.route_id] || 'red', // Use the color from metroColors
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
