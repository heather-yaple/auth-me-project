// src/components/SpotsIndex/SpotsIndex.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSpots } from '../../store/spots';
import SpotTile from '../SpotTile/SpotTile';
import './SpotsIndex.css';

const SpotsIndex = () => {
  const dispatch = useDispatch();
  const spots = useSelector((state) => Object.values(state.spots.allSpots));
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    dispatch(getAllSpots())
      .then(() => setIsLoaded(true))
      .catch((err) => setError(err));
  }, [dispatch]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="spots-index">
      <div className="welcome-message">
        <h1>"Experience the Magic of Maine: Where Cozy Cabins and Nature's Wonder Embrace You"</h1>
      </div>
      <div className="spots-list">
        {spots.map((spot) => (
          <SpotTile key={spot.id} spot={spot} />
        ))}
      </div>
    </div>
  );
};

export default SpotsIndex;
