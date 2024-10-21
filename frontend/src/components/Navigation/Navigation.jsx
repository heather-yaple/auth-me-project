// src/components/Navigation/Navigation.jsx


import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import logoImage from '../../images/logo.png'; 
import { FaEllipsisV } from 'react-icons/fa';
import SearchBar from './SearchBar';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <header className="header">
      <div className="container header-content">
        <NavLink to="/" className="logo-link" aria-label="Home">
          <img src={logoImage} alt="Cozy Cabins Logo" className="logo-image" />
        </NavLink>
        <nav className="nav-menu">
          {sessionUser && (
            <NavLink to="/spots/new" className="create-spot-link">
              Create a New Cabin
            </NavLink>
          )}

          <div className="menu-buttons">
            <button className="hamburger-menu" aria-label="Menu">
              <FaEllipsisV />
            </button>
            {isLoaded && (
              <ProfileButton user={sessionUser} />
            )}
          </div>

          <SearchBar />
        </nav>
      </div>
    </header>
  );
}

export default Navigation;
