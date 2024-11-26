import  { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createSpot } from '../store/spotActions';
import { useNavigate } from 'react-router-dom';

const SpotForm = () => {
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
  const [errors, setErrors] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isValidUrl = (url) => {
    const regex = /^(ftp|http|https):\/\/[^ "]+$/;
    return regex.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    const validationErrors = [];

    // Basic validation checks
    if (!name) validationErrors.push('Spot name is required');
    if (!description) validationErrors.push('Description is required');
    if (!price || isNaN(price) || price <= 0) validationErrors.push('Price must be a valid number greater than 0');
    if (!lat || isNaN(lat)) validationErrors.push('Latitude must be a valid number');
    if (!lng || isNaN(lng)) validationErrors.push('Longitude must be a valid number');
    if (!address) validationErrors.push('Address is required');
    if (!city) validationErrors.push('City is required');
    if (!stateName) validationErrors.push('State is required');
    if (!previewImage || !isValidUrl(previewImage)) validationErrors.push('Preview image URL must be valid');

    if (imageUrls.length > 0) {
      imageUrls.forEach((url, index) => {
        if (url && !isValidUrl(url)) {
          validationErrors.push(`Image URL ${index + 1} is not valid`);
        }
      });
    }

    if (validationErrors.length === 0) {
      const spotData = {
        country,
        address,
        city,
        state: stateName,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        description,
        name,
        price: parseFloat(price),
      };

      const imageUrlsArray = [previewImage, ...imageUrls.filter((url) => url)];

      try {
        const newSpot = await dispatch(createSpot(spotData, imageUrlsArray));
        navigate(`/spots/${newSpot.id}`);
        
        // Reset form
        setCountry('');
        setAddress('');
        setCity('');
        setStateName('');
        setLat('');
        setLng('');
        setDescription('');
        setName('');
        setPrice('');
        setPreviewImage('');
        setImageUrls(['', '', '', '']);
        setSubmitted(false);
      } catch (res) {
        const data = await res.json();
        if (data && data.errors) setErrors(Object.values(data.errors));
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {errors.length > 0 && (
        <div className="error-summary">
          <ul>
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-describedby="nameError"
        />
        {submitted && !name && <span id="nameError" className="error">Name is required</span>}
      </div>

      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          aria-describedby="descriptionError"
        />
        {submitted && !description && <span id="descriptionError" className="error">Description is required</span>}
      </div>

      <div>
        <label htmlFor="price">Price:</label>
        <input
          type="text"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          aria-describedby="priceError"
        />
        {submitted && !price && <span id="priceError" className="error">Price is required</span>}
        {submitted && (isNaN(price) || price <= 0) && <span id="priceError" className="error">Price must be a valid number greater than 0</span>}
      </div>

      <div>
        <label htmlFor="previewImage">Preview Image:</label>
        <input
          type="text"
          id="previewImage"
          value={previewImage}
          onChange={(e) => setPreviewImage(e.target.value)}
          aria-describedby="previewImageError"
        />
        {submitted && (!previewImage || !isValidUrl(previewImage)) && (
          <span id="previewImageError" className="error">Preview image URL must be valid</span>
        )}
      </div>

      {imageUrls.map((url, index) => (
        <div key={index}>
          <label htmlFor={`imageUrl${index}`}>Image URL {index + 1}:</label>
          <input
            type="text"
            id={`imageUrl${index}`}
            value={url}
            onChange={(e) => {
              const updatedUrls = [...imageUrls];
              updatedUrls[index] = e.target.value;
              setImageUrls(updatedUrls);
            }}
            aria-describedby={`imageUrl${index}Error`}
          />
          {submitted && url && !isValidUrl(url) && (
            <span id={`imageUrl${index}Error`} className="error">Image URL {index + 1} is not valid</span>
          )}
        </div>
      ))}

      <div>
        <label htmlFor="lat">Latitude:</label>
        <input
          type="text"
          id="lat"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          aria-describedby="latError"
        />
        {submitted && (!lat || isNaN(lat)) && <span id="latError" className="error">Latitude must be a valid number</span>}
      </div>

      <div>
        <label htmlFor="lng">Longitude:</label>
        <input
          type="text"
          id="lng"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          aria-describedby="lngError"
        />
        {submitted && (!lng || isNaN(lng)) && <span id="lngError" className="error">Longitude must be a valid number</span>}
      </div>

      <div>
        <label htmlFor="country">Country:</label>
        <input
          type="text"
          id="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="address">Address:</label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="city">City:</label>
        <input
          type="text"
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="stateName">State:</label>
        <input
          type="text"
          id="stateName"
          value={stateName}
          onChange={(e) => setStateName(e.target.value)}
        />
      </div>

      <button type="submit">Create Spot</button>
    </form>
  );
};

export default SpotForm;
