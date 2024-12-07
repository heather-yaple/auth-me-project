import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllcabins } from '../../store/cabins';
import cabinTile from '../cabinTile/cabinTile';
import './cabinsIndex.css';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const cabinsIndex = () => {
  const dispatch = useDispatch();
  const cabins = useSelector((state) => Object.values(state.cabins.allcabins));
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(getAllcabins())
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
    <div className="cabins-index">
      <div className="welcome-message">
        <h1>&quot;Experience the Magic of Maine: Where Cozy Cabins and Nature&apos;s Wonder Embrace You&quot;</h1>
      </div>
      <div className="cabins-list">
        {cabins.map((cabin) => (
          <cabinTile key={cabin.id} cabin={cabin} />
        ))}
      </div>
    </div>
  );
};

export default cabinsIndex;

