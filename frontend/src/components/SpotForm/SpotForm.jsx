// SpotForm.jsx
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createSpot, updateSpot } from '../../store/spots'; // Spot actions
import './styles/SpotForm.css';
const SpotForm = ({ spot }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState(spot?.name || '');
  const [description, setDescription] = useState(spot?.description || '');
  const [previewImage, setPreviewImage] = useState(spot?.previewImage || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    const spotData = { name, description, previewImage };
    if (spot) {
      dispatch(updateSpot(spot.id, spotData));
    } else {
      dispatch(createSpot(spotData));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
      <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
      <input value={previewImage} onChange={(e) => setPreviewImage(e.target.value)} placeholder="Image URL" required />
      <button type="submit">{spot ? 'Update Spot' : 'Create Spot'}</button>
    </form>
  );
};

export default SpotForm;
