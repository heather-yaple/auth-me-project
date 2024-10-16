// SpotsIndex.jsx
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSpots } from '../store/spots'; // Action to fetch spots

const SpotsIndex = () => {
  const dispatch = useDispatch();
  const spots = useSelector(state => state.spots);
  
  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch]);

  return (
    <div>
      <h1>Spots</h1>
      <div className="spots-list">
        {spots.map(spot => (
          <div key={spot.id}>
            <h2>{spot.name}</h2>
            <img src={spot.previewImage} alt={spot.name} />
            <p>{spot.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpotsIndex;
