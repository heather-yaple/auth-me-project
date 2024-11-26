import { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session'; // Assuming your actions are in this location
import { useModal } from '../../context/Modal'; // Assuming modal context is used

function SignupFormModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setIsEmailValid(/^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setIsPasswordValid(value.length >= 6);
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setIsConfirmPasswordValid(value === password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Check if all inputs are valid before submission
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(sessionActions.signup({ email, username, firstName, lastName, password }))
        .then(() => {
          setIsSubmitting(false);
          closeModal();
        })
        .catch(async (res) => {
          const data = await res.json();
          setIsSubmitting(false);
          if (data && data.errors) setErrors(data.errors);
        });
    }

    setIsSubmitting(false);
    setErrors({ confirmPassword: "Confirm Password must match Password" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign Up</h1>

      <label htmlFor="email">Email</label>
      <input
        type="text"
        id="email"
        value={email}
        onChange={handleEmailChange}
        required
        aria-describedby="email-error"
      />
      {!isEmailValid && <p id="email-error" className="error">Please enter a valid email address.</p>}
      {errors.email && <p className="error">{errors.email}</p>}

      <label htmlFor="username">Username</label>
      <input
        type="text"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        aria-describedby="username-error"
      />
      {errors.username && <p id="username-error" className="error">{errors.username}</p>}

      <label htmlFor="firstName">First Name</label>
      <input
        type="text"
        id="firstName"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
        aria-describedby="firstName-error"
      />
      {errors.firstName && <p id="firstName-error" className="error">{errors.firstName}</p>}

      <label htmlFor="lastName">Last Name</label>
      <input
        type="text"
        id="lastName"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
        aria-describedby="lastName-error"
      />
      {errors.lastName && <p id="lastName-error" className="error">{errors.lastName}</p>}

      <label htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={handlePasswordChange}
        required
        aria-describedby="password-error"
      />
      {!isPasswordValid && <p id="password-error" className="error">Password must be at least 6 characters long.</p>}
      {errors.password && <p className="error">{errors.password}</p>}

      <label htmlFor="confirmPassword">Confirm Password</label>
      <input
        type="password"
        id="confirmPassword"
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
        required
        aria-describedby="confirmPassword-error"
      />
      {!isConfirmPasswordValid && <p id="confirmPassword-error" className="error">Passwords do not match.</p>}
      {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

      <button
        type="submit"
        disabled={isSubmitting || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid}
      >
        {isSubmitting ? "Submitting..." : "Sign Up"}
      </button>
    </form>
  );
}

export default SignupFormModal;

