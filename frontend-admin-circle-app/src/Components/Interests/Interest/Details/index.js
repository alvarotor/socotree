import React, {useState, useEffect, useContext} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Context} from '../../../../Context';
import fetchGraphQL from '../../../../Api/fetchGraphQL';
import Style from './style';

export default withRouter(({id, history}) => {
  if (!id) {
    history.push('/interests');
  }

  const {state} = useContext(Context);
  const [interest, setInterest] = useState({});
  const [adminVerified, setAdminVerified] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      const response = await fetchGraphQL(
        `{
          interest(interestid: "${id}") {
            name
            uuid
            adminverified
            weight
          }
        }`,
      );

      // Avoid updating state if the component unmounted before the fetch completes
      if (!isMounted) {
        return;
      }

      setAdminVerified(response.data.interest.adminverified);
      setInterest(response.data.interest);
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const adminVerifiedToggle = async () => {
    setAdminVerified(!adminVerified);

    const res = await fetchGraphQL(
      `mutation {updateInterestAdminVerified(interestid: "${id}", adminverified:${!adminVerified})}`,
      '',
      state.token,
    );

    if (!res || !res.data || !res.data.updateInterestAdminVerified) {
      alert('There was a problem changing admin verified value');
    }
  };

  const deleteInterest = async () => {
    if (window.confirm(`Are you sure to delete ${id}?`) !== true) {
      return;
    }

    let isMounted = true;
    await fetchGraphQL(
      `mutation {
        deleteInterest(interestid: "${id}")
      }`,
      '',
      state.token,
    );

    // Avoid updating state if the component unmounted before the fetch completes
    if (!isMounted) {
      return;
    }

    history.push('/interests');
  };

  return (
    <Style>
      <h1>Interest</h1>
      <ul className="list-group">
        <li className="list-group-item">{interest.uuid}</li>
        <li className="list-group-item">{interest.name}</li>
        <li className="list-group-item">Weight: {interest.weight}</li>
        <li className="list-group-item">
          admin verified:
          <input
            type="checkbox"
            checked={adminVerified}
            onChange={adminVerifiedToggle}
          />
        </li>
        {state.token ? (
          <li className="list-group-item">
            <button
              className="badge badge-primary badge-pill float-left"
              onClick={() => deleteInterest()}>
              Delete
            </button>
            <Link to={`/interest/${interest.uuid}/update`}>
              <span className="badge badge-primary badge-pill float-right">
                Update
              </span>
            </Link>
          </li>
        ) : null}
      </ul>
      <Link to="/interests">Back</Link>
    </Style>
  );
});
