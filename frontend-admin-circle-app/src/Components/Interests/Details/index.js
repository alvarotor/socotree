import React, {useState, useEffect, useContext} from 'react';
import {withRouter} from 'react-router-dom';
import fetchGraphQL from '../../../Api/fetchGraphQL';
import Style from '../../Events/Details/style';
import {Context} from '../../../Context';
import {Link} from 'react-router-dom';

export default withRouter(({history}) => {
  const [interests, setInterests] = useState([]);
  const {state} = useContext(Context);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      const response = await fetchGraphQL(
        `{
          interests {
            name
            uuid
            adminverified
            weight
          }
        }
        `,
        '',
      );
      // Avoid updating state if the component unmounted before the fetch completes
      if (!isMounted) {
        return;
      }
      setInterests(
        response.data.interests.sort((a, b) => {
          if (a.name > b.name) {
            return 1;
          }
          if (b.name > a.name) {
            return -1;
          }
          return 0;
        }),
      );
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [state.token]);

  const addInterest = () => {
    history.push('/interest/add');
  };

  return (
    <Style>
      <button className="btn btn-primary" onClick={() => addInterest()}>
        Add Interest
      </button>
      <p></p>
      <div className="list-group">
        {interests ? (
          interests.map((i) => (
            <Link
              className="list-group-item list-group-item-action"
              key={i.uuid}
              to={`/interest/${i.uuid}`}
              role="button">
              {i.name} - {i.weight}{' '}
              {!i.adminverified ? '- NOT Admin verified' : null}
            </Link>
          ))
        ) : (
          <p>No Interests</p>
        )}
      </div>
    </Style>
  );
});
