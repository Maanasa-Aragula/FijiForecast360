
from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import json
import math
from datetime import datetime

app = Flask(__name__)
CORS(app)

# === Load Climate Model ===
with open('/Users/pragnasrivellanki/Desktop/best_time_model.pkl', 'rb') as f:
    temp_model = pickle.load(f)
with open('/Users/pragnasrivellanki/Desktop/best_time_model_info.json', 'r') as f:
    temp_model_info = json.load(f)

# === Load Mortality JSONs ===
with open('/Users/pragnasrivellanki/Desktop/population.json', 'r') as f:
    population_data = json.load(f)
with open('/Users/pragnasrivellanki/Desktop/death_rate_predictions.json', 'r') as f:
    death_rate_data = json.load(f)

# === Load Environmental Model ===
with open('/Users/pragnasrivellanki/Desktop/fiji_models/environmental_model.pkl', 'rb') as f:
    env_model_bundle = pickle.load(f)
    env_model = env_model_bundle['model']
    env_indicators = env_model_bundle['indicators']

# === Load Economic Model ===
with open('/Users/pragnasrivellanki/Desktop/fiji_models/economic_model.pkl', 'rb') as f:
    econ_model_bundle = pickle.load(f)
    econ_model = econ_model_bundle['model']
    econ_indicators = econ_model_bundle['indicators']

# === Utility: Generate climate features ===
def generate_climate_features(year, month, day, hour, dayofweek):
    dt = datetime(year, month, day)
    dayofyear = dt.timetuple().tm_yday
    weekofyear = int(dt.strftime("%V"))
    return {
        "year": year,
        "month": month,
        "day": day,
        "hour": hour,
        "dayofweek": dayofweek,
        "weekofyear": weekofyear,
        "years_since_1950": year - 1950,
        "sin_hour": math.sin(2 * math.pi * hour / 24),
        "cos_hour": math.cos(2 * math.pi * hour / 24),
        "sin_dayofyear": math.sin(2 * math.pi * dayofyear / 365.25),
        "cos_dayofyear": math.cos(2 * math.pi * dayofyear / 365.25),
        "sin_week": math.sin(2 * math.pi * weekofyear / 52),
        "cos_week": math.cos(2 * math.pi * weekofyear / 52),
        "sin_month": math.sin(2 * math.pi * month / 12),
        "cos_month": math.cos(2 * math.pi * month / 12),
        "sin_dayofweek": math.sin(2 * math.pi * dayofweek / 7),
        "cos_dayofweek": math.cos(2 * math.pi * dayofweek / 7),
    }

# === Route: Predict only temperature ===
@app.route('/predict-temperature', methods=['POST'])
def predict_temperature():
    data = request.get_json()
    try:
        year = int(data["year"])
        month = int(data["month"])
        day = int(data["day"])
        hour = int(data["hour"])
        dayofweek = int(data["dayofweek"])
    except Exception as e:
        return jsonify({"error": f"Missing or invalid fields: {e}"}), 400

    features = generate_climate_features(year, month, day, hour, dayofweek)
    input_df = pd.DataFrame([features])[temp_model_info["features"]]
    temperature = float(temp_model.predict(input_df)[0])

    return jsonify({
        "prediction": round(temperature, 2),
        "range": {
            "lower": round(temperature - temp_model_info.get("std_dev", 1.5), 2),
            "upper": round(temperature + temp_model_info.get("std_dev", 1.5), 2),
        }
    })

# === Route: Predict only mortality ===
@app.route('/predict-mortality', methods=['POST'])
def predict_mortality():
    data = request.get_json()
    year = str(data.get("year"))
    pop = population_data.get(year)
    death_rate = death_rate_data.get(year)
    deaths = pop * death_rate / 1000 if pop and death_rate else None

    return jsonify({
        "population": round(pop, 3) if pop else None,
        "death_rate": round(death_rate, 3) if death_rate else None,
        "expected_deaths": round(deaths, 3) if deaths else None
    })

# === Route: Predict environment ===
@app.route('/predict-environment', methods=['POST'])
def predict_environment():
    data = request.get_json()
    if "year" not in data or "temperature" not in data:
        return jsonify({"error": "Missing 'year' or 'temperature'"}), 400

    year = int(data["year"])
    temp = float(data["temperature"])
    X = [[year, temp]]
    preds = env_model.predict(X)[0]
    return jsonify(dict(zip(env_indicators, map(lambda x: round(x, 3), preds))))

# === Route: Predict economy ===
@app.route('/predict-economy', methods=['POST'])
def predict_economy():
    data = request.get_json()
    if "year" not in data:
        return jsonify({"error": "Missing 'year'"}), 400

    year = int(data["year"])
    X = [[year]]
    preds = econ_model.predict(X)[0]
    return jsonify(dict(zip(econ_indicators, map(lambda x: round(x, 3), preds))))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
