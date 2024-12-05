import { useEffect } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { restoreUser, logout } from './store/session';
import { useModal } from './components/context/Modal.jsx';
import Navigation from './components/Navigation/Navigation';
import SearchBar from './components/Navigation/SearchBar';
import ProfileButton from './components/Navigation/ProfileButton';
import OpenModalMenuItem from './components/Navigation/OpenModalMenuItem';
import LoginFormModal from './components/LoginFormPage/LoginFormModal';
import SignupFormModal from './components/SignupFormPage/SignupFormModal';
import SpotsIndex from './components/SpotsIndex/SpotsIndex';
import SpotDetails from './components/SpotDetails/SpotDetails';
import SpotFormModal from './components/SpotForm/SpotForm.jsx';
import EditSpotFormModal from './components/EditSpotForm/EditSpotForm';
import DeleteSpotConfirmationModal from './components/DeleteConfirmationModal/DeleteConfirmationModal';
import ManageSpots from './components/ManageSpots/ManageSpots';
import ReviewFormModal from './components/ReviewFormModal/ReviewFormModal';
import DeleteReviewConfirmationModal from './components/DeleteReviewConfirmationModal/DeleteReviewConfirmationModal';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';

import { CSSTransition, TransitionGroup } from 'react-transition-group';

import './App.css';
import './index.css';

const App = () => {
  const { setModalContent, setOnModalClose } = useModal();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const isAuthenticated = !!user;
  const loading = useSelector((state) => state.session.loading);
  const location = useLocation();

  // Restore user on app load
  useEffect(() => {
    dispatch(restoreUser());
  }, [dispatch]);

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div>
      <header>
        <h1>Cozy Cabins</h1>
        <Navigation isLoaded={!loading} />
        <SearchBar />
      </header>

      <main>
        <TransitionGroup>
          <CSSTransition
            key={location.pathname}
            timeout={300}
            classNames="fade"
          >
            <Routes>
              <Route path="/" element={<Navigate to="/spots" />} />
              <Route path="/spots" element={<SpotsIndex />} />
              <Route path="/spots/:spotId" element={<SpotDetails />} />
              <Route path="/spots/new" element={<SpotFormModal />} />
              <Route path="/spots/:spotId/edit" element={<EditSpotFormModal />} />
              <Route path="/spots/:spotId/delete" element={<DeleteSpotConfirmationModal />} />
              <Route path="/spots/:spotId/manage" element={<ManageSpots />} />
              <Route path="/spots/:spotId/reviews/new" element={<ReviewFormModal />} />
              <Route path="/spots/:spotId/reviews/:reviewId/delete" element={<DeleteReviewConfirmationModal />} />
            </Routes>
          </CSSTransition>
        </TransitionGroup>

        {loading && <LoadingSpinner />}
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
        {isAuthenticated && (
          <button onClick={handleLogout}>Log Out</button>
        )}
        <ProfileButton user={user} />
      </footer>
    </div>
  );
};

export default App;




