import { useState } from "react";
import FijiMap from "./FijiMap";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function App() {
  const [selectedTopic, setSelectedTopic] = useState(null);

  // Dummy data per topic
  const chartData = {
    "Air Temperature": [
      { name: "Jan", value: 24 },
      { name: "Feb", value: 26 },
      { name: "Mar", value: 29 },
      { name: "Apr", value: 30 },
      { name: "May", value: 32 },
    ],
    "Economic Impact": [
      { name: "2019", value: 3.5 },
      { name: "2020", value: 2.1 },
      { name: "2021", value: 4.0 },
      { name: "2022", value: 5.2 },
    ],
    "Tourism": [
      { name: "Q1", value: 12000 },
      { name: "Q2", value: 18000 },
      { name: "Q3", value: 22000 },
      { name: "Q4", value: 15000 },
    ],
    "Infrastructure": [
      { name: "Bridges", value: 65 },
      { name: "Roads", value: 120 },
      { name: "Hospitals", value: 12 },
      { name: "Schools", value: 40 },
    ],
    "Cyclone Data": [
      { name: "2018", value: 2 },
      { name: "2019", value: 1 },
      { name: "2020", value: 3 },
      { name: "2021", value: 2 },
    ],
  };

  const renderChart = (title) => {
    const data = chartData[title];

    switch (title) {
      case "Air Temperature":
        return (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[20, 40]} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        );

      case "Economic Impact":
      case "Tourism":
      case "Cyclone Data":
        return (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        );

      case "Infrastructure":
        return (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        );

      default:

        return <p>No chart available.</p>;
    }
  };
  return (
    <div className="w-screen h-screen relative font-sans text-white">
      {/* Navbar */}
      <div className="absolute top-0 left-0 right-0 h-14 bg-[#1e293b] flex items-center justify-between px-6 z-50 shadow">
        <div className="text-lg font-bold">🌴 FijiForecast360</div>
        <button className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-sm">Login</button>
      </div>

      {/* Map */}
      <FijiMap onSelectTopic={setSelectedTopic} />

      {/* Data Panel */}
      {selectedTopic && (
        <div className="fixed inset-0 bg-white text-black p-6 z-[9999] shadow-xl animate-slide-up overflow-auto border-8 border-red-600">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{selectedTopic.title}</h2>
            <button
              className="text-gray-600 hover:text-red-500 text-2xl"
              onClick={() => setSelectedTopic(null)}
            >
              ✕
            </button>
          </div>

          <div className="mt-6">
            {renderChart(selectedTopic.title)}
          </div>
        </div>
      )}
    </div>
  );
}
