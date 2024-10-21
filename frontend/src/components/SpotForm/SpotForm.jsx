// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createSpot } from '../../store/spots';
import './SpotForm.css';

const SpotForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionUser = useSelector((state) => state.session.user);

  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [imageUrls, setImageUrls] = useState(['', '', '', '']);
  const [submitted, setSubmitted] = useState(false);

  if (!sessionUser) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    const validationErrors = [];

    // Validation for required fields
    if (!country) validationErrors.push('Country is required');
    if (!address) validationErrors.push('Address is required');
    if (!city) validationErrors.push('City is required');
    if (!stateName) validationErrors.push('State is required');
    if (!description || description.length < 30)
      validationErrors.push('Description needs 30 or more characters');
    if (!name) validationErrors.push('Name is required');
    if (!price || isNaN(price)) validationErrors.push('Price per night is required');
    if (!previewImage || !isValidUrl(previewImage))
      validationErrors.push('Preview Image is required');
    if (!lat) validationErrors.push('Latitude is required');
    if (!lng) validationErrors.push('Longitude is required');

    // Image URL validation
    imageUrls.forEach((url, index) => {
      if (url && !isValidUrl(url)) {
        validationErrors.push(`Image URL ${index + 1} needs to end in png or jpg (or jpeg)`);
      }
    });

    if (validationErrors.length > 0) {
      return;
    }

    const spotData = {
      country,
      address,
      city,
      state: stateName,
      lat: parseFloat(lat) || 0,
      lng: parseFloat(lng) || 0,
      description,
      name,
      price: parseFloat(price),
    };

    const imageUrlsArray = [previewImage, ...imageUrls.filter((url) => url)];

    try {
      const newSpot = await dispatch(createSpot(spotData, imageUrlsArray));
      navigate(`/spots/${newSpot.id}`);
    } catch (res) {
      const data = await res.json();
      // eslint-disable-next-line no-undef
      if (data && data.errors) setErrors(Object.values(data.errors));
    }
  };

  const isValidUrl = (url) => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.pathname.match(/.(png|jpg|jpeg)$/);
    } catch (err) {
      return false;
    }
  };

  return (
    <div className="spot-form-container">
      <h1>Create a New Spot</h1>
      <form onSubmit={handleSubmit}>
        {/* Country */}
        <div className="inline-field">
          <label>Country</label>
          <input
            type="text"
            placeholder="Enter your country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          {submitted && !country && <span className="error-inline">Country is required</span>}
        </div>

        {/* Street Address */}
        <div className="inline-field">
          <label>Street Address</label>
          <input
            type="text"
            placeholder="Enter street address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          {submitted && !address && <span className="error-inline">Address is required</span>}
        </div>

        {/* City and State */}
        <div className="inline-fields">
          <div className="field">
            <label>City</label>
            <input
              type="text"
              placeholder="Enter city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            {submitted && !city && <span className="error-inline">City is required</span>}
          </div>

          <div className="field">
            <label>State</label>
            <input
              type="text"
              placeholder="Enter state"
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
            />
            {submitted && !stateName && <span className="error-inline">State is required</span>}
          </div>
        </div>

        {/* Latitude and Longitude */}
        <div className="inline-fields">
          <div className="field">
            <label>Latitude</label>
            <input
              type="text"
              placeholder="Enter latitude"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
            />
            {submitted && !lat && <span className="error-inline">Latitude is required</span>}
          </div>

          <div className="field">
            <label>Longitude</label>
            <input
              type="text"
              placeholder="Enter longitude"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
            />
            {submitted && !lng && <span className="error-inline">Longitude is required</span>}
          </div>
        </div>

        {/* Description */}
        <label>
          Description
          <textarea
            placeholder="Describe your spot (at least 30 characters)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          {submitted && description.length < 30 && (
            <span className="error">Description needs 30 or more characters</span>
          )}
        </label>

        {/* Name */}
        <label>
          Name of your spot
          <input
            type="text"
            placeholder="Enter a name for your spot"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {submitted && !name && <span className="error">Name is required</span>}
        </label>

        {/* Price */}
        <label>
          Price per night (USD)
          <input
            type="text"
            placeholder="Set a price per night"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          {submitted && !price && <span className="error">Price per night is required</span>}
        </label>

        {/* Preview Image URL */}
        <label>
          Preview Image URL
          <input
            type="text"
            placeholder="Preview Image is required"
            value={previewImage}
            onChange={(e) => setPreviewImage(e.target.value)}
          />
          {submitted && !previewImage && <span className="error">Preview image is required</span>}
          {submitted && previewImage && !isValidUrl(previewImage) && (
            <span className="error">Image URL must end in .png, .jpg, or .jpeg</span>
          )}
        </label>

        {/* Additional Image URLs */}
        <label>
          Additional Image URLs
          {imageUrls.map((url, index) => (
            <input
              key={index}
              type="text"
              placeholder="Image URL"
              value={url}
              onChange={(e) => {
                const newImageUrls = [...imageUrls];
                newImageUrls[index] = e.target.value;
                setImageUrls(newImageUrls);
              }}
            />
          ))}
          {submitted && !isValidUrl(imageUrls[0]) && (
            <span className="error">Image URL must end in .png, .jpg, or .jpeg</span>
          )}
        </label>

        <button type="submit">Create Spot</button>
      </form>
    </div>
  );
};

export default SpotForm;