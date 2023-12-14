import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import {Context} from '../../Context';

export default () => {
  const {state, dispatch} = useContext(Context);
  const logout = () => dispatch({type: 'logout'});

  const getSite = () => {
    // console.log(window.location.host)
    switch (window.location.host) {
      case 'localhost:3000':
        // code block
        return 'localhost';
      case 'admin-circles-beta-dashboard.netlify.app':
        // code block
        return 'beta';
      default:
        return '';
    }
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/">
          Circles Dashboard {' '}
          {getSite()}
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/users">
                All Users
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/interests">
                Interests
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/questions">
                Questions
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/circles">
                Circles
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/versions">
                Versions
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/events">
                Events
              </Link>
            </li>
            <li className="nav-item">
              {state.token ? (
                <a className="nav-link" onClick={logout} href="#logout">
                  LogOut
                </a>
              ) : (
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};
