import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

// Fiji bounds to restrict panning
const fijiBounds = [
  [-21.5, 174.5],
  [-15.0, 180.5],
];

// Helper for custom Leaflet icons
const emojiIcon = (emoji) =>
  new L.DivIcon({
    className: "custom-emoji-icon",
    html: `<div style="font-size: 28px;">${emoji}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

// Marker data: icons + positions
const markers = [
  {
    id: "temp",
    title: "Air Temperature",
    position: [-17.7, 178.1],
    icon: emojiIcon("⛅"),
  },
  {
    id: "econ",
    title: "Economic Impact",
    position: [-16.5, 179.0],
    icon: emojiIcon("🌿"),
  },
  {
    id: "tourism",
    title: "Tourism",
    position: [-17.6, 177.0],
    icon: emojiIcon("👥"),
  },
  {
    id: "infra",
    title: "Infrastructure",
    position: [-16.85, 179.9],
    icon: emojiIcon("🏥"),
  },
  {
    id: "cyclone",
    title: "Cyclone Data",
    position: [-19.0, 178.5],
    icon: emojiIcon("🛣️"),
  },
];

export default function FijiMap({ onSelectTopic, selectedTopic }) {
  useEffect(() => {
    const zoomControl = document.querySelector(".leaflet-control-zoom");
    if (zoomControl) {
      zoomControl.style.top = "100px";
      zoomControl.style.left = "12px";
    }
  }, []);

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
        attribution='Map data &copy; <a href="https://www.mapbox.com/">Mapbox</a>, <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        tileSize={512}
        zoomOffset={-1}
      />

      {markers.map((marker, i) => (
        <MarkerWithZoom key={i} marker={marker} onSelectTopic={onSelectTopic} />
      ))}

      <SnapBackToFiji selectedTopic={selectedTopic} />
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

function SnapBackToFiji({ selectedTopic }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedTopic) {
      setTimeout(() => {
        map.flyTo([-17.7134, 178.065], 8, { duration: 2 });
      }, 300);
    }
  }, [selectedTopic]);

  return null;
}
