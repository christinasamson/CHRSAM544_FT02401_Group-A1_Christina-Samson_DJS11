import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import PodcastCarousel from "./Carousel";

//Mapping of genre IDs to their respective titles.
 
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


 // Generate the home page with a list of shows based on search and sort criteria.
 
function ShowHome() {
  const [shows, setShows] = useState([]); // State to store the list of shows
  const [sortOrder, setSortOrder] = useState('A-Z'); // State to sorting order
  const [searchTerm, setSearchTerm] = useState(''); //State for search term
  const [selectedGenre, setSelectedGenre] = useState(''); //state for selected genre

  useEffect(() => {
    fetch('https://podcast-api.netlify.app')
      .then(response => response.json())
      .then(data => setShows(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

//Function to format date strings into a human-readable format.
  const ChangeDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
//Event handler for updating search term state.
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

//Event handler for updating selected genre state.
  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  //Function to sort shows based on selected sort order.
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
//Array of filtered shows based on search term and selected genre.
  const filteredShows = sortShows(shows.filter(show =>
    show.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedGenre ? show.genres.includes(parseInt(selectedGenre)) : true)
  ));

  //Event handler for updating sort order state.
  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };
//Renders the main UI component .
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
