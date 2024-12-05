import { useState } from 'react';
import './SpotTile.css';

const SpotTile = ({ spot }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Handle the image click (cycle through the images)
  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
  };

  return (
    <div className="spot-tile">
      <h2>{spot.name}</h2>
      <div className="spot-images">
        {/* Render up to 5 images */}
        {spot.images.slice(0, 5).map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Spot ${spot.name} Image ${index + 1}`}
            onClick={() => handleImageClick(index)}
            className={`spot-image ${selectedImageIndex === index ? 'selected' : ''}`}
          />
        ))}
      </div>
      <div className="selected-image-container">
        {/* Display the selected image */}
        <img
          src={spot.images[selectedImageIndex]}
          alt={`Selected ${spot.name}`}
          className="selected-image"
        />
      </div>
      <div className="spot-rating">
        <span>⭐ {spot.rating} / 5</span>
      </div>
      <button className="reserve-button">Reserve Now</button>
    </div>
  );
};

export default SpotTile;
