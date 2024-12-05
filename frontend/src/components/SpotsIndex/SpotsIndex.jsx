import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSpots } from '../../store/spots';
import SpotTile from '../SpotTile/SpotTile';
import './SpotsIndex.css';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const SpotsIndex = () => {
  const dispatch = useDispatch();
  const spots = useSelector((state) => Object.values(state.spots.allSpots));
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(getAllSpots())
      .then(() => setIsLoaded(true))
      .then(() => setIsLoading(false))
      .catch((error) => setError(error))
      .catch(() => setIsLoading(false));
  }, [dispatch]);

  if (isLoading) {
    return <LoadingSpinner />;
  } else if (error) {
    return <div>Error: {error.message || 'Something went wrong!'}</div>;
  } else if (!isLoaded) {
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

