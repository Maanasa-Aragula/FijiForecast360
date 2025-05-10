import { useState, useEffect } from "react";
import FijiMap from "./FijiMap";
import SplashScreen from "./splashscreen";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const [year, setYear] = useState("2025");
  const [month, setMonth] = useState("01");
  const [day, setDay] = useState("01");
  const [time, setTime] = useState("00:00");
  const [daysInMonth, setDaysInMonth] = useState(31);

  const [predictedTemp, setPredictedTemp] = useState(null);
  const [tempRange, setTempRange] = useState(null);
  const [populationData, setPopulationData] = useState(null);
  const [deathRate, setDeathRate] = useState(null);
  const [expectedDeaths, setExpectedDeaths] = useState(null);

  const [environmentalResults, setEnvironmentalResults] = useState(null);
  const [economicResults, setEconomicResults] = useState(null);
  const [selectedEnvParam, setSelectedEnvParam] = useState("");
  const [selectedEconParam, setSelectedEconParam] = useState("");

  const monthMap = {
    Jan: "01", Feb: "02", Mar: "03", Apr: "04",
    May: "05", Jun: "06", Jul: "07", Aug: "08",
    Sep: "09", Oct: "10", Nov: "11", Dec: "12"
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const numDays = new Date(parseInt(year), parseInt(month), 0).getDate();
    setDaysInMonth(numDays);
  }, [year, month]);

  const predictTemperature = async () => {
    try {
      const payload = {
        year: parseInt(year),
        month: parseInt(month),
        day: parseInt(day),
        hour: parseInt(time.split(":")[0]),
        dayofweek: new Date(`${year}-${month}-${day}`).getDay()
      };

      const res = await fetch("http://localhost:5000/predict-temperature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await res.json();

      if (result.prediction !== undefined) {
        setPredictedTemp(result.prediction);
        setTempRange(result.range);
      }
    } catch (err) {
      console.error("Temp prediction failed:", err);
    }
  };

  const predictMortality = async () => {
    try {
      const res = await fetch("http://localhost:5000/predict-mortality", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: parseInt(year) })
      });
      const result = await res.json();

      setPopulationData(result.population);
      setDeathRate(result.death_rate);
      setExpectedDeaths(result.expected_deaths);
    } catch (err) {
      console.error("Mortality prediction failed:", err);
    }
  };

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div className="w-screen h-screen relative font-sans text-white">
      {/* Top Navbar with logo */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-transparent flex items-center justify-between px-6 z-[1000] pointer-events-none">
        <img
          src="/icons/logo.webp"
          alt="FijiForecast360 Logo"
          className="h-12 object-contain max-w-[160px] pointer-events-auto"
        />
      </div>

      <FijiMap onSelectTopic={setSelectedTopic} selectedTopic={selectedTopic} />

      {/* Temperature Panel */}
      {selectedTopic?.title === "Air Temperature" && (
        <div className="absolute z-[9999] text-black p-4 rounded-lg shadow-2xl border border-gray-400 w-96"
          style={{
            backgroundColor: "white",
            top: "60%",
            left: "50%",
            transform: "translate(-50%, -50%)"
          }}>
          <h2 className="font-bold text-xl mb-3">Temperature Forecast</h2>
          <select value={year} onChange={(e) => setYear(e.target.value)} className="w-full mb-2 border rounded px-2 py-1">
            {[...Array(11)].map((_, i) => <option key={i} value={2025 + i}>{2025 + i}</option>)}
          </select>
          <select value={month} onChange={(e) => setMonth(e.target.value)} className="w-full mb-2 border rounded px-2 py-1">
            {Object.entries(monthMap).map(([k, v]) => <option key={v} value={v}>{k}</option>)}
          </select>
          <select value={day} onChange={(e) => setDay(e.target.value)} className="w-full mb-2 border rounded px-2 py-1">
            {[...Array(daysInMonth)].map((_, i) => {
              const d = (i + 1).toString().padStart(2, "0");
              return <option key={d} value={d}>{d}</option>;
            })}
          </select>
          <select value={time} onChange={(e) => setTime(e.target.value)} className="w-full mb-3 border rounded px-2 py-1">
            {["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <button onClick={predictTemperature} className="w-full py-2 bg-green-600 text-white rounded font-semibold mb-3">
            Predict
          </button>

          <div className="text-sm bg-gray-100 p-2 rounded">
            {predictedTemp && <div><strong>Temperature:</strong> {predictedTemp} °C</div>}
          </div>

          <button onClick={() => {
            setSelectedTopic(null);
            setPredictedTemp(null);
            setTempRange(null);
          }} className="mt-3 text-red-600 hover:text-red-800 font-semibold text-sm">
            ✕ Close
          </button>
        </div>
      )}

      {/* Infrastructure Panel */}
      {selectedTopic?.title === "Infrastructure" && (
        <div className="absolute z-[9999] text-black p-4 rounded-lg shadow-2xl border border-gray-400 w-96"
          style={{
            backgroundColor: "white",
            top: "60%",
            left: "50%",
            transform: "translate(-50%, -50%)"
          }}>
          <h2 className="font-bold text-xl mb-3">Population & Mortality</h2>
          <select value={year} onChange={(e) => setYear(e.target.value)} className="w-full mb-3 border rounded px-2 py-1">
            {[...Array(11)].map((_, i) => <option key={i} value={2025 + i}>{2025 + i}</option>)}
          </select>

          <button onClick={predictMortality} className="w-full py-2 bg-purple-600 text-white rounded font-semibold mb-3">
            Predict
          </button>

          <div className="text-sm bg-gray-100 p-2 rounded space-y-1">
            <div><strong>Population:</strong> {populationData}</div>
            <div><strong>Death Rate:</strong> {deathRate} per 1000</div>
            <div><strong>Expected Deaths:</strong> {expectedDeaths}</div>
          </div>

          <button onClick={() => {
            setSelectedTopic(null);
            setPopulationData(null);
            setDeathRate(null);
            setExpectedDeaths(null);
          }} className="mt-3 text-red-600 hover:text-red-800 font-semibold text-sm">
            ✕ Close
          </button>
        </div>
      )}

      {/* Cyclone (Environmental) Panel */}
      {selectedTopic?.title === "Cyclone Data" && (
        <div className="absolute z-[9999] text-black p-4 rounded-lg shadow-2xl border border-gray-400 w-96 max-h-[75vh] overflow-y-scroll"
          style={{
            backgroundColor: "white",
            top: "60%",
            left: "50%",
            transform: "translate(-50%, -50%)"
          }}>
          <h2 className="font-bold text-xl mb-3">Environmental Forecast</h2>
          <select value={year} onChange={(e) => setYear(e.target.value)} className="w-full mb-2 border rounded px-2 py-1">
            {[...Array(11)].map((_, i) => <option key={i} value={2025 + i}>{2025 + i}</option>)}
          </select>

          <button onClick={async () => {
            const res = await fetch("http://localhost:5000/predict-environment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ year: parseInt(year), temperature: parseFloat(predictedTemp || 28.5) })
            });
            const data = await res.json();
            setEnvironmentalResults(data);
            setSelectedEnvParam(Object.keys(data)[0] || "");
          }} className="w-full py-2 bg-green-700 text-white rounded font-semibold mb-3">
            Predict Environmental Impact
          </button>

          {environmentalResults && (
            <>
              <label className="block text-sm font-medium mb-1">Select Parameter:</label>
              <select value={selectedEnvParam} onChange={(e) => setSelectedEnvParam(e.target.value)}
                      className="w-full mb-2 border rounded px-2 py-1">
                {Object.keys(environmentalResults).map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
              {selectedEnvParam && (
                <div className="text-sm bg-gray-100 p-2 rounded">
                  <strong>{selectedEnvParam}:</strong> {environmentalResults[selectedEnvParam]}
                </div>
              )}
            </>
          )}

          <button onClick={() => {
            setSelectedTopic(null);
            setEnvironmentalResults(null);
            setSelectedEnvParam("");
          }} className="mt-3 text-red-600 hover:text-red-800 font-semibold text-sm">
            ✕ Close
          </button>
        </div>
      )}

      {/* Economic Panel */}
      {selectedTopic?.title === "Economic Impact" && (
        <div className="absolute z-[9999] text-black p-4 rounded-lg shadow-2xl border border-gray-400 w-96 max-h-[75vh] overflow-y-scroll"
          style={{
            backgroundColor: "white",
            top: "60%",
            left: "50%",
            transform: "translate(-50%, -50%)"
          }}>
          <h2 className="font-bold text-xl mb-3">Economic Forecast</h2>
          <select value={year} onChange={(e) => setYear(e.target.value)} className="w-full mb-2 border rounded px-2 py-1">
            {[...Array(11)].map((_, i) => <option key={i} value={2025 + i}>{2025 + i}</option>)}
          </select>

          <button onClick={async () => {
            const res = await fetch("http://localhost:5000/predict-economy", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ year: parseInt(year) })
            });
            const data = await res.json();
            setEconomicResults(data);
            setSelectedEconParam(Object.keys(data)[0] || "");
          }} className="w-full py-2 bg-blue-600 text-white rounded font-semibold mb-3">
            Predict Economic Indicators
          </button>

          {economicResults && (
            <>
              <label className="block text-sm font-medium mb-1">Select Parameter:</label>
              <select value={selectedEconParam} onChange={(e) => setSelectedEconParam(e.target.value)}
                      className="w-full mb-2 border rounded px-2 py-1">
                {Object.keys(economicResults).map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
              {selectedEconParam && (
                <div className="text-sm bg-gray-100 p-2 rounded">
                  <strong>{selectedEconParam}:</strong> {economicResults[selectedEconParam]}
                </div>
              )}
            </>
          )}

          <button onClick={() => {
            setSelectedTopic(null);
            setEconomicResults(null);
            setSelectedEconParam("");
          }} className="mt-3 text-red-600 hover:text-red-800 font-semibold text-sm">
            ✕ Close
          </button>
        </div>
      )}
    </div>
  );
}
