import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CropRecommendation from './components/CropRecommendation';
import PestDetection from './components/PestDetection';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/crop-recommendation" element={<CropRecommendation />} />
          <Route path="/pest-detection" element={<PestDetection />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
