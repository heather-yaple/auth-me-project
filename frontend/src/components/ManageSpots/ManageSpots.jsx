// src/components/ManageSpots/ManageSpots.jsx

import  { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUserSpots } from '../../store/spots';
import { Link, useNavigate } from 'react-router-dom';
import { useModal } from '../context/Modal';
import DeleteConfirmationModal from '../DeleteConfirmationModal/DeleteConfirmationModal';
import './ManageSpots.css';

const ManageSpots = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true); // Loading state for spots
  const [error, setError] = useState(null); // Error handling state
  const spotsObj = useSelector((state) => state.spots.userSpots);
  const spots = Object.values(spotsObj);

  const { setModalContent, closeModal } = useModal();

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        await dispatch(getCurrentUserSpots());
      } catch (error) {
        setError('Failed to load your spots.');
      } finally {
        setLoading(false); // Stop loading once the API call is finished
      }
    };
    fetchSpots();
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

  if (loading) {
    return <p>Loading your spots...</p>;
  }

  return (
    <div className="manage-spots">
      <h1>Manage Your Spots</h1>
      <Link to="/spots/new">
        <button className="create-spot-button">Create a New Spot</button>
      </Link>
      {error ? (
        <p>{error}</p>
      ) : spots.length === 0 ? (
        <p>You have no spots yet.</p>
      ) : (
        <div className="spots-list">
          {spots.map((spot) => (
            <div key={spot.id} className="spot-card">
              <Link to={`/spots/${spot.id}`} aria-label={`View details of ${spot.name}`}>
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
                <button
                  onClick={() => handleUpdate(spot.id)}
                  aria-label={`Update ${spot.name}`}
                >
                  Update
                </button>
                <button
                  onClick={() => openDeleteModal(spot.id)}
                  aria-label={`Delete ${spot.name}`}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageSpots;
