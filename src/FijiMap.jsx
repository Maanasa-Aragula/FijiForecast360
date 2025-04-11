import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

// Map bounds
const fijiBounds = [
  [-21.5, 174.5],
  [-15.0, 180.5],
];

// Custom icon loader
const icon = (url) =>
  new L.Icon({
    iconUrl: url,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

const markers = [
  {
    id: "temp",
    title: "Air Temperature",
    position: [-17.7, 178.1],
    icon: icon("/icons/temperature.png"),
  },
  {
    id: "econ",
    title: "Economic Impact",
    position: [-16.5, 179.0],
    icon: icon("/icons/economy.png"),
  },
  {
    id: "tourism",
    title: "Tourism",
    position: [-17.6, 177.0],
    icon: icon("/icons/tourism.png"),
  },
  {
    id: "infra",
    title: "Infrastructure",
    position: [-16.85, 179.9],
    icon: icon("/icons/infrastructure.png"),
  },
  {
    id: "cyclone",
    title: "Cyclone Data",
    position: [-19.0, 178.5],
    icon: icon("/icons/cyclone.png"),
  },
];

export default function FijiMap({ onSelectTopic }) {
  return (
    <MapContainer
      center={[-17.7134, 178.065]}
      zoom={8}
      minZoom={6}
      maxZoom={12}
      scrollWheelZoom={true}
      doubleClickZoom={true}
      dragging={true}
      zoomControl={true}
      maxBounds={fijiBounds}
      maxBoundsViscosity={1.0}
      className="h-screen w-screen z-0"
    >
      <TileLayer
        url="https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmFuamplcyIsImEiOiJjbTlkMGdyYnUweHMwMnFxNDFvbWx1cDJpIn0.ban5sd-vXsT7lZQrXLBPlg"
        attribution='© <a href="https://www.mapbox.com/">Mapbox</a> © OpenStreetMap contributors'
        tileSize={512}
        zoomOffset={-1}
      />

      {markers.map((marker, i) => (
        <MarkerWithZoom key={i} marker={marker} onSelectTopic={onSelectTopic} />
      ))}

      <SnapBackToFiji />
    </MapContainer>
  );
}

function MarkerWithZoom({ marker, onSelectTopic }) {
  const map = useMap();

  const handleClick = () => {
    console.log("Marker clicked:", marker.title); 
    map.flyTo(marker.position, 13, { duration: 2 });
    onSelectTopic({ title: marker.title, position: marker.position });
  };

  return (
    <Marker
      position={marker.position}
      icon={marker.icon}
      eventHandlers={{ click: handleClick }}
    />
  );
}

function SnapBackToFiji() {
  const map = useMap();

  useEffect(() => {
    let lastValidCenter = map.getCenter();

    const handleMove = () => {
      const bounds = map.getBounds();
      if (!bounds.contains(lastValidCenter)) {
        setTimeout(() => {
          map.flyTo([-17.7134, 178.065], 8, { duration: 2 });
        }, 15000);
      } else {
        lastValidCenter = map.getCenter();
      }
    };

    map.on("moveend", handleMove);
    return () => map.off("moveend", handleMove);
  }, [map]);

  return null;
}
