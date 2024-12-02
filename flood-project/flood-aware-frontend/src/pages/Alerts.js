import React, { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import axios from 'axios';
import { subscribeUser } from '../api/subscribeApi.js';
import { STATE_COORDINATES } from './Routes';

const AlertsPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [activeTab, setActiveTab] = useState('subscribe');

  const [alerts, setAlerts] = useState([]);
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [alertsError, setAlertsError] = useState('');
  const [location, setLocation] = useState({ city: '', region: '', lat: null, lon: null });
  const [loadingLocation, setLoadingLocation] = useState(true);

  const IPTOKEN = process.env.REACT_APP_IPINFO_TOKEN

  const CRITICAL_THRESHOLDS = {
    rainfall: 50, // mm/h
    windSpeed: 15, // m/s
    humidity: 85, // percentage
  };

  const detectLocation = async () => {
    setLoadingLocation(true);
  
    const getBrowserLocation = () => 
      new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          return reject('Geolocation is not supported by this browser.');
        }
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => resolve({ lat: coords.latitude, lon: coords.longitude }),
          (error) => reject(error.message)
        );
      });
  
    try {
      // Attempt to get location using IP-based service
      const response = await axios.get(`https://ipinfo.io?token=${IPTOKEN}`);
      const { city, region, loc } = response.data;
      const [lat, lon] = loc.split(',');
      setLocation({ city, region, lat, lon });
    } catch (ipError) {
      console.warn('IP-based location detection failed. Falling back to browser geolocation:', ipError.message);
  
      try {
        // Fallback to browser geolocation
        const { lat, lon } = await getBrowserLocation();
        setLocation({ city: 'Unknown', region: 'Unknown', lat, lon });
      } catch (geoError) {
        console.error('Browser geolocation failed:', geoError);
        setLocation({ city: 'Unknown', region: 'Unknown', lat: null, lon: null });
      }
    } finally {
      setLoadingLocation(false);
    }
  };
  

  const fetchAlerts = async () => {
    if (!location.lat || !location.lon) {
      setAlertsError('Unable to determine your location for fetching alerts.');
      return;
    }
  
    setAlertsLoading(true);
    setAlertsError('');
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}`,
       
      );

      const data = response.data;
      
      if (data.weather) {

        const criticalAlerts = [];
        const { rain, wind, main } = data;

        if (rain && rain['1h'] > CRITICAL_THRESHOLDS.rainfall) {
          criticalAlerts.push(`Heavy Rainfall: ${rain['1h']}mm/h`);
        }
        if (wind && wind.speed > CRITICAL_THRESHOLDS.windSpeed) {
          criticalAlerts.push(`High Wind Speed: ${wind.speed} m/s`);
        }
        if (main && main.humidity > CRITICAL_THRESHOLDS.humidity) {
          criticalAlerts.push(`High Humidity: ${main.humidity}%`);
        }
        if (criticalAlerts.length > 0) {
          setAlerts(criticalAlerts);
        } else {
          setAlerts(['No critical alerts for your area.']);
        }
      } else {
        setAlerts([]);
      }
     
    } catch (error) {
      setAlertsError('Failed to fetch alerts. Please try again later.');
      console.error('Fetch alerts error:', error.message);
    } finally {
      setAlertsLoading(false);
    }
  };
  

  useEffect(() => {
    detectLocation();
  }, []);

  useEffect(() => {
    if (location.lat && location.lon) {
      fetchAlerts();
    }
  }, [location]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const { lat, lng } = STATE_COORDINATES[selectedState] || {};
    try {
      const response = await subscribeUser({ email, latitude: lat, longitude: lng });
      if (response.success) {
        setMessage(response.message);
      } else {
        setMessage(response.error || 'Subscription failed. Please try again.');
      }
    } catch (err) {
      setMessage('Subscription failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header Section */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Weather Alert System</h1>
        <p className="text-lg text-gray-600">Stay informed about critical weather conditions in your area.</p>
      </div>

        {/* Location Info */}
        {loadingLocation ? (
        <div className="flex justify-center items-center py-8">
          <ClipLoader size={30} color="#4A90E2" />
          <p className="ml-3 text-gray-600">Detecting your location...</p>
        </div>
      ) : (
        <div className="text-center mb-6">
          <p className="text-lg font-medium text-gray-700 blur">
           Your Location: {location.city}, {location.region}
          </p>
        </div>
      )}

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Thresholds Card */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-amber-800 mb-4">Critical Weather Thresholds</h2>
          <ul className="space-y-3 text-amber-700">
            <li className="flex items-center gap-2">
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-amber-200">💧</span>
              Rainfall: 50mm/h
            </li>
            <li className="flex items-center gap-2">
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-amber-200">💨</span>
              Wind Speed: 15 m/s
            </li>
            <li className="flex items-center gap-2">
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-amber-200">☁️</span>
              Humidity: 85%
            </li>
          </ul>
        </div>

        {/* How It Works Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-4">How It Works</h2>
          <div className="text-blue-700">
            <p className="mb-2">Our system monitors weather conditions 24/7 and sends instant alerts when:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Critical thresholds are exceeded</li>
              <li>Severe weather is approaching</li>
              <li>Emergency warnings are issued</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-md mx-auto">
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`flex-1 py-2 px-4 text-center ${
              activeTab === 'subscribe'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('subscribe')}
          >
            Subscribe
          </button>
          <button
            className={`flex-1 py-2 px-4 text-center ${
              activeTab === 'current'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('current')}
          >
            Current Alerts
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'subscribe' ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="" disabled>Select Your Location</option>
                  {Object.values(STATE_COORDINATES).map((state) => (
                    <option key={state.name} value={state.name}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <ClipLoader size={20} color="#ffffff" />
                    <span className="ml-2">Submitting...</span>
                  </div>
                ) : (
                  'Subscribe'
                )}
              </button>

              {message && (
                <p className={`text-center ${
                  message.includes('failed') ? 'text-red-500' : 'text-green-500'
                }`}>
                  {message}
                </p>
              )}
            </form>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-center mb-4">Active Weather Alerts</h2>
            {alertsLoading ? (
          <div className="flex justify-center items-center py-8">
            <ClipLoader size={30} color="#4A90E2" />
          </div>
        ) : alertsError ? (
          <p className="text-center text-red-500">{alertsError}</p>
        ) : alerts.length > 0 ? (
          <ul className="space-y-4">
           
            {alerts.map((alert, index) => (
              <li
                key={index}
                className="p-4 border border-blue-300 rounded-lg bg-blue-50 text-blue-700"
              >
                
                <p className="text-xs text-gray-500">
                   {alert} 
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No active weather alerts for your area.</p>
        )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsPage;