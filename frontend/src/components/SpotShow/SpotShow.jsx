// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchSpot, deleteSpot } from '../store/spots.js'; // Import necessary actions
import ReviewsList from './ReviewsList';
import ReviewForm from './ReviewForm';
import './styles/SpotShow.css';
const SpotShow = () => {
  const { id } = useParams();  // 'id' parameter from the URL
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [spotData, setSpotData] = useState(null);
  const [errors, setErrors] = useState(null); // Separate error state

  // Fetch the spot details on component load
  useEffect(() => {
    dispatch(fetchSpot(id)).then(setSpotData).catch(err => setErrors(err.message));
  }, [dispatch, id]);

  // If the spot data isn't available yet, show a loading message
  if (!spotData) return <div>Loading...</div>;

  const { name, description, previewImage } = spotData;

  // Handle deleting the spot
  const handleDelete = async () => {
    try {
      await dispatch(deleteSpot(id));
      navigate('/');  // Navigate to home after deletion
    } catch (error) {
      const errData = await error.json();  // Assuming error has JSON response
      setErrors(errData.errors || ['Failed to delete the spot.']);  // Set error message
    }
  };

  return (
    <div>
      <h1>{name}</h1>
      <img src={previewImage} alt={name} />
      <p>{description}</p>
      {errors && <div style={{ color: 'red' }}>{errors[0]}</div>} {/* Show error if any */}
      <button onClick={handleDelete}>Delete Spot</button>
      <ReviewsList spotId={id} />
      <ReviewForm spotId={id} />
    </div>
  );
};

export default SpotShow;


