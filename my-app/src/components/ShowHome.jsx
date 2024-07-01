import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function ShowHome() {
  const [shows, setShows] = useState([]);
  const [sortOrder, setSortOrder] = useState('A-Z');
  const [searchTerm, setSearchTerm] = useState('');

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

  const sortedShows = [...shows].sort((a, b) => (
    sortOrder === 'A-Z' ? a.title.localeCompare(b.title) :
    sortOrder === 'Z-A' ? b.title.localeCompare(a.title) :
    sortOrder === 'Recent' ? new Date(b.updated) - new Date(a.updated) :
    new Date(a.updated) - new Date(b.updated)
  ));

  const filteredShows = sortedShows.filter(show => (
    show.title.toLowerCase().includes(searchTerm.toLowerCase())
  ));

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Listen Now</h2>

      <div>
        <label>Sort by:</label>
        <div>
          <button className={`btn ${sortOrder === 'A-Z' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setSortOrder('A-Z')}>
            Title: A-Z
          </button>
          <button className={`btn ${sortOrder === 'Z-A' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setSortOrder('Z-A')}>
            Title: Z-A
          </button>
          <button className={`btn ${sortOrder === 'Recent' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setSortOrder('Recent')}>
            Most Recently Updated
          </button>
          <button className={`btn ${sortOrder === 'Oldest' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setSortOrder('Oldest')}>
            Oldest Updated
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label>Search</label>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          className="form-control"
          placeholder="What do you want to listen to?"
        />
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
