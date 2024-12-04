// src/components/SpotTile/SpotTile.jsx
// eslint-disable-next-line no-unused-vars

import { useNavigate } from 'react-router-dom';
import './SpotTile.css';
// import '@fortawesome/fontawesome-free/css/all.min.css';



const SpotTile = ({ spot }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/spots/${spot.id}`);
  };

  return (
    <div className="spot-tile" onClick={handleClick} title={spot.name}>
      <img
        src={spot.previewImage || 'default-image-url'}
        alt={spot.name}
        className="spot-image"
      />
      <div className="spot-info">
        <div className="spot-location">
          {spot.city}, {spot.state}
        </div>
        <div className="spot-rating">
  <i className="fas fa-star"></i>{' '}
  {spot.avgRating ? Number(spot.avgRating).toFixed(1) : 'New'}
</div>

      </div>
      <div className="spot-price">${spot.price} night</div>
    </div>
  );
};

export default SpotTile;