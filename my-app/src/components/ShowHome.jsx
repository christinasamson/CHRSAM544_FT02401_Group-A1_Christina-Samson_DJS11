import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import PodcastCarousel from "./Carousel";


const GENRE_TITLES = {
  1: "Personal Growth",
  2: "Investigative Journalism",
  3: "History",
  4: "Comedy",
  5: "Entertainment",
  6: "Business",
  7: "Fiction",
  8: "News",
  9: "Kids and Family"
};

function ShowHome() {
  const [shows, setShows] = useState([]);
  const [sortOrder, setSortOrder] = useState('A-Z');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  useEffect(() => {
    fetch('https://podcast-api.netlify.app')
      .then(response => response.json())
      .then(data => setShows(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const ChangeDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  const sortShows = (shows) => {
    return [...shows].sort((a, b) => {
      switch (sortOrder) {
        case 'A-Z':
          return a.title.localeCompare(b.title);
        case 'Z-A':
          return b.title.localeCompare(a.title);
        case 'Recent':
          return new Date(b.updated) - new Date(a.updated);
        case 'Oldest':
          return new Date(a.updated) - new Date(b.updated);
        default:
          return 0;
      }
    });
  };

  const filteredShows = sortShows(shows.filter(show =>
    show.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedGenre ? show.genres.includes(parseInt(selectedGenre)) : true)
  ));

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  return (
    <div className="container mt-4">
      <PodcastCarousel/>
      <h2 className="mb-4">Listen Now</h2>

      <div className="row mb-4">
        <div className="col-md-4">
          <label className="me-2">Sort by:</label>
          <select value={sortOrder} onChange={handleSortChange} className="form-select">
            <option value="A-Z">Title: A-Z</option>
            <option value="Z-A">Title: Z-A</option>
            <option value="Recent">Most Recently Updated</option>
            <option value="Oldest">Oldest Updated</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="me-2">Search:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            className="form-control"
            placeholder="What do you want to listen to?"
          />
        </div>

        <div className="col-md-4">
          <label className="me-2">Filter by Genre:</label>
          <select value={selectedGenre} onChange={handleGenreChange} className="form-select">
            <option value="">All Genres</option>
            {Object.entries(GENRE_TITLES).map(([id, title]) => (
              <option key={id} value={id}>{title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="row">
        {filteredShows.map(show => (
          <div className="col-md-4 mb-4" key={show.id}>
            <div className="card bg-dark text-light">
              <div className="card-body">
                <img style={{width:'200px', height:'300px'}} src={show.image} alt={show.title} />
                <h5 className="card-title">{show.title}</h5>
                <p className="card-text">{show.description.substring(0, 80)}</p>
                <p className="card-text">Updated: {ChangeDate(show.updated)}</p>
                <p className="card-text">Seasons: {show.seasons}</p>
                <Link to={`/showdetails/${show.id}`} className="btn btn-success">
                  View Show
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShowHome;
