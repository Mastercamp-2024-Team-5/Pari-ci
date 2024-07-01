import * as React from "react";
import { useEffect, useState } from "react";
import { Layer, Marker, Popup, Source } from "react-map-gl";
import Icon from "../Shared/Icon";
import { Route, RouteTrace, Stop, RouteCollection } from "../Shared/types";
import { ActiveRoutes } from "../Shared/enum";

interface MapElementsProps {
  selectedButton: ActiveRoutes;
}

const MapElements: React.FC<MapElementsProps> = ({ selectedButton }) => {
  const [uniqueMarkers, setUniqueMarkers] = useState<Stop[]>([]);
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [geojson, setGeojson] = useState<RouteCollection[]>([]);

  useEffect(() => {
    fetchStops(selectedButton);
    fetchGeojson(selectedButton);
  }, [selectedButton]);

  const fetchStops = async (buttonType: ActiveRoutes) => {
    try {
      const route_response = await fetch(
        `http://localhost:8000/routes?${buttonType}`
      );
      const routes: Route[] = await route_response.json();

      const response = await fetch(`http://127.0.0.1:8000/stops?${buttonType}`);
      const data: Stop[] = await response.json();

      if (!Array.isArray(data) || !data.length) {
        throw new Error("API response is not valid");
      }

      data.map((stop) => {
        stop.color = `#${
          routes.find((route) => route.route_id === stop.route_id)?.color
        }`;
      });

      const uniqueData = data.reduce((acc: Stop[], current: Stop) => {
        const x = acc.find(
          (item) =>
            item.parent_station === current.parent_station &&
            item.route_id === current.route_id
        );
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);

      setUniqueMarkers(uniqueData);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchGeojson = async (buttonType: ActiveRoutes) => {
    try {
      const route_response = await fetch(
        `http://localhost:8000/routes?${buttonType}`
      );
      const routes: Route[] = await route_response.json();

      const response = await fetch(
        `http://localhost:8000/routes_trace?${buttonType}`
      );
      const data: RouteTrace[] = await response.json();

      const geojson_output: RouteCollection[] = [];
      for (const route of routes) {
        const route_traces: RouteTrace[] = data.filter(
          (route_trace) => route_trace.route_id === route.route_id
        );

        const lineCollection: RouteCollection = {
          collection: {
            type: "FeatureCollection",
            features: route_traces.map((route_trace) => ({
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
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      {uniqueMarkers.map((stop, index) => (
        <Marker key={index} longitude={stop.stop_lon} latitude={stop.stop_lat}>
          <Icon
            item="marker"
            color={stop.color || "red"}
            onMouseEnter={() => setSelectedStop(stop)}
            onMouseLeave={() => setSelectedStop(null)}
          />
        </Marker>
      ))}
      {selectedStop && (
        <Popup
          longitude={selectedStop.stop_lon}
          latitude={selectedStop.stop_lat}
          closeButton={false}
          onClose={() => setSelectedStop(null)}
        >
          <div>
            <Icon item={selectedStop.route_short_name} size={23} />
            <h2 style={{ margin: "0px" }}>{selectedStop.stop_name}</h2>
          </div>
        </Popup>
      )}
      {geojson.map((line, index) => (
        <Source
          key={index}
          id={`lineLayer${index}`}
          type="geojson"
          data={line.collection}
        >
          <Layer
            id={`line${index}`}
            type="line"
            layout={{}}
            paint={{
              "line-color": line.route_color || "red",
              "line-width": 5,
            }}
          />
        </Source>
      ))}
    </>
  );
};

export default MapElements;
