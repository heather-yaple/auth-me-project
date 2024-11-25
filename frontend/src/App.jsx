// import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useModal } from './context/Modal';

import Navigation from './components/Navigation/Navigation';
import SearchBar from './components/Navigation/SearchBar';
import ProfileButton from './components/Navigation/ProfileButton';
import OpenModalMenuItem from './components/Navigation/OpenModalMenuItem';

import LoginFormModal from './components/LoginFormPage/LoginFormModal';
import SignupFormModal from './components/SignupFormPage/SignupFormModal';
import SpotsIndex from './components/SpotsIndex/SpotsIndex';
import SpotDetails from './components/SpotDetails/SpotDetails';
import SpotFormModal from './components/SpotFormModal/SpotFormModal';
import EditSpotFormModal from './components/EditSpotFormModal/EditSpotFormModal';
import DeleteSpotConfirmationModal from './components/DeleteSpotConfirmationModal/DeleteSpotConfirmationModal';
import ManageSpots from './components/ManageSpots/ManageSpots';
import ReviewFormModal from './components/ReviewFormModal/ReviewFormModal';
import EditReviewFormModal from './components/EditReviewFormModal/EditReviewFormModal';
import DeleteReviewConfirmationModal from './components/DeleteReviewConfirmationModal/DeleteReviewConfirmationModal';

import './App.css';
import './index.css';

const App = () => {
  const { setModalContent, setOnModalClose } = useModal();

  return (
    <div>
      <header>
        <h1>Cozy Cabins</h1>
        <Navigation isLoaded={true} />
        <SearchBar />
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/spots" />} />
          <Route path="/spots" element={<SpotsIndex />} />
          <Route path="/spots/:spotId" element={<SpotDetails />} />
          <Route path="/spots/new" element={<SpotFormModal />} />
          <Route path="/spots/:spotId/edit" element={<EditSpotFormModal />} />
          <Route path="/spots/:spotId/delete" element={<DeleteSpotConfirmationModal />} />
          <Route path="/spots/:spotId/manage" element={<ManageSpots />} />
          <Route path="/spots/:spotId/reviews/new" element={<ReviewFormModal />} />
          <Route path="/spots/:spotId/reviews/:reviewId/edit" element={<EditReviewFormModal />} />
          <Route path="/spots/:spotId/reviews/:reviewId/delete" element={<DeleteReviewConfirmationModal />} />
        </Routes>
      </main>

      <footer>
        <OpenModalMenuItem
          itemText="Log In"
          onItemClick={() => setModalContent(<LoginFormModal />)}
          onModalClose={() => setOnModalClose()}
        />
        <OpenModalMenuItem
          itemText="Sign Up"
          onItemClick={() => setModalContent(<SignupFormModal />)}
          onModalClose={() => setOnModalClose()}
        />
        <ProfileButton user={null} />
      </footer>
    </div>
  );
};

export default App;

