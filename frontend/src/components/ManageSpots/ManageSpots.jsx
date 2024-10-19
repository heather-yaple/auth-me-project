// src/components/ManageSpots/ManageSpots.jsx

// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUserSpots } from '../../store/spots';
import { Link, useNavigate } from 'react-router-dom';
import { useModal } from '../context/Modal';

import DeleteConfirmationModal from '../DeleteConfirmationModal/DeleteConfirmationModal';
import './ManageSpots.css';

const ManageSpots = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const spotsObj = useSelector((state) => state.spots.userSpots);
  const spots = Object.values(spotsObj);

  const { setModalContent, closeModal } = useModal();

  useEffect(() => {
    dispatch(getCurrentUserSpots());
  }, [dispatch]);

  const handleUpdate = (spotId) => {
    navigate(`/spots/${spotId}/edit`);
  };

  const openDeleteModal = (spotId) => {
    setModalContent(
      <DeleteConfirmationModal
        spotId={spotId}
        closeModal={closeModal}
      />
    );
  };

  return (
    <div className="manage-spots">
      <h1>Manage Your Spots</h1>
      <Link to="/spots/new">
        <button className="create-spot-button">Create a New Spot</button>
      </Link>
      {spots.length === 0 ? (
        <p>You have no spots yet.</p>
      ) : (
        <div className="spots-list">
          {spots.map((spot) => (
            <div key={spot.id} className="spot-card">
              <Link to={`/spots/${spot.id}`}>
                <img src={spot.previewImage} alt={spot.name} />
              </Link>
              <div className="spot-info">
                <h3>{spot.name}</h3>
                <p>
                  {spot.city}, {spot.state}
                </p>
                <p>${spot.price} / night</p>
              </div>
              <div className="spot-actions">
                <button onClick={() => handleUpdate(spot.id)}>Update</button>
                <button onClick={() => openDeleteModal(spot.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageSpots;