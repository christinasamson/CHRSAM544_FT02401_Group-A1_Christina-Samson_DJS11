import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

/**
 * Favorites component displays a list of favorite items.
 * Allows sorting by date or alphabetically, and provides
 * options to remove items and view associated shows.
 */
function Favorites() {
  // State to store favorite items and sorting order
  const [favorites, setFavorites] = useState([]);
  const [sortOrder, setSortOrder] = useState("date");
  const navigate = useNavigate();

  /**
   * Effect to load favorites from localStorage on component mount.
   */
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  /**
   * Effect to update localStorage when favorites change.
   */
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  /**
   * Handles removal of a favorite item by ID.
   */
  const handleRemoveFavorite = (id) => {
    setFavorites(favorites.filter(favorite => favorite.id !== id));
  };

  /**
   * Sorts favorites array based on sortOrder.
   */
  const sortedFavorites = [...favorites].sort((a, b) => {
    if (sortOrder === "date") {
      return new Date(b.date) - new Date(a.date);// Sort by date descending
    }
    return a.title.localeCompare(b.title); // Sort alphabetically by title
  });

  // Render favorites list with sorting options
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
