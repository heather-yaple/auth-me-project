// src/components/EditSpotForm/EditSpotForm.jsx

// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getSpotDetails, updateSpot } from "../../store/spots";
import "./EditSpotForm.css";

const EditSpotForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Use navigate instead of useHistory
  const { spotId } = useParams();

  const spot = useSelector((state) => state.spots.singleSpot);

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateField, setStateField] = useState(""); // 'state' is a reserved word
  const [country, setCountry] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState([]);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  useEffect(() => {
    dispatch(getSpotDetails(spotId));
  }, [dispatch, spotId]);

  useEffect(() => {
    if (spot && spot.id) {
      setAddress(spot.address || "");
      setCity(spot.city || "");
      setStateField(spot.state || "");
      setCountry(spot.country || "");
      setName(spot.name || "");
      setDescription(spot.description || "");
      setPrice(spot.price || "");
      setLat(spot.lat || "");
      setLng(spot.lng || "");
    }
  }, [spot]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedSpot = {
      address,
      city,
      state: stateField,
      country,
      lat,
      lng,
      name,
      description,
      price,
    };

    try {
      await dispatch(updateSpot(spotId, updatedSpot));
      navigate(`/spots/${spotId}`);
    } catch (err) {
      const errorMessages = err.errors ? Object.values(err.errors) : [];
      setErrors(errorMessages);
    }
  };

  if (!spot || !spot.id) return <div>Loading...</div>;

  return (
    <div className="edit-spot-form">
      <h1>Edit Your Spot</h1>
      {errors.length > 0 && (
        <ul className="errors">
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
      )}
      <form onSubmit={handleSubmit}>
        <label>
          Address
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </label>
        <label>
          City
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </label>
        <label>
          State
          <input
            type="text"
            value={stateField}
            onChange={(e) => setStateField(e.target.value)}
            required
          />
        </label>
        <label>
          Country
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </label>
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={50}
          />
        </label>
        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            maxLength={500}
          />
        </label>
        <label>
          Price per night
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="1"
          />
        </label>
        <label>
  Latitude
  <input
    type="number"
    value={lat}
    onChange={(e) => setLat(e.target.value)}
    required
    min="-90"
    max="90"
    step="any" // Allow any decimal value
  />
</label>
<label>
  Longitude
  <input
    type="number"
    value={lng}
    onChange={(e) => setLng(e.target.value)}
    required
    min="-180"
    max="180"
    step="any" // Allow any decimal value
  />
</label>
        <button type="submit">Update Spot</button>
      </form>
    </div>
  );
};

export default EditSpotForm;