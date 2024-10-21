// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSpots } from '../../store/spots';
import SpotTile from '../SpotTile/SpotTile';
import './SpotsIndex.css';

const SpotsIndex = () => {
  const dispatch = useDispatch();
  const spots = useSelector((state) => Object.values(state.spots.allSpots));
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(getAllSpots())
      .then(() => setIsLoaded(true))
      .catch((err) => setError(err));
  }, [dispatch]);

  if (error) {
    return <div>Error: {error.message || 'Something went wrong!'}</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="spots-index">
      <div className="welcome-message">
        <h1>&quot;Experience the Magic of Maine: Where Cozy Cabins and Nature&apos;s Wonder Embrace You&quot;</h1>
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
