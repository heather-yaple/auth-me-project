import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSpots } from '../../store/spots';
import SpotTile from '../SpotTile/SpotTile';
import './SpotsIndex.css';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const SpotsIndex = () => {
  const dispatch = useDispatch();
  const spots = useSelector((state) => Object.values(state.spots.allSpots));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(getAllSpots())
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  }, [dispatch]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="error-message">Error: {error.message || 'Something went wrong!'}</div>;

  return (
    <div className="spots-index">
      <div className="welcome-message">
        <h1>&quot;Experience the Magic of Maine: Where Cozy Cabins and Nature&apos;s Wonder Embrace You&quot;</h1>
      </div>
      <div className="available-cabins">
        <h2>Available Cabins</h2>
      </div>
      <div className="spots-list">
        {spots.length > 0 ? (
          spots.map((spot) => <SpotTile key={spot.id} spot={spot} />)
        ) : (
          <p>No cabins are currently available. Check back soon!</p>
        )}
      </div>
    </div>
  );
};

export default SpotsIndex;


