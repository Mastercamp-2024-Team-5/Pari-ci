import { useEffect, useState } from "react";
import Map, { Marker, Popup, Source, Layer } from "react-map-gl";
import { Stop, Route } from "./MapScreen";
import Icon from "../Shared/Icon";
import { FeatureCollection, Geometry, GeoJsonProperties, Feature } from "geojson";

interface ItineraireStop {
  from_stop_id: string;
  to_stop_id: string;
  route_id: string | null;
  route_short_name: string;
  wait_time: number;
  travel_time: number;
}

const MapItineraire = () => {
  const start_stop = 'IDFM:69884';
  const end_stop = 'IDFM:71292';
  const date = '2024-06-18';
  const time = '09:00:00';
  const [markers, setMarkers] = useState<Stop[]>([]);
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [geojson, setGeojson] = useState<FeatureCollection | null>(null);

  useEffect(() => {
    fetchItineraire();
  }, []);

  async function fetchItineraire() {
    const itineraire_response = await fetch(`http://127.0.0.1:8000/path?start_stop=${start_stop}&end_stop=${end_stop}&date=${date}&time=${time}`);
    const itineraire: ItineraireStop[][] = await itineraire_response.json();

    const stops_response = await fetch(`http://127.0.0.1:8000/stops?metro&rer&tram`);
    const stops: Stop[] = await stops_response.json();

    const routes_response = await fetch(`http://127.0.0.1:8000/routes?metro&rer&tram`);
    const routes: Route[] = await routes_response.json();

    if (!Array.isArray(itineraire) || !itineraire.length) {
      throw new Error('API response is not valid');
    }

    const itineraire_stops: Stop[] = [];
    const colors: string[] = [];
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

    for (const stop of itineraire[1]) {
      const stopData = stops.find((s) => s.stop_id === stop.from_stop_id) || defaultStop;
      itineraire_stops.push(stopData);
      const routeColor = stop.route_id ? `#${routes.find((r: Route) => r.route_id === stop.route_id)?.color}` : 'grey';
      stopData.color = routeColor;
      colors.push(routeColor);
    }
    
    const lastStopData = stops.find((s) => s.stop_id === itineraire[1][itineraire[1].length - 1].to_stop_id) || defaultStop;
    itineraire_stops.push(lastStopData);
    lastStopData.color = `#${routes.find((r: Route) => r.route_id === itineraire[1][itineraire[1].length - 1].route_id)?.color || 'grey'}`;

    setMarkers(itineraire_stops);

    const features: Feature<Geometry, GeoJsonProperties>[] = itineraire_stops.slice(0, -1).map((stop, index) => ({
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [stop.stop_lon, stop.stop_lat],
          [itineraire_stops[index + 1].stop_lon, itineraire_stops[index + 1].stop_lat],
        ],
      },
      properties: {
        color: colors[index],
      },
    }));

    const geojson: FeatureCollection = {
      type: "FeatureCollection",
      features: features,
    };
    setGeojson(geojson);
  }

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
      {geojson && (
        <Source id="routeLines" type="geojson" data={geojson}>
          <Layer
            id="routeLineLayer"
            type="line"
            layout={{}}
            paint={{
              'line-color': ['get', 'color'],
              'line-width': 5,
              'line-dasharray': [
                'case',
                ['==', ['get', 'color'], 'grey'],
                ['literal', [2, 2]],
                ['literal', [1, 0]]
              ],
            }}
          />
        </Source>
      )}
    </Map>
  );
};

export default MapItineraire;
