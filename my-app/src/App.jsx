
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
    <Router>
      <>
        <Navbar />
        <Routes>
          <Route path="/" element={<ShowHome />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/showdetails/:id" element={<ShowDetails />} />
        </Routes>
        <Footer />
      </>
    </Router>
  );
}

export default App;
