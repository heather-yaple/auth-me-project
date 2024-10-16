// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import * as sessionActions from './store/session';
import { fetchSpots } from './store/spots';
import { fetchReviews } from './store/reviews';
import LoginFormPage from './components/LoginFormPage/LoginFormPage';
import SignupFormPage from './components/SignupFormPage/SignupFormPage';
import Navigation from './components/Navigation/Navigation';
import SpotsIndexPage from './components/SpotsIndex/SpotsIndex';
import SpotShowPage from './components/SpotShow/SpotShow';
import ReviewsListPage from './components/ReviewsList/ReviewsList';
import './styles/styles.css';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await dispatch(sessionActions.restoreUser());
        await dispatch(fetchSpots());
        await dispatch(fetchReviews());
      } catch (error) {
        console.error("Error restoring user session:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    initializeApp();
  }, [dispatch]);

  return (
    <>
      <Navigation />
      {!isLoaded ? <h1>Loading...</h1> : <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <h1>Welcome!</h1> },
      { path: '/login', element: <LoginFormPage /> },
      { path: '/signup', element: <SignupFormPage /> },
      { path: '/spots', element: <SpotsIndexPage /> },
      { path: '/spots/:spotId', element: <SpotShowPage /> },
      { path: '/reviews', element: <ReviewsListPage /> },
      { path: '/logout', element: <h1>Logout</h1> },
      // Add additional routes here as needed
      { path: '*', element: <h1>404 Not Found</h1> }, // Catch-all for 404
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

