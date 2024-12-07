// src/components/Managecabins/Managecabins.jsx

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUsercabins } from '../../store/cabins';
import { Link, useNavigate } from 'react-router-dom';
import { useModal } from '../context/Modal';

import DeleteConfirmationModal from '../DeleteConfirmationModal/DeleteConfirmationModal';
import './Managecabins.css';

const Managecabins = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cabinsObj = useSelector((state) => state.cabins.usercabins);
  const cabins = Object.values(cabinsObj);

  const { setModalContent, closeModal } = useModal();

  useEffect(() => {
    dispatch(getCurrentUsercabins());
  }, [dispatch]);

  const handleUpdate = (cabinId) => {
    navigate(`/cabins/${cabinId}/edit`);
  };

  const openDeleteModal = (cabinId) => {
    setModalContent(
      <DeleteConfirmationModal
        cabinId={cabinId}
        closeModal={closeModal}
      />
    );
  };

  return (
    <div className="manage-cabins">
      <h1>Manage Your cabins</h1>
      <Link to="/cabins/new">
        <button className="create-cabin-button">Create a New cabin</button>
      </Link>
      {cabins.length === 0 ? (
        <p>You have no cabins yet.</p>
      ) : (
        <div className="cabins-list">
          {cabins.map((cabin) => (
            <div key={cabin.id} className="cabin-card">
              <Link to={`/cabins/${cabin.id}`}>
                <img src={cabin.previewImage} alt={cabin.name} />
              </Link>
              <div className="cabin-info">
                <h3>{cabin.name}</h3>
                <p>
                  {cabin.city}, {cabin.state}
                </p>
                <p>${cabin.price} / night</p>
              </div>
              <div className="cabin-actions">
                <button onClick={() => handleUpdate(cabin.id)}>Update</button>
                <button onClick={() => openDeleteModal(cabin.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Managecabins;
