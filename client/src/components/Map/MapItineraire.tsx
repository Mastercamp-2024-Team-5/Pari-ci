import React, { useEffect, useState } from "react";
import Map, { Marker, Popup, Source, Layer } from "react-map-gl";
import { Stop, RouteTrace, RouteCollection } from "../Shared/types";
import Icon from "../Shared/Icon";
import { useHomeContext } from "../Home/HomeContext";


const MapItineraire: React.FC = React.memo(() => {

  const [markers, setMarkers] = useState<Stop[]>([]);
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [geojson, setGeojson] = useState<RouteCollection[] | null>(null);
  const { DataPath } = useHomeContext();

  useEffect(() => {  
    async function fetchItineraire() {
      const stops_response = await fetch(`http://127.0.0.1:8000/stops?metro&rer&tram`);
      const stops: Stop[] = await stops_response.json();
      
      const routes_response = await fetch(`http://127.0.0.1:8000/routes_trace?metro&rer&tram`);
      const routes: RouteTrace[] = await routes_response.json();


      const itineraire_stops: Stop[] = [];
      const defaultStop: Stop = {
        stop_id: "",
        stop_name: "",
        stop_lat: 0,
        stop_lon: 0,
        route_id: "",
        location_type: 0,
        parent_station: "",
        wheelchair_boarding: 0,
        route_long_name: "",
        route_short_name: "",
        route_type: 0,
      };

    const route_part: RouteTrace[] = [];
    let part;
    for (const stop of DataPath[1]) {
      const stopData = stops.find((s) => s.stop_id === stop.from_stop_id && s.route_id === stop.route_id) || stops.find((s) => s.stop_id === stop.from_stop_id) || defaultStop;
      const nextStopData = stops.find((s) => s.stop_id === stop.to_stop_id) || defaultStop;
      part = (routes.find((r) => ((JSON.parse(r.shape).coordinates[0].toString() === [stopData.stop_lon, stopData.stop_lat].toString()) && (JSON.parse(r.shape).coordinates[JSON.parse(r.shape).coordinates.length - 1].toString() === [nextStopData.stop_lon, nextStopData.stop_lat].toString())) || ((JSON.parse(r.shape).coordinates[JSON.parse(r.shape).coordinates.length - 1].toString()) === [stopData.stop_lon, stopData.stop_lat].toString() && JSON.parse(r.shape).coordinates[0].toString() === [nextStopData.stop_lon, nextStopData.stop_lat].toString())));
      if (part === undefined) {
        part = {
          id: "0",
          route_id: stop.route_id,
          shape: JSON.stringify({coordinates: [[stopData.stop_lon, stopData.stop_lat], [nextStopData.stop_lon, nextStopData.stop_lat]] }),
          route_type: 0,
          color: "808080",
        };
      }
      route_part.push(part);
      itineraire_stops.push(stopData);
      const routeColor = stop.route_id ? `#${routes.find((r) => r.route_id === stop.route_id)?.color}` : 'grey';
      stopData.color = routeColor;
    }
    
    const lastStopData = stops.find((s) => s.stop_id === DataPath[1][DataPath[1].length - 1].to_stop_id) || defaultStop;
    itineraire_stops.push(lastStopData);
    lastStopData.color = `#${routes.find((r) => r.route_id === DataPath[1][DataPath[1].length - 1].route_id)?.color || 'grey'}`;

    setMarkers(itineraire_stops);

    const geojson_output: RouteCollection[] = [];
    for (const route of route_part) {
      const lineCollection: RouteCollection = {
        collection: {
          type: "FeatureCollection",
          features: [route].map(route_trace => ({
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: JSON.parse(route_trace.shape).coordinates,
            },
            properties: {
              route_id: route_trace.route_id,
            },
          })),
        },
        route_id: route.route_id,
        route_color: `#${route.color}`,
      };
      geojson_output.push(lineCollection);
    }
    setGeojson(geojson_output);
  }

      if (DataPath[1][0] != undefined) {
      fetchItineraire();
    }
}, [DataPath]);

  return (
    <Map
      mapboxAccessToken={import.meta.env.VITE_REACT_APP_MAPBOX_TOKEN}
      initialViewState={{
        latitude: 48.8566,
        longitude: 2.3522,
        zoom: 11,
      }}
      style={{ flex: 1, margin: 0, padding: 0 }}
      reuseMaps
      mapStyle="mapbox://styles/mapbox/streets-v9"
    >
      {markers.map((stop, index) => (
        <Marker
          key={index}
          longitude={stop.stop_lon}
          latitude={stop.stop_lat}
        >
          <Icon item="marker" color={stop.color} onMouseEnter={() => setSelectedStop(stop)} onMouseLeave={() => setSelectedStop(null)} />
        </Marker>
      ))}
      {selectedStop && (
        <Popup
          latitude={selectedStop.stop_lat}
          longitude={selectedStop.stop_lon}
          closeButton={false}
        >
          <div>
            <Icon item={selectedStop.route_short_name} size={23} /><h2 style={{ margin: "0px" }}>{selectedStop.stop_name}</h2>
          </div>
        </Popup>
      )}
      {geojson && geojson.map((line, index) => (
        <Source key={index} id={`lineLayer${index}`} type="geojson" data={line.collection}>
          {
            line.route_color === "#808080" ? (
              <Layer
                id={`line${index}`}
                type="line"
                layout={{}}
                paint={{
                  'line-color': line.route_color || 'red',
                  'line-width': 5,
                  'line-dasharray': [2, 2],
                }}
              />
            ) : (
              <Layer
                id={`line${index}`}
                type="line"
                layout={{}}
                paint={{
                  'line-color': line.route_color || 'red',
                  'line-width': 5,
                }}
              />
            )
          }
        </Source>
      ))}
    </Map>
  );
});

export default MapItineraire;
