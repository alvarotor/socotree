import React, {useState, useEffect, useContext} from 'react';
import fetchGraphQL from '../../Api/fetchGraphQL';
import Style from '../Events/Details/style';
import {withRouter} from 'react-router-dom';
import {upload} from '../../Api/FileUploadService';
import {Context} from '../../Context';

export default withRouter(({history}) => {
  const [events, setEvents] = useState([]);
  const [event, setEvent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState(undefined);
  const {state} = useContext(Context);

  useEffect(() => {
    let isMounted = true;

    function compare(a, b) {
      if (a.updated < b.updated) {
        return -1;
      }
      if (a.updated > b.updated) {
        return 1;
      }
      return 0;
    }

    const fetchData = async () => {
      const res = await fetchGraphQL(
        `{
          events(filterOlds:true) {
            uuid
            name
            updated
          }
        }`,
      );

      // Avoid updating state if the component unmounted before the fetch completes
      if (!isMounted) {
        return;
      }

      if (res.data.errors?.length > 0) {
        alert(res.data.errors[0].message);
      } else {
        // console.log(res.data.events);
        setEvents(
          res.data.events
            .sort(compare)
            .map((e) => {
              e.name =
                e.name + ' - ' + e.updated.replace('T', ' ').replace('Z', ' ');
              return e;
            })
            .reverse(),
        );
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const eventsGo = () => {
    history.push('/events');
  };

  const selectFile = (event) => {
    setSelectedFiles(event.target.files);
  };

  const selectEvent = (event) => {
    setEvent(event.target.value);
  };

  const uploadSubmit = (e) => {
    e.preventDefault();
    let currentFile = selectedFiles[0];
    try {
      upload(event, currentFile, state.token);
      eventsGo();
    } catch (error) {
      alert(error);
    }
  };

  return (
    <Style>
      <h1>Add a pic to an event</h1>
      <form className="form-inline">
        <label className="my-1 mr-2" htmlFor="inlineFormCustomSelectPref">
          Events
        </label>
        <select
          className="my-1 mr-sm-2"
          id="inlineFormCustomSelectPref"
          onChange={selectEvent}>
          <option defaultValue>Choose...</option>
          {events.map((event) => (
            <option key={event.uuid} value={event.uuid}>
              {event.name}
            </option>
          ))}
        </select>
        <input type="file" onChange={selectFile} />
        <button
          className="btn btn-success"
          disabled={!selectedFiles || !event}
          onClick={uploadSubmit}>
          Upload
        </button>
      </form>
      <br />
      <button className="btn btn-primary" onClick={() => eventsGo()}>
        back to Events
      </button>
    </Style>
  );
});
