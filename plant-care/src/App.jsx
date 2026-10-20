import { useState } from "react";
import "./App.css";

const plants = [
  {
    name: "Rose",
    icon: "🌹",
    minTemp: 18,
    maxTemp: 30,
    humidity: 50,
    sunlight: "High",
    watering: "Regular",
  },
  {
    name: "Aloe Vera",
    icon: "🌵",
    minTemp: 15,
    maxTemp: 35,
    humidity: 30,
    sunlight: "High",
    watering: "Low",
  },
  {
    name: "Tulsi",
    icon: "🌿",
    minTemp: 20,
    maxTemp: 35,
    humidity: 40,
    sunlight: "High",
    watering: "Regular",
  },
  {
    name: "Money Plant",
    icon: "🍃",
    minTemp: 18,
    maxTemp: 30,
    humidity: 50,
    sunlight: "Medium",
    watering: "Moderate",
  },
  {
    name: "Snake Plant",
    icon: "🪴",
    minTemp: 15,
    maxTemp: 35,
    humidity: 30,
    sunlight: "Low",
    watering: "Low",
  },
];

function App() {
  const [city, setCity] = useState("");
  const [selectedPlant, setSelectedPlant] = useState(plants[0]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          city
        )}&count=1&language=en&format=json`
      );

      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error("City not found");
      }

      const location = geoData.results[0];

      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation&hourly=precipitation_probability&timezone=auto`
      );

      const weatherData = await weatherResponse.json();

      setWeather({
        city: location.name,
        country: location.country,
        temperature: weatherData.current.temperature_2m,
        humidity: weatherData.current.relative_humidity_2m,
        wind: weatherData.current.wind_speed_10m,
        precipitation: weatherData.current.precipitation,
        rainProbability:
          weatherData.hourly?.precipitation_probability?.[0] ?? 0,
      });
    } catch (err) {
      setError("Unable to get weather data. Try another city.");
    } finally {
      setLoading(false);
    }
  };

  const getRecommendations = () => {
    if (!weather) return [];

    const recommendations = [];

    if (weather.temperature < selectedPlant.minTemp) {
      recommendations.push(
        `Temperature is low. Keep your ${selectedPlant.name} in a warmer place.`
      );
    }

    if (weather.temperature > selectedPlant.maxTemp) {
      recommendations.push(
        `Temperature is high. Keep your ${selectedPlant.name} away from excessive heat.`
      );
    }

    if (
      weather.temperature >= selectedPlant.minTemp &&
      weather.temperature <= selectedPlant.maxTemp
    ) {
      recommendations.push(
        `Temperature is suitable for your ${selectedPlant.name}.`
      );
    }

    if (weather.humidity < selectedPlant.humidity) {
      recommendations.push(
        `Humidity is low. Your ${selectedPlant.name} may need extra moisture.`
      );
    } else {
      recommendations.push(
        `Humidity level is suitable for your ${selectedPlant.name}.`
      );
    }

    if (weather.rainProbability > 60) {
      recommendations.push(
        "Rain probability is high. Avoid unnecessary watering."
      );
    } else {
      recommendations.push(
        `Follow ${selectedPlant.watering.toLowerCase()} watering for this plant.`
      );
    }

    return recommendations;
  };

  const status =
    weather &&
    weather.temperature >= selectedPlant.minTemp &&
    weather.temperature <= selectedPlant.maxTemp &&
    weather.humidity >= selectedPlant.humidity
      ? "Good Conditions"
      : "Needs Attention";

  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">🌱 PlantCare</div>

        <div className="nav-links">
          <a href="#plants">Plants</a>
          <a href="#weather">Weather</a>
          <a href="#recommendations">Recommendations</a>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <span className="badge">SMART PLANT CARE</span>

          <h1>
            Grow Better.
            <br />
            <span>Care Smarter.</span>
          </h1>

          <p>
            Get smart plant-care recommendations using real-time weather
            conditions and plant requirements.
          </p>

          <a href="#plants" className="primary-btn">
            Choose Your Plant
          </a>
        </div>

        <div className="hero-plant">🌿</div>
      </section>

      <section className="section" id="plants">
        <div className="section-heading">
          <span>STEP 01</span>
          <h2>Select Your Plant</h2>
          <p>Choose the plant you want to monitor.</p>
        </div>

        <div className="plant-grid">
          {plants.map((plant) => (
            <div
              key={plant.name}
              className={`plant-card ${
                selectedPlant.name === plant.name ? "selected" : ""
              }`}
              onClick={() => setSelectedPlant(plant)}
            >
              <div className="plant-icon">{plant.icon}</div>
              <h3>{plant.name}</h3>
              <p>{plant.watering} watering</p>
            </div>
          ))}
        </div>
      </section>

      <section className="weather-section" id="weather">
        <div className="section-heading">
          <span>STEP 02</span>
          <h2>Check Local Weather</h2>
          <p>Enter your city to get current environmental conditions.</p>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Enter city name e.g. Jaipur"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") getWeather();
            }}
          />

          <button onClick={getWeather}>
            {loading ? "Loading..." : "Check Weather"}
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        {weather && (
          <div className="dashboard">
            <div className="dashboard-top">
              <div>
                <span className="small-label">CURRENT LOCATION</span>
                <h2>
                  {weather.city}, {weather.country}
                </h2>
              </div>

              <div
                className={`status ${
                  status === "Good Conditions" ? "good" : "warning"
                }`}
              >
                {status}
              </div>
            </div>

            <div className="weather-grid">
              <div className="weather-card">
                <span>🌡️</span>
                <small>Temperature</small>
                <strong>{weather.temperature}°C</strong>
              </div>

              <div className="weather-card">
                <span>💧</span>
                <small>Humidity</small>
                <strong>{weather.humidity}%</strong>
              </div>

              <div className="weather-card">
                <span>💨</span>
                <small>Wind Speed</small>
                <strong>{weather.wind} km/h</strong>
              </div>

              <div className="weather-card">
                <span>🌧️</span>
                <small>Rain Probability</small>
                <strong>{weather.rainProbability}%</strong>
              </div>
            </div>

            <div className="plant-info">
              <div className="plant-summary">
                <div className="big-icon">{selectedPlant.icon}</div>

                <div>
                  <span className="small-label">SELECTED PLANT</span>
                  <h2>{selectedPlant.name}</h2>
                  <p>Smart care requirements</p>
                </div>
              </div>

              <div className="requirements">
                <div>
                  <span>🌡️</span>
                  <b>Temperature</b>
                  <p>
                    {selectedPlant.minTemp}–{selectedPlant.maxTemp}°C
                  </p>
                </div>

                <div>
                  <span>💧</span>
                  <b>Humidity</b>
                  <p>{selectedPlant.humidity}%+</p>
                </div>

                <div>
                  <span>☀️</span>
                  <b>Sunlight</b>
                  <p>{selectedPlant.sunlight}</p>
                </div>
              </div>
            </div>

            <div className="recommendation" id="recommendations">
              <div className="recommendation-title">
                <span>💡</span>

                <div>
                  <span className="small-label">SMART ANALYSIS</span>
                  <h2>Care Recommendations</h2>
                </div>
              </div>

              <div className="recommendation-list">
                {getRecommendations().map((recommendation, index) => (
                  <div className="recommendation-item" key={index}>
                    {recommendation}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      <footer>
        <strong>🌱 PlantCare</strong>
        <span>Smart care for healthier plants.</span>
      </footer>
    </div>
  );
}

export default App;