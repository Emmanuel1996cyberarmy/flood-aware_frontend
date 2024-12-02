import React, { useState, useEffect } from 'react';
import { Droplet, AlertTriangle, Map, UserCircle, ArrowRight, Bell } from 'lucide-react';

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeAlert, setActiveAlert] = useState(0);

  const alerts = [
    { level: 'Moderate', area: 'Downtown River District', time: '2 hours ago' },
    { level: 'High', area: 'Coastal Region', time: '1 hour ago' },
    { level: 'Low', area: 'Eastern Valley', time: '30 minutes ago' },
  ];

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setActiveAlert((prev) => (prev + 1) % alerts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: AlertTriangle, title: 'Real-time Alerts', description: 'Get instant notifications about flood risks in your area' },
    { icon: Map, title: 'Interactive Maps', description: 'View flood-prone zones and plan safe routes' },
    { icon: Bell, title: 'Early Warnings', description: 'Receive advanced warnings based on weather forecasts' },
    { icon: UserCircle, title: 'Personal Dashboard', description: 'Customize your alert preferences and safety plans' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-blue-500 opacity-10 animate-pulse" />
          {Array.from({ length: 20 }).map((_, i) => (
            <Droplet
              key={i}
              className="absolute text-blue-400 opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `fall ${2 + Math.random() * 3}s linear infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
              size={20 + Math.random() * 20}
            />
          ))}
        </div>

        <div className={`relative  max-w-6xl mx-auto px-4 py-20 transition-all duration-1000 ${isLoaded ? 'opacity-10 translate-y-0 lg:opacity-100' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-6xl font-bold text-blue-800 mb-6 text-center">
            Stay Safe with Flood Aware
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Your comprehensive flood management companion. Monitor risks, receive alerts, and protect what matters most.
          </p>
          {/* <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all flex items-center gap-2 mx-auto">
            Get Started
            <ArrowRight size={20} />
          </button> */}
        </div>
      </div>

      {/* Live Alerts Section */}
      <div className="bg-white/80 backdrop-blur-sm py-4 border-y border-blue-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="text-orange-500 animate-pulse" size={24} />
            </div>
            <div className="overflow-hidden">
              <div className="animate-slide">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800">
                    {alerts[activeAlert].level} Alert:
                  </span>
                  <span className="text-gray-600">
                    {alerts[activeAlert].area}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {alerts[activeAlert].time}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-100 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <Icon className="text-blue-600 mb-4" size={32} />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to stay prepared?</h2>
          <p className="text-blue-100 mb-8">
            Join thousands of users who trust Flood Aware for their safety and peace of mind.
          </p>
          
        </div>
      </div>
    </div>
  );
};

export default Home;