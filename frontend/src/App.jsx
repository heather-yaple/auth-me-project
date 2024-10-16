// eslint-disable-next-line no-unused-vars
import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import LoginFormPage from './components/LoginFormPage/LoginFormPage';
import SignupFormPage from './components/SignupFormPage/SignupFormPage';
import * as sessionActions from './store/session';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser())
      .then(() => {
        setIsLoaded(true);
      })
      .catch((error) => {
        console.error("Error restoring user session:", error);
        setIsLoaded(true); // Still load the app even if there's an error
      });
  }, [dispatch]);

  return (
    <>
      {!isLoaded ? <h1>Loading...</h1> : <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <h1>Welcome!</h1>
      },
      {
        path: '/login',
        element: <LoginFormPage />
      },
      {
        path: '/signup',
        element: <SignupFormPage />
      },
      {
        path: '/logout',
        element: <h1>Logout</h1>
      },  
      {
        path: '/spots',
        element: <h1>SpotsIndex</h1>
      },
      {
        path: '/spots/:spotId', 
        element: <h1>SpotShow</h1>
      },
      {
        path: '/bookings',
        element: <h1>Bookings</h1>
      },
      {
        path: '/reviews',
        element: <h1>Reviews</h1>
      },
      {
        path: '/users',
        element: <h1>Users</h1>
      },    
      {
        path: '/users/:userId',
        element: <h1>UserShow</h1>
      },
      {
        path: '/reviews/:reviewId',
        element: <h1>ReviewShow</h1>
      },
      {
        path: '/bookings/:bookingId',
        element: <h1>BookingShow</h1>
      },
      {
        path: '/spots/:spotId/bookings',
        element: <h1>SpotBookings</h1>
      },
      {
        path: '/spots/:spotId/reviews',
        element: <h1>SpotReviews</h1>
      },
      {
        path: '/users/:userId/bookings',
        element: <h1>UserBookings</h1>
      },
      {
        path: '/users/:userId/reviews',
        element: <h1>UserReviews</h1>
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

