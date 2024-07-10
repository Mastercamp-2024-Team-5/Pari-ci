import React, { useEffect, useState } from "react";
import { Marker, Popup, Source, Layer } from "react-map-gl";
import { Stop, RouteTrace, RouteCollection } from "../Shared/types";
import Icon from "../Shared/Icon";
import { useHomeContext } from "../Home/HomeContext";
import { BASE_API_LINK } from "../Shared/links";


const MapItineraire: React.FC = React.memo(() => {

  const [markers, setMarkers] = useState<Stop[]>([]);
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [geojson, setGeojson] = useState<RouteCollection[] | null>(null);
  const { dataPath } = useHomeContext();

  function isSameCoordinate(coord1: [number, number], coord2: [number, number]): boolean {
    // round to 9 decimal places to avoid floating point errors
    const fixed = 6;
    return coord1[0].toFixed(fixed) === coord2[0].toFixed(fixed) && coord1[1].toFixed(fixed) === coord2[1].toFixed(fixed);
  }

  function buildLineFromRoutePartsFunc(route_parts: RouteTrace[], start: [number, number], end: [number, number]): RouteTrace | undefined {
    // recursively build the line from the route parts
    const route_parts_f = route_parts.filter((r) => {
      const shape = JSON.parse(r.shape);
      return isSameCoordinate(shape.coordinates[0], start) || isSameCoordinate(shape.coordinates[shape.coordinates.length - 1], start);
    });
    for (const route_part of route_parts_f) {
      const shape = JSON.parse(route_part.shape);
      if (isSameCoordinate(shape.coordinates[0], end) || isSameCoordinate(shape.coordinates[shape.coordinates.length - 1], end)) {
        return route_part;
      }
      const next_start = isSameCoordinate(shape.coordinates[0], start) ? shape.coordinates[shape.coordinates.length - 1] : shape.coordinates[0];
      const next_route_parts = route_parts.filter((r) => r.route_id !== route_part.route_id);
      const next = buildLineFromRoutePartsFunc(next_route_parts, next_start, end);
      if (next === undefined) {
        continue;
      }
      else {
        return {
          id: route_part.id,
          route_id: route_part.route_id,
          shape: JSON.stringify({ coordinates: [...shape.coordinates, ...JSON.parse(next.shape).coordinates] }),
          route_type: route_part.route_type,
          color: route_part.color,
        };
      }
    }
    return undefined;
  }

  const buildLineFromRouteParts = React.useCallback(buildLineFromRoutePartsFunc, [buildLineFromRoutePartsFunc]);

  useEffect(() => {
    async function fetchItineraire() {
      if (dataPath === null) {
        return;
      }
      const stops_response = await fetch(`${BASE_API_LINK}/stops?metro&rer&tram&train`);
      const stops: Stop[] = await stops_response.json();

      const routes_response = await fetch(`${BASE_API_LINK}/routes_trace?metro&rer&tram&train`);
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
      for (const edge of dataPath[1]) {
        const stopData = stops.find((s) => s.stop_id === edge.from_stop_id && s.route_id === edge.route_id) || stops.find((s) => s.stop_id === edge.from_stop_id) || defaultStop;
        const nextStopData = stops.find((s) => s.stop_id === edge.to_stop_id) || defaultStop;
        const routeParts = routes.filter(shape => shape.route_id === edge.route_id);
        part = buildLineFromRouteParts(routeParts, [stopData.stop_lon, stopData.stop_lat], [nextStopData.stop_lon, nextStopData.stop_lat]);
        if (part === undefined) {
          const routeColor = routes.find((r) => r.route_id === edge.route_id)?.color
          const color = routeColor || '808080';
          part = {
            id: "0",
            route_id: edge.route_id,
            shape: JSON.stringify({ coordinates: [[stopData.stop_lon, stopData.stop_lat], [nextStopData.stop_lon, nextStopData.stop_lat]] }),
            route_type: 0,
            color: color,
          };
        }
        route_part.push(part);
        itineraire_stops.push(stopData);
        const routeColor = routes.find((r) => r.route_id === edge.route_id)?.color
        stopData.color = routeColor ? `#${routeColor}` : 'grey';
      }

      const lastStopData = stops.find((s) => s.stop_id === dataPath[1][dataPath[1].length - 1].to_stop_id) || defaultStop;
      itineraire_stops.push(lastStopData);
      const routeColor = routes.find((r) => r.route_id === dataPath[1][dataPath[1].length - 1].route_id)?.color
      lastStopData.color = routeColor ? `#${routeColor}` : 'grey';

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

    if (dataPath?.[1][0] != undefined && dataPath !== null) {
      fetchItineraire();
    }
  }, [dataPath, buildLineFromRouteParts]);

  return (
    <>
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
            {
              selectedStop.route_short_name && <Icon item={selectedStop.route_short_name} size={23} />
            }
            <h2 style={{ margin: "0px" }}>{selectedStop.stop_name}</h2>
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
    </>
  );
});

export default MapItineraire;
