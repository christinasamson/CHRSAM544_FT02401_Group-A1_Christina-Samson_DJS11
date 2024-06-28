import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
// import './ShowHome.css';

function ShowHome() {
  const [shows, setShows] = useState([]);

  useEffect(() => {
    fetch('https://podcast-api.netlify.app')
      .then(response => response.json())
      .then(data => setShows(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Listen to Shows</h2>
      <div className="row">
        {shows.map(show => (
          <div className="col-md-4 mb-4" key={show.id}>
            <div className="card bg-dark text-light">
              <div className="card-body">
                <img style={{width:'200px', height:'300px'}}  src={show.image}/>
                <h5 className="card-title">{show.title}</h5>
                <p className="card-text">{show.description}</p>
                <p className="card-text">Updated: {new Date(show.updated).toLocaleDateString()}</p>
                <p className="card-text">Seasons: {show.seasons.length}</p>
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
