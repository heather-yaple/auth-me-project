import { useEffect } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, logout } from './store/auth';
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
// import EditReviewFormModal from './components/EditReviewFormModal/EditReviewFormModal';
import DeleteReviewConfirmationModal from './components/DeleteReviewConfirmationModal/DeleteReviewConfirmationModal';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';

import { CSSTransition, TransitionGroup } from 'react-transition-group';

import './App.css';
import './index.css';

const App = () => {
  const { setModalContent, setOnModalClose } = useModal();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

  // Check authentication status on app load
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      dispatch(setUser(JSON.parse(userData)));
    }
  }, [dispatch]);

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('user');
  };

  return (
    <div>
      <header>
        <h1>Cozy Cabins</h1>
        <Navigation isLoaded={true} />
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
              {/* <Route path="/spots/:spotId/reviews/:reviewId/edit" element={<EditReviewFormModal />} /> */}
              <Route path="/spots/:spotId/reviews/:reviewId/delete" element={<DeleteReviewConfirmationModal />} />
            </Routes>
          </CSSTransition>
        </TransitionGroup>

        {/* Spinner for loading state */}
        {!isAuthenticated && <LoadingSpinner />}
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



