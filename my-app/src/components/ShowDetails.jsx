import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function ShowDetails() {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSeasonId, setOpenSeasonId] = useState(null); 

  useEffect(() => {
    fetch(`https://podcast-api.netlify.app/id/${id}`)
      .then(response => response.json())
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading show details.</div>;
  }

  
  const handleSeasonClick = (seasonId) => {
    setOpenSeasonId(seasonId === openSeasonId ? null : seasonId); 
  };

  const totalSeasons = show.seasons.length;


  const handlePlayEpisode = (episodeId) => {
    console.log(`Play episode ${episodeId}`);
    
  };


  const ChangeDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">{show.title}</h2>
      <div className="card bg-dark text-light mb-4">
        <div className="card-body">
          <img style={{ width: '300px', height: '450px' }} src={show.image} alt={show.title} />
          <h5 className="card-title mt-3">{show.title}</h5>
          <p className="card-text">{show.description}</p>
          <p className="card-text">Updated: {ChangeDate(show.updated)}</p>
          <p className="card-text">Total Seasons: {totalSeasons}</p>
          <h6 className="card-subtitle mb-2">Seasons</h6>
          {show.seasons.map(season => (
            <div key={season.season} className="mb-3 d-flex gap-5 flex-column justify-content-center align-items-start">
              <img style={{width:"200px", height:"300px" }} src={season.image}/>
              <button
                className="btn btn-outline-success "
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
                            <p className="card-text">Duration: {episode.duration} minutes</p>
                            <button
                              className="btn btn-success"
                              onClick={() => handlePlayEpisode(episode.id)}
                            >
                              Listen Now
                            </button>
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
