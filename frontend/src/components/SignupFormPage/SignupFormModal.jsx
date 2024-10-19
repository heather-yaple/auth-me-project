// frontend/src/components/SignupFormPage/SignupFormModal.jsx

// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
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

  // Add state for input validity
const [isEmailValid, setIsEmailValid] = useState(true);
const [isPasswordValid, setIsPasswordValid] = useState(true);
const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);

// Email validation
const handleEmailChange = (e) => {
  const value = e.target.value;
  setEmail(value);
  setIsEmailValid(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)); // Basic email regex validation
};

// Password validation (ensure password is at least 6 characters)
const handlePasswordChange = (e) => {
  const value = e.target.value;
  setPassword(value);
  setIsPasswordValid(value.length >= 6);
};

// Confirm password validation (check if it matches the password)
const handleConfirmPasswordChange = (e) => {
  const value = e.target.value;
  setConfirmPassword(value);
  setIsConfirmPasswordValid(value === password);
};

const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);  // Show loader/spinner

  if (password === confirmPassword) {
    setErrors({});
    return dispatch(sessionActions.signup({ email, username, firstName, lastName, password }))
      .then(() => {
        setIsSubmitting(false);  // Stop loader
        closeModal();
      })
      .catch(async (res) => {
        const data = await res.json();
        setIsSubmitting(false);  // Stop loader
        if (data && data.errors) setErrors(data.errors);
      });
  }
  setIsSubmitting(false);  // Stop loader in case of validation error
  return setErrors({ confirmPassword: "Confirm Password field must be the same as the Password field" });
};


  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign Up</h1>
      <label>
        Email
        <input
          type="text"
          value={email}
          onChange={handleEmailChange}
          required
        />
      </label>
      {errors.email && <p>{errors.email}</p>}
      <label>
        Username
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </label>
      {errors.username && <p>{errors.username}</p>}
      <label>
        First Name
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </label>
      {errors.firstName && <p>{errors.firstName}</p>}
      <label>
        Last Name
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </label>
      {errors.lastName && <p>{errors.lastName}</p>}
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
      </label>
      {errors.password && <p>{errors.password}</p>}
      <label>
        Confirm Password
        <input
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          required
        />
      </label>
      {!isConfirmPasswordValid && <p className="error">Passwords do not match.</p>}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Sign Up"}
      </button>

    </form>
  );
}
router.get('/confirm/:token', async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({ where: { confirmationToken: token } });

  if (!user) {
    return res.status(400).json({ message: 'Invalid token' });
  }

  user.confirmationToken = null; // Clear the token after verification
  user.isVerified = true; // Add this field to your model to track verification
  await user.save();

  return res.json({ message: 'Email confirmed' });
});

export default SignupFormModal;