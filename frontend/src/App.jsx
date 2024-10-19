// frontend/src/App.jsx
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from 'react-router-dom';
import Navigation from "./components/Navigation/Navigation";
import * as sessionActions from "./store/session";
import SpotsIndex from './components/SpotsIndex/SpotsIndex';
import { Modal } from './components/context/Modal';
import './App.css'; 
import SpotDetails from './components/SpotDetails/SpotDetails';
import SpotForm from './components/SpotForm/SpotForm';
import EditSpotForm from './components/EditSpotForm/EditSpotForm';
import ManageSpots from './components/ManageSpots/ManageSpots';



function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Routes>
          <Route path="/" element={<SpotsIndex />} />
          <Route path="/spots/:spotId" element={<SpotDetails />} />
          <Route path="/spots/new" element={<SpotForm />} />
          <Route path="/spots/current" element={<ManageSpots />} /> 
          <Route path="/spots/:spotId/edit" element={<EditSpotForm />} />

        </Routes>
      )}
      <Modal /> 
    </>
  );
}

export default App;

