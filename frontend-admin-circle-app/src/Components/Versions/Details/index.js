import React, {useState, useEffect, useContext} from 'react';
import {withRouter} from 'react-router-dom';
import fetchGraphQL from '../../../Api/fetchGraphQL';
import Style from '../../Events/Details/style';
import {Context} from '../../../Context';

export default withRouter(({history}) => {
  const [model, setModel] = useState([]);
  const {state} = useContext(Context);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      const response = await fetchGraphQL(
        `{
          updatedVersion {
            androidbuild
            iosbuild
            androidbuildforced
            iosbuildforced
          }
        }`,
      );
      // Avoid updating state if the component unmounted before the fetch completes
      if (!isMounted) {
        return;
      }
      setModel(response.data.updatedVersion);
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [state.token]);

  const update = () => {
    history.push('/versions/update');
  };

  return (
    <Style>
      <button className="btn btn-primary" onClick={() => update()}>
        Update
      </button>
      <p></p>
      {model ? (
        <ul className="list-group">
          <li className="list-group-item">
            android build: {model.androidbuild}
          </li>
          <li className="list-group-item">
            android build forced: {model.androidbuildforced}
          </li>
          <li className="list-group-item">ios build: {model.iosbuild}</li>
          <li className="list-group-item">
            ios build forced: {model.iosbuildforced}
          </li>
        </ul>
      ) : (
        <p>No Versions</p>
      )}
    </Style>
  );
});
