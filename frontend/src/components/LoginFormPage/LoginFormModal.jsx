// frontend/src/components/LoginFormPage/LoginFormModal.jsx

// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../components/context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal) // Close the modal on successful login
      .catch(async (res) => {
        const data = await res.json(); // Handle errors
        if (data && data.errors) setErrors(data.errors);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Log In</h1>
      <label>
        Username or Email
        <input
          type="text"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          required
        />
      </label>
      {errors.credential && <p>{errors.credential}</p>}
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      {errors.password && <p>{errors.password}</p>}
      <button type="submit">Log In</button>
    </form>
  );
}

export default LoginFormModal;
