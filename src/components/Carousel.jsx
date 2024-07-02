import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "bootstrap/dist/css/bootstrap.min.css";

/**
 * PodcastCarousel component displays a carousel of podcasts.
 * It fetches the podcast data from the API and displays them in a carousel.
 * It also handles loading and error states.
 */
const PodcastCarousel = () => {
  // State variables
  const [podcasts, setPodcasts] = useState([]); // Stores the podcast data
  const [loading, setLoading] = useState(true); // Indicates if data is being loaded
  const [error, setError] = useState(null); // Stores any error that occurs during data fetching

  /**
   * Fetches the podcast data from the API and updates the state variables.
   */
  useEffect(() => {
    fetch("https://podcast-api.netlify.app/shows")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setPodcasts(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  /**
   * Renders the loading or error message if needed.
   */
  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10">Error: {error.message}</div>;

  /**
   * Sets the settings for the carousel.
   */
  const settings = {
    dots: false, // Remove the dotted navigation bar
    infinite: true,
    speed: 500,
    slidesToShow: 5, // Show multiple podcasts at a time
    slidesToScroll: 1,
    autoplay: true, // Enable autoplay
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  /**
   * Renders the carousel of podcasts.
   */
  return (
    <div className="w-100 h-100 bg-white text-white py-5">
      <div className="container">
        <Slider {...settings}>
          {/* Map over the podcasts array and render a carousel item for each podcast */}
          {podcasts.map((podcast) => (
            <div key={podcast.id} className="p-2">
              <div className="card bg-secondary text-white border-0 shadow">
                <div className="card-img-top">
                  <img
                    src={podcast.image}
                    alt={podcast?.title}
                    className="img-fluid rounded-top"
                  />
                </div>
                <div className="card-body">
                  <h5 className="card-title">{podcast.title}</h5>
                  <p className="card-text text-muted">{podcast.genre}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default PodcastCarousel;
