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
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

