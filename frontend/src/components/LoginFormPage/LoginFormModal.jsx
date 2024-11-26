// frontend/src/components/LoginFormPage/LoginFormModal.jsx

import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../components/context/Modal';
import { fetchUsers } from '../../store/users'; // Import fetchUsers if needed
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Loading state
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors
    setLoading(true); // Start loading state

    return dispatch(sessionActions.login({ credential, password }))
      .then(async () => {
        // Optionally fetch users after login
        await dispatch(fetchUsers());
        closeModal(); // Close the modal on successful login
      })
      .catch(async (res) => {
        const data = await res.json(); // Handle errors
        if (data && data.errors) setErrors(data.errors);
      })
      .finally(() => setLoading(false)); // Stop loading state
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev); // Toggle visibility
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h1>Log In</h1>
      
      {/* Display errors */}
      {errors.credential && <p className="error">{errors.credential}</p>}
      {errors.password && <p className="error">{errors.password}</p>}

      <label>
        Username or Email
        <input
          type="text"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          required
          autoFocus
        />
      </label>

      <label>
        Password
        <div className="password-container">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="toggle-password"
            onClick={togglePasswordVisibility}
            aria-label="Toggle password visibility"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </label>

      {/* Submit button */}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging In...' : 'Log In'}
      </button>
    </form>
  );
}

export default LoginFormModal;

