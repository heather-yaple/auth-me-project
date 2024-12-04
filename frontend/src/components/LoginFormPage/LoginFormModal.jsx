import  { useState } from 'react';
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

  const isFormValid = credential.length >= 4 && password.length >= 6;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });
  };

  const handleDemoUser = (e) => {
    e.preventDefault();
    return dispatch(sessionActions.login({ credential: 'demo@user.io', password: 'password' }))
      .then(closeModal);
  };

  return (
    <form onSubmit={handleSubmit} className="login-modal">
      <h1>Log In</h1>
      
      {errors.credential && <p className="error">The provided credentials were invalid.</p>}
      
      <label>
        Username or Email
        <input
          type="text"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
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
      
      <button type="submit" disabled={!isFormValid} className={isFormValid ? 'active' : ''}>Log In</button>
      
      <div className="demo-user">
        <button onClick={handleDemoUser}>Demo User</button>
      </div>
    </form>
  );
}

export default LoginFormModal;

