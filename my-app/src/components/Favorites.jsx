import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [sortOrder, setSortOrder] = useState("date");
  const navigate = useNavigate();

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const handleRemoveFavorite = (id) => {
    setFavorites(favorites.filter(favorite => favorite.id !== id));
  };

  const sortedFavorites = [...favorites].sort((a, b) => {
    if (sortOrder === "date") {
      return new Date(b.date) - new Date(a.date);
    }
    return a.title.localeCompare(b.title);
  });

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Favorites</h2>
      <div className="mb-4">
        <button
          className="btn btn-primary me-2"
          onClick={() => setSortOrder("date")}
        >
          Sort by Date
        </button>
        <button className="btn btn-primary" onClick={() => setSortOrder("alpha")}>
          Sort Alphabetically
        </button>
      </div>
      <div>
        {sortedFavorites.map(favorite => (
          <div key={favorite.id} className="card bg-dark text-light mb-2">
            <div className="card-body">
              <h5 className="card-title">{favorite.title}</h5>
              <p className="card-text">{favorite.description}</p>
              <p className="card-text">Added on: {new Date(favorite.date).toLocaleDateString()}</p>
              <button
                className="btn btn-danger"
                onClick={() => handleRemoveFavorite(favorite.id)}
              >
                Remove
              </button>
              <button
                className="btn btn-secondary ms-2"
                onClick={() => navigate(`/shows/${favorite.showId}`)}
              >
                View Show
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Favorites;
