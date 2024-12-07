import { useState } from 'react';
import './cabinTile.css';

const cabinTile = ({ cabin }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Handle the image click (cycle through the images)
  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
  };

  return (
    <div className="cabin-tile">
      <h2>{cabin.name}</h2>
      <div className="cabin-images">
        {/* Render up to 5 images */}
        {cabin.images.slice(0, 5).map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`cabin ${cabin.name} Image ${index + 1}`}
            onClick={() => handleImageClick(index)}
            className={`cabin-image ${selectedImageIndex === index ? 'selected' : ''}`}
          />
        ))}
      </div>
      <div className="selected-image-container">
        {/* Display the selected image */}
        <img
          src={cabin.images[selectedImageIndex]}
          alt={`Selected ${cabin.name}`}
          className="selected-image"
        />
      </div>
      <div className="cabin-rating">
        <span>⭐ {cabin.rating} / 5</span>
      </div>
      <button className="reserve-button">Reserve Now</button>
    </div>
  );
};

export default cabinTile;
