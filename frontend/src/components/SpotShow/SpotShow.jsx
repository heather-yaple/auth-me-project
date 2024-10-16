// SpotShow.jsx
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchSpot, deleteSpot } from '../store/spots'; // Import necessary actions

const SpotShow = () => {
  const { spotId } = useParams(); // Get spotId from the URL
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Use navigate to redirect after deleting the spot
  const [spot, setSpot] = useState(null);

  useEffect(() => {
    // Fetch the spot details when the component mounts
    dispatch(fetchSpot(spotId)).then(setSpot);
  }, [dispatch, spotId]);

  if (!spot) return <div>Loading...</div>;

  const handleDelete = () => {
    dispatch(deleteSpot(spot.id)).then(() => {
      navigate('/'); // Redirect to the homepage after deletion
    });
  };

  return (
    <div>
      <h1>{spot.name}</h1>
      <img src={spot.previewImage} alt={spot.name} />
      <p>{spot.description}</p>
      <button onClick={handleDelete}>Delete Spot</button>
    </div>
  );
};

export default SpotShow;

