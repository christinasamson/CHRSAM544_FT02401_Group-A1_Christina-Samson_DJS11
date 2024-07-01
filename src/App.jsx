
import {Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ShowHome from './components/ShowHome';
import Favorites from './components/Favorites';
import ShowDetails from './components/ShowDetails';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  return (
  
      <>
        <Navbar />
        <Routes>
          <Route path="/" element={<ShowHome />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/showdetails/:id" element={<ShowDetails />} />
        </Routes>
        <Footer />
      </>

  );
}

export default App;
