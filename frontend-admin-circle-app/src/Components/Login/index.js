import React, {useState, useContext} from 'react';
import fetchGraphQL from '../../Api/fetchGraphQL';
import {Context} from '../../Context';
import Spinner from '../Spinner';
import jwt from 'jsonwebtoken';

export default ({history}) => {
  const {dispatch} = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const loginState = (token) => dispatch({type: 'login', payload: token});

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const response = await login(user.email, user.password);
    const userLogged = jwt.decode(response.data.login.token);
    if (userLogged.admin) {
      loginState(response.data.login.token);
      history.push('/events');
    } else {
      alert('User not found or not admin');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const {value, name} = e.target;
    setUser((prev) => ({...prev, [name]: value}));
  };

  const login = async (e, p) => {
    return await fetchGraphQL(`
    { 
      login(email:"${e}", password:"${p}") {
        token
      }
    }`);
  };

  const isInvalid = user.password.trim() === '' || user.email.trim() === '';

  if (loading) {
    return <Spinner />;
  } else {
    return (
      <div className="container">
        <div id="login-box" className="col-md-6">
          <form id="login-form" className="form" onSubmit={onSubmit}>
            <h3 className="text-center">Login</h3>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <br />
              <input
                name="email"
                value={user.email}
                onChange={handleChange}
                placeholder="Email Address"
                id="email"
                type="text"
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <br />
              <input
                name="password"
                value={user.password}
                onChange={handleChange}
                placeholder="Password"
                type="password"
                id="password"
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="submit"
                name="submit"
                disabled={isInvalid}
                className="btn btn-primary"
                value="Sign in"
                required
              />
            </div>
          </form>
        </div>
      </div>
    );
  }
};
