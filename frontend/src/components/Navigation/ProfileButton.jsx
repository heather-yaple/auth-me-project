import { useState, useEffect, useRef } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormPage/LoginFormModal';
import SignupFormModal from '../SignupFormPage/SignupFormModal';
import { NavLink } from 'react-router-dom';
import './ProfileButton.css';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  useEffect(() => {
    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target) && showMenu) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    setShowMenu(false);
    navigate('/');
  };

  const renderMenuItems = () => {
    if (user) {
      return (
        <>
          <li>Hello, {user.firstName}</li>
          <li>{user.email}</li>
          <li>
            <NavLink to="/spots/current" onClick={() => setShowMenu(false)}>
              Manage Cabins
            </NavLink>
          </li>
          <li>
            <button onClick={logout}>Log Out</button>
          </li>
        </>
      );
    }

    return (
      <>
        <OpenModalMenuItem
          itemText="Log In"
          onItemClick={() => setShowMenu(false)}
          modalComponent={<LoginFormModal />}
        />
        <OpenModalMenuItem
          itemText="Sign Up"
          onItemClick={() => setShowMenu(false)}
          modalComponent={<SignupFormModal />}
        />
      </>
    );
  };

  return (
    <div className="profile-button">
      <button onClick={toggleMenu} aria-expanded={showMenu}>
        {user.profileImage ? (
          <img src={user.profileImage} alt="Profile" className="profile-image" />
        ) : (
          <FaUserCircle />
        )}
      </button>
      {showMenu && (
        <ul className="profile-dropdown" ref={ulRef}>
          {renderMenuItems()}
        </ul>
      )}
    </div>
  );
}

export default ProfileButton;
