import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

/**
 * Renders the details page for a specific podcast show.
 * Displays show information, seasons, and episodes with options
 * to favorite episodes and navigate back to the home page.*/

function ShowDetails() {
  const { id } = useParams(); // Retrieves the show ID from the URL params
  const [show, setShow] = useState(null); // State to store the show details
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to manage error state
  const [openSeasonId, setOpenSeasonId] = useState(null); // State to manage open season ID
  const [favorites, setFavorites] = useState([]); // State to manage favorite episodes
  const navigate = useNavigate(); // Navigation utility from React Router

/**
   * Effect hook to fetch show details from the API based on the show ID.
   */
  useEffect(() => {
    fetch(`https://podcast-api.netlify.app/id/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch show details');
        }
        return response.json();
      })
      .then(data => {
        setShow(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error);
        setLoading(false);
      });
  }, [id]);

  /**
   * Effect hook to load stored favorite episodes from local storage on component mount.
   */
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  /**
   * Handles the click event for expanding/collapsing a season's episodes.
   * The ID of the season to expand or collapse.
   */
  const handleSeasonClick = (seasonId) => {
    setOpenSeasonId(seasonId === openSeasonId ? null : seasonId);
  };

   /**
   * Toggles the favorite status of an episode.
   * Adds or removes the episode from the favorites list in local storage.
   * The episode object to favorite/unfavorite.
   */
  const handleFavoriteToggle = (episode) => {
    const isFavorited = favorites.some(fav => fav.id === episode.id);
    let updatedFavorites;
    if (isFavorited) {
      updatedFavorites = favorites.filter(fav => fav.id !== episode.id);
    } else {
      const newFavorite = {
        id: episode.id,
        title: episode.title,
        description: episode.description,
        date: new Date().toISOString(),
        showId: id,
        showTitle: show.title
      };
      updatedFavorites = [...favorites, newFavorite];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  /**
   * Checks if an episode is favorited.
   *  Returns true if the episode is favorited, otherwise false.
   */
  const isEpisodeFavorited = (episodeId) => {
    return favorites.some(fav => fav.id === episodeId);
  };

  /**
   * Retrieves the date when an episode was favorited.
   *Returns the favorite date in string format or null if not favorited.
   */

  const getFavoriteDate = (episodeId) => {
    const favorite = favorites.find(fav => fav.id === episodeId);
    return favorite ? favorite.date : null;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleBackToHome = () => {
    navigate('/'); // Navigate back to the homepage
  };

  /**
   * Renders the component UI based on loading, error, or loaded state.
   */
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading show details: {error.message}</div>;
  }

  return (
    <div className="container mt-4">
      <button className="btn btn-link" onClick={handleBackToHome}>Back to Home</button>
      <h2 className="mb-4">{show.title}</h2>
      <div className="card bg-dark text-light mb-4">
        <div className="card-body">
          <img style={{ width: '300px', height: '450px' }} src={show.image} alt={show.title} />
          <h5 className="card-title mt-3">{show.title}</h5>
          <p className="card-text">{show.description}</p>
          <p className="card-text">Genre: {show.genre}</p>
          <p className="card-text">Updated: {formatDate(show.updated)}</p>
          <h6 className="card-subtitle mb-2">Seasons</h6>
          {show.seasons.map(season => (
            <div key={season.season} className="mb-3 d-flex gap-5 flex-column justify-content-center align-items-start">
              <img style={{ width: "200px", height: "300px" }} src={season.image} alt={`Season ${season.number}`} />
              <button
                className="btn btn-outline-success"
                type="button"
                onClick={() => handleSeasonClick(season.season)}
                aria-expanded={season.season === openSeasonId}
              >
                Season {season.number} ({season.episodes.length} episodes)
              </button>
              {season.season === openSeasonId && (
                <div className="mt-2">
                  {season.episodes.length === 0 ? (
                    <p className="card-text">No episodes available for this season.</p>
                  ) : (
                    <div>
                      {season.episodes.map(episode => (
                        <div key={episode.id} className="card bg-secondary text-light mb-2">
                          <div className="card-body">
                            <h6 className="card-title">{episode.title}</h6>
                            <p className="card-text">{episode.description}</p>
                            <audio controls>
                      <source src={episode.file} type="audio/mp3" /> 
                    </audio>
                            <p className="card-text">Duration: {episode.duration} minutes</p>
                            <button
                              className="btn btn-success"
                              onClick={() => console.log(`Play episode ${episode.id}`)}
                            >
                              Listen Now
                            </button>
                            <button
                              className={`btn ${isEpisodeFavorited(episode.id) ? 'btn-danger' : 'btn-success'}`}
                              onClick={() => handleFavoriteToggle(episode)}
                            >
                              {isEpisodeFavorited(episode.id) ? 'Unfavorite' : 'Favorite'}
                            </button>
                            {isEpisodeFavorited(episode.id) && (
                              <p className="card-text mt-2">
                                Favorited on: {formatDate(getFavoriteDate(episode.id))}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ShowDetails;
