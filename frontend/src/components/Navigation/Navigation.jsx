import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './styles/Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul className="navigation">
      <li>
        <NavLink exact to="/">Home</NavLink>
      </li>

      {/* Only show Spots and Reviews if the user is logged in */}
      {sessionUser && (
        <>
          <li>
            <NavLink to="/spots">Spots</NavLink>
          </li>
          <li>
            <NavLink to="/reviews">Reviews</NavLink>
          </li>
        </>
      )}

      {/* Show Login and Signup if no user is logged in */}
      {!sessionUser && (
        <>
          <li>
            <NavLink to="/login">Login</NavLink>
          </li>
          <li>
            <NavLink to="/signup">Signup</NavLink>
          </li>
        </>
      )}

      {/* Conditionally render the ProfileButton if user is loaded */}
      {isLoaded && sessionUser && (
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;

