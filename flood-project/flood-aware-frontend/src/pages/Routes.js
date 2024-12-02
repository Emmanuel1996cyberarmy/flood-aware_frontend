import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, Circle } from 'react-leaflet';
import { AlertTriangle, Droplets, Navigation, Clock, Shield, Info } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

// OpenWeatherMap API Configuration
const OPEN_WEATHER_API_KEY =  process.env.REACT_APP_OPENWEATHER_API_KEY

const IP_API_URL = "https://ipapi.co/json/";

const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

export const STATE_COORDINATES = {
    Abia: { lat: 5.4527, lng: 7.5248, name: 'Abia' },
    Adamawa: { lat: 9.3265, lng: 12.3984, name: 'Adamawa' },
    AkwaIbom: { lat: 5.0513, lng: 7.9329, name: 'Akwa Ibom' },
    Anambra: { lat: 6.2109, lng: 7.0758, name: 'Anambra' },
    Bauchi: { lat: 10.3142, lng: 9.8463, name: 'Bauchi' },
    Bayelsa: { lat: 4.7719, lng: 6.0699, name: 'Bayelsa' },
    Benue: { lat: 7.1907, lng: 8.1297, name: 'Benue' },
    Borno: { lat: 11.8333, lng: 13.1500, name: 'Borno' },
    CrossRiver: { lat: 5.9631, lng: 8.3350, name: 'Cross River' },
    Delta: { lat: 5.8904, lng: 5.6800, name: 'Delta' },
    Ebonyi: { lat: 6.2649, lng: 8.0133, name: 'Ebonyi' },
    Edo: { lat: 6.5244, lng: 5.9339, name: 'Edo' },
    Ekiti: { lat: 7.6216, lng: 5.2289, name: 'Ekiti' },
    Enugu: { lat: 6.5244, lng: 7.5106, name: 'Enugu' },
    Gombe: { lat: 10.2897, lng: 11.1713, name: 'Gombe' },
    Imo: { lat: 5.5720, lng: 7.0588, name: 'Imo' },
    Jigawa: { lat: 12.1511, lng: 9.6517, name: 'Jigawa' },
    Kaduna: { lat: 10.5105, lng: 7.4165, name: 'Kaduna' },
    Kano: { lat: 12.0022, lng: 8.5910, name: 'Kano' },
    Katsina: { lat: 12.9849, lng: 7.6176, name: 'Katsina' },
    Kebbi: { lat: 12.4508, lng: 4.1994, name: 'Kebbi' },
    Kogi: { lat: 7.7969, lng: 6.7396, name: 'Kogi' },
    Kwara: { lat: 8.5740, lng: 4.5501, name: 'Kwara' },
    Lagos: { lat: 6.5244, lng: 3.3792, name: 'Lagos' },
    Nasarawa: { lat: 8.5380, lng: 8.3220, name: 'Nasarawa' },
    Niger: { lat: 9.0810, lng: 6.5870, name: 'Niger' },
    Ogun: { lat: 6.9976, lng: 3.4737, name: 'Ogun' },
    Ondo: { lat: 7.2508, lng: 5.2103, name: 'Ondo' },
    Osun: { lat: 7.5629, lng: 4.5190, name: 'Osun' },
    Oyo: { lat: 7.3776, lng: 3.9470, name: 'Oyo' },
    Plateau: { lat: 9.2182, lng: 9.5175, name: 'Plateau' },
    Rivers: { lat: 4.8156, lng: 7.0498, name: 'Rivers' },
    Sokoto: { lat: 13.0059, lng: 5.2476, name: 'Sokoto' },
    Taraba: { lat: 8.8932, lng: 11.3748, name: 'Taraba' },
    Yobe: { lat: 12.1872, lng: 11.7060, name: 'Yobe' },
    Zamfara: { lat: 12.1700, lng: 6.6618, name: 'Zamfara' },
    FCT: { lat: 9.0765, lng: 7.3986, name: 'Federal Capital Territory' }
  };
  
  
const Routes = () => {
  const [routes, setRoutes] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [weatherData, setWeatherData] = useState({});
  const [mapCenter, setMapCenter] = useState([9.0820, 8.6753]); // Nigeria's center coordinates
  const [activeTab, setActiveTab] = useState('map');
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [riskZones, setRiskZones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRoutes();
    determineOrigin();
    fetchWeatherData();
  }, [selectedState]);

  useEffect(() => {
    if (origin && selectedState) {
      fetchRoutes();
      fetchWeatherData();
    }
  }, [origin, selectedState]);

  const determineOrigin = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setOrigin({ lat: latitude, lng: longitude });
          setMapCenter([latitude, longitude]);
        },
        async () => {
          // If browser geolocation fails, fallback to IP-based geolocation
          const { data } = await axios.get(IP_API_URL);
          setOrigin({ lat: data.latitude, lng: data.longitude });
          setMapCenter([data.latitude, data.longitude]);
        }
      );
    } else {
      // If geolocation is not supported, fallback to IP-based geolocation
      const { data } = await axios.get(IP_API_URL);
      setOrigin({ lat: data.latitude, lng: data.longitude });
      setMapCenter([data.latitude, data.longitude]);
    }
  };

  const fetchRoutes = async () => {
    try {
      if (!origin || !selectedState) return;

      const destination = STATE_COORDINATES[selectedState];
      const routesData = [
        {
          id: 1,
          origin,
          destination,
          riskLevel: 'Medium',
          alternateRoutes: [
            { lat: origin.lat, lng: origin.lng },
            { lat: (origin.lat + destination.lat) / 2, lng: (origin.lng + destination.lng) / 2 },
            { lat: destination.lat, lng: destination.lng },
          ],
        },
      ];
      setRoutes(routesData);
    } catch (error) {
      console.error('Error fetching routes:', error);
    }
  };

  const fetchWeatherData = async () => {
    if (!selectedState) return;

    try {
      const { lat, lng } = STATE_COORDINATES[selectedState] || {};
      if (!lat || !lng) return;

      const response = await axios.get(WEATHER_API_URL, {
        params: {
          lat,
          lon: lng,
          appid: OPEN_WEATHER_API_KEY,
          units: 'metric', // Fetch data in Celsius
        },
      });

      setWeatherData((prev) => ({
        ...prev,
        [selectedState]: response.data,
      }));
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const filterRoutesByState = useMemo(() => {
    return routes.filter(
      (route) => route.destination.name === selectedState
    );
  }, [routes, selectedState]);

  const determineTravelCondition = (state) => {
    const weather = weatherData[state];
    if (!weather) return null;

    const temp = weather.main.temp;
    const condition = weather.weather[0].description.toLowerCase();

    return temp > 15 && temp < 35 && !condition.includes("rain")
      ? "good"
      : "not good";
  };

  const getRouteColor = (state) => {
    const condition = determineTravelCondition(state);  // Check condition
    return condition === 'not good' ? 'red' : 'green';  // Dynamic color based on condition
  };

  const svgIcon = `
  <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
    <path fill-rule="evenodd" d="M11.906 1.994a8.002 8.002 0 0 1 8.09 8.421 7.996 7.996 0 0 1-1.297 3.957.996.996 0 0 1-.133.204l-.108.129c-.178.243-.37.477-.573.699l-5.112 6.224a1 1 0 0 1-1.545 0L5.982 15.26l-.002-.002a18.146 18.146 0 0 1-.309-.38l-.133-.163a.999.999 0 0 1-.13-.202 7.995 7.995 0 0 1 6.498-12.518ZM15 9.997a3 3 0 1 1-5.999 0 3 3 0 0 1 5.999 0Z" clip-rule="evenodd"/>
  </svg>
`;
  
  const customIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(svgIcon),
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
  
  const getRiskLevel = (weather) => {
    if (!weather) return { level: 'unknown', color: 'gray' };
    
    const rainfall = weather.rain?.['1h'] || 0;
    const windSpeed = weather.wind?.speed || 0;
    
    if (rainfall > 50 || windSpeed > 20) {
      return { level: 'High Risk', color: 'red' };
    } else if (rainfall > 25 || windSpeed > 10) {
      return { level: 'Medium Risk', color: 'orange' };
    }
    return { level: 'Low Risk', color: 'green' };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gray-600 text-white py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Safe Route Planning</h1>
          <p className="text-blue-100">Plan with real-time flood and weather insights</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        {/* Action Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <select
              value={selectedState || ''}
              onChange={(e) => setSelectedState(e.target.value)}
              className="flex-grow md:flex-grow-0 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Destination</option>
              {Object.keys(STATE_COORDINATES).map((state) => (
                <option key={state} value={state}>
                  {STATE_COORDINATES[state].name}
                </option>
              ))}
            </select>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveTab('map')}
                className={`px-4 py-2 rounded-md ${activeTab === 'map' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
              >
                <Navigation className="inline-block mr-2" size={16} />
                Map View
              </button>
              <button 
                onClick={() => setActiveTab('list')}
                className={`px-4 py-2 rounded-md ${activeTab === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
              >
                <Info className="inline-block mr-2" size={16} />
                Route Details
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className={`md:col-span-2 bg-white rounded-lg shadow-sm ${activeTab === 'map' ? '' : 'hidden md:block'}`}>
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Interactive Route Map</h2>
            </div>
            <div className="relative">
              <MapContainer
                center={mapCenter}
                zoom={6}
                className="h-[600px] w-full rounded-b-lg"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="© OpenStreetMap contributors"
                />
                
                {/* Risk Zones */}
                {riskZones.map((zone, index) => (
                  <Circle
                    key={index}
                    center={[zone.lat, zone.lng]}
                    radius={zone.radius * 1000}
                    pathOptions={{
                      color: zone.riskLevel === 'high' ? 'red' : 'orange',
                      fillColor: zone.riskLevel === 'high' ? 'red' : 'orange',
                      fillOpacity: 0.2
                    }}
                  >
                    <Popup>
                      <strong>{zone.name}</strong>
                      <br />
                      Risk Level: {zone.riskLevel}
                    </Popup>
                  </Circle>
                ))}

                {/* Routes */}
                {filterRoutesByState.map((route) => (
            <React.Fragment key={route.id}>
              <Polyline
                positions={[
                  [route.origin.lat, route.origin.lng],
                  [route.destination.lat, route.destination.lng],
                ]}
                color={getRouteColor(route.origin.name)}  // Dynamic color
                weight={5}
                dashArray={route.origin.name === 'bad' ? '10, 10' : ''}
                onClick={() => setSelectedRoute(route)}
              />
              <Marker position={[route.origin.lat, route.origin.lng]} icon={customIcon}>
                <Popup>{route.origin.name}</Popup>
              </Marker>
              <Marker position={[route.destination.lat, route.destination.lng]} icon={customIcon}>
              <Popup>{route.destination.name}</Popup>
            </Marker>
            </React.Fragment>
          ))}
              </MapContainer>

              {/* Map Overlay */}
              <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span>Safe Route</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span>High Risk Route</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <div className={`bg-white rounded-lg shadow-sm ${activeTab === 'list' ? 'md:col-span-1' : 'hidden md:block'}`}>
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Route Information</h2>
            </div>
            
            {selectedState && weatherData[selectedState] ? (
              <div className="p-4">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Current Conditions</h3>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Droplets className="text-blue-600" />
                        <span className="font-medium">Weather Status</span>
                      </div>
                      <p className="text-gray-600">
                        {weatherData[selectedState].weather[0].description}
                      </p>
                      <p className="text-2xl font-bold mt-1">
                        {weatherData[selectedState].main.temp}°C
                      </p>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="text-orange-600" />
                        <span className="font-medium">Risk Assessment</span>
                      </div>
                      <p className={`text-lg font-semibold ${
                        getRiskLevel(weatherData[selectedState]).color === 'red' 
                          ? 'text-red-600' 
                          : 'text-green-600'
                      }`}>
                        {getRiskLevel(weatherData[selectedState]).level}
                      </p>
                    </div>

                    {selectedRoute && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Navigation className="text-gray-600" />
                          <span className="font-medium">Route Details</span>
                        </div>
                        <div className="space-y-2">
                          <p>Distance: {(Math.random() * 100 + 100).toFixed(1)} km</p>
                          <p>Estimated Time: {Math.floor(Math.random() * 3 + 1)} hours</p>
                          <p>Elevation Change: +{Math.floor(Math.random() * 500)} m</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-3">Safety Tips</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <Shield size={16} />
                      <span>Check local weather updates frequently</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>Plan your journey during daylight hours</span>
                    </li>
                    {/* Add more tips based on conditions */}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                Select a destination to view route information
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Routes;
