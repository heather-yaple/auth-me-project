import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getcabinDetails, updatecabin } from "../../store/cabins";
import "./EditcabinForm.css";

const EditcabinForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cabinId } = useParams();

  const cabin = useSelector((state) => state.cabins.singlecabin);

  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const [imageUrls, setImageUrls] = useState(["", "", "", ""]);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    dispatch(getcabinDetails(cabinId));
  }, [dispatch, cabinId]);

  useEffect(() => {
    if (cabin && cabin.id) {
      setCountry(cabin.country || "");
      setAddress(cabin.address || "");
      setCity(cabin.city || "");
      setStateName(cabin.state || "");
      setLat(cabin.lat || "");
      setLng(cabin.lng || "");
      setDescription(cabin.description || "");
      setName(cabin.name || "");
      setPrice(cabin.price || "");
      setPreviewImageUrl(cabin.cabinImages && cabin.cabinImages[0] ? cabin.cabinImages[0].url : "");
      const restImages = cabin.cabinImages ? cabin.cabinImages.slice(1, 5).map(img => img.url) : [];
      setImageUrls([...restImages, ...Array(4 - restImages.length).fill("")]);
    }
  }, [cabin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setErrors([]);

    const validationErrors = [];

    if (!country) validationErrors.push("Country is required");
    if (!address) validationErrors.push("Address is required");
    if (!city) validationErrors.push("City is required");
    if (!stateName) validationErrors.push("State is required");
    if (!description || description.length < 30)
      validationErrors.push("Description needs 30 or more characters");
    if (!name) validationErrors.push("Name is required");
    if (!price || isNaN(price))
      validationErrors.push("Price per night is required");
    if (!previewImageUrl || !isValidUrl(previewImageUrl))
      validationErrors.push("Preview Image is required");
    if (!lat) validationErrors.push("Latitude is required");
    if (!lng) validationErrors.push("Longitude is required");

    imageUrls.forEach((url, index) => {
      if (url && !isValidUrl(url)) {
        validationErrors.push(
          `Image URL ${index + 1} needs to end in png or jpg (or jpeg)`
        );
      }
    });

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const cabinData = {
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

    const imageUrlsArray = [previewImageUrl, ...imageUrls.filter((url) => url)];

    try {
      await dispatch(updatecabin(cabinId, cabinData, imageUrlsArray));
      navigate(`/cabins/${cabinId}`);
    } catch (res) {
      if (!res.ok) {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(Object.values(data.errors));
        } else {
          setErrors(['An unknown error occurred. Please try again later.']);
        }
      } else {
        setErrors(['Failed to update cabin.']);
      }
    }
  };

  const isValidUrl = (url) => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.pathname.match(/\.(png|jpg|jpeg)$/);
    } catch (err) {
      return false;
    }
  };

  if (!cabin || !cabin.id) return <div>Loading...</div>;

  return (
    <div className="cabin-form-container">
      <h1>Update your cabin</h1>
      <form onSubmit={handleSubmit}>
        <section className="location-section">
          <h2>Where is your place located?</h2>
          <p>
            Guests will only get your exact address once they book a
            reservation.
          </p>

          <div className="form-group">
            <div className="label-group">
              <label htmlFor="country">Country</label>
              {submitted && !country && (
                <span className="error-inline">Country is required</span>
              )}
            </div>
            <input
              id="country"
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Country"
            />
          </div>

          <div className="form-group">
            <div className="label-group">
              <label htmlFor="address">Street Address</label>
              {submitted && !address && (
                <span className="error-inline">Address is required</span>
              )}
            </div>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
            />
          </div>

          <div className="form-group inline-fields">
            <div className="field">
              <div className="label-group">
                <label htmlFor="city">City</label>
                {submitted && !city && (
                  <span className="error-inline">City is required</span>
                )}
              </div>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
              />
            </div>
            <div className="field">
              <div className="label-group">
                <label htmlFor="state">State</label>
                {submitted && !stateName && (
                  <span className="error-inline">State is required</span>
                )}
              </div>
              <input
                id="state"
                type="text"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                placeholder="State"
              />
            </div>
          </div>

          <div className="form-group inline-fields">
            <div className="field">
              <div className="label-group">
                <label htmlFor="latitude">Latitude</label>
                {submitted && !lat && (
                  <span className="error-inline">Latitude is required</span>
                )}
              </div>
              <input
                id="latitude"
                type="text"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                placeholder="Latitude"
              />
            </div>
            <div className="field">
              <div className="label-group">
                <label htmlFor="longitude">Longitude</label>
                {submitted && !lng && (
                  <span className="error-inline">Longitude is required</span>
                )}
              </div>
              <input
                id="longitude"
                type="text"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                placeholder="Longitude"
              />
            </div>
          </div>
        </section>

        <hr className="divider" />

        <section className="description-section">
          <h2>Describe your place to guests</h2>
          <p>
            Mention the best features of your space, any special amenities like
            fast wifi or parking, and what you love about the neighborhood.
          </p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please write at least 30 characters"
          ></textarea>
          {submitted && description.length < 30 && (
            <span className="error">
              Description needs a minimum of 30 characters
            </span>
          )}
        </section>

        <hr className="divider" />

        <section className="title-section">
          <h2>Create a title for your cabin</h2>
          <p>
            Catch guests attention with a cabin title that highlights what makes
            your place special.
          </p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name of your cabin"
          />
          {submitted && !name && (
            <span className="error">Name is required</span>
          )}
        </section>

        <hr className="divider" />

        <section className="price-section">
          <h2>Set your price</h2>
          <p>
            You can change the price later, so don’t worry too much about it for
            now.
          </p>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price per night (in USD)"
          />
          {submitted && !price && (
            <span className="error">Price is required</span>
          )}
        </section>

        <hr className="divider" />

        <section className="image-section">
          <h2>Preview Image</h2>
          <input
            type="text"
            value={previewImageUrl}
            onChange={(e) => setPreviewImageUrl(e.target.value)}
            placeholder="Preview Image URL"
          />
          {submitted && !previewImageUrl && (
            <span className="error">Preview Image URL is required</span>
          )}
        </section>

        <hr className="divider" />

        <section className="extra-images-section">
          <h2>Extra Images (Optional)</h2>
          <input
            type="text"
            value={imageUrls[0]}
            onChange={(e) => {
              const newImageUrls = [...imageUrls];
              newImageUrls[0] = e.target.value;
              setImageUrls(newImageUrls);
            }}
            placeholder="Image URL 1"
          />
          <input
            type="text"
            value={imageUrls[1]}
            onChange={(e) => {
              const newImageUrls = [...imageUrls];
              newImageUrls[1] = e.target.value;
              setImageUrls(newImageUrls);
            }}
            placeholder="Image URL 2"
          />
          <input
            type="text"
            value={imageUrls[2]}
            onChange={(e) => {
              const newImageUrls = [...imageUrls];
              newImageUrls[2] = e.target.value;
              setImageUrls(newImageUrls);
            }}
            placeholder="Image URL 3"
          />
          <input
            type="text"
            value={imageUrls[3]}
            onChange={(e) => {
              const newImageUrls = [...imageUrls];
              newImageUrls[3] = e.target.value;
              setImageUrls(newImageUrls);
            }}
            placeholder="Image URL 4"
          />
        </section>

        <hr className="divider" />

        <div className="submit-section">
          <button type="submit">Update cabin</button>
        </div>
      </form>

      {errors.length > 0 && (
        <div className="errors-container">
          <ul>
            {errors.map((error, idx) => (
              <li key={idx} className="error">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EditcabinForm;

