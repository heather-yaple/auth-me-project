// frontend/src/components/SignupFormPage/SignupFormModal.jsx

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../components/context/Modal";
import * as sessionActions from "../../store/session";
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const isFormValid = () => {
    return (
      email &&
      username.length >= 4 &&  
      password.length >= 6 && 
      confirmPassword &&
      password === confirmPassword
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    if (password !== confirmPassword) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "Confirm Password field must be the same as the Password field"
      }));
      return;
    }

    return dispatch(sessionActions.signup({ email, username, firstName, lastName, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          const updatedErrors = {};
          if (data.errors.email) {
            updatedErrors.email = "The provided email is invalid.";
          }
          if (data.errors.username) {
            updatedErrors.username = "Username must be unique.";
          }
          setErrors(updatedErrors);
        }
      });
  };

  return (
    <form onSubmit={handleSubmit} className="signup-modal" noValidate>
      <h1>Sign Up</h1>

      <div className="error-container">
        {Object.keys(errors).map((key) => (
          <p key={key} className="error-message">{errors[key]}</p>
        ))}
      </div>

      <label>
        First Name
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </label>

      <label>
        Last Name
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </label>

      <label>
        Email
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <label>
        Username
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </label>

      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>

      <label>
        Confirm Password
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </label>

      <button
        type="submit"
        disabled={!isFormValid()} 
        className={isFormValid() ? "active" : ""}
      >
        Sign Up
      </button>
    </form>
  );
}

export default SignupFormModal;

