import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Alerts from '../pages/Alerts';
import Reports from '../pages/Reports';
import RoutesPage from '../pages/Routes';
import Proile from '../pages/Profile';
import Header from '../components/Header';
import Login from '../components/Login';
import Register from '../components/Register';

const AppRouter = () => (
  <Router>
    <Header/>
    <Routes>
    


      <Route path="/" element={<Home />} />
      <Route path="/alerts" element={<Alerts />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/routes" element={<RoutesPage />} />
      <Route path="/Profile" element={<Proile />} />
      <Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
    </Routes>
  </Router>
);

export default AppRouter;
