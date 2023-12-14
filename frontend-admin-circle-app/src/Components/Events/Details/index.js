import React, {useState, useEffect} from 'react';
import fetchGraphQL from '../../../Api/fetchGraphQL';
import Style from './style';
import {Link} from 'react-router-dom';
import {withRouter} from 'react-router-dom';

export default withRouter(({history}) => {
  const [events, setEvents] = useState([]);

  const fetchData = async (filter) => {
    function kTC(figures) {
      //keepTwoChars
      return ('0' + figures).slice(-2);
    }

    const res = await fetchGraphQL(
      `{
        events(filterOlds: ${filter}) {
          uuid
          name
          eventtime {
            year
            month
            day
            hour
            minute
          }
        }
      }`,
    );

    if (res.data.errors?.length > 0) {
      alert(res.data.errors[0].message);
      return;
    }

    if (res.data.events) {
      res.data.events = res.data.events.map((e) => {
        const {year, month, day, hour, minute} = e.eventtime;
        const time = `${kTC(month)}/${kTC(day)}/${year} ${kTC(hour)}:${kTC(
          minute,
        )} UTC`;
        // console.log(e.eventtime.hour)
        e.eventtime.hour = kTC(new Date(time).getHours());
        e.eventtime.minute = kTC(e.eventtime.minute);
        e.eventtime.day = kTC(e.eventtime.day);
        e.eventtime.month = kTC(e.eventtime.month);
        return e;
      });
    }
    setEvents(res.data.events.reverse());
  };

  useEffect(() => {
    fetchData(false);
  }, []);

  const addEvent = () => {
    history.push('/add');
  };

  const addEventPicture = () => {
    history.push('/eventuploadpicture');
  };

  const futureEvents = () => {
    fetchData(true);
  };

  const allEvents = () => {
    fetchData(false);
  };

  return (
    <Style>
      <h1>Events</h1>
      <button className="btn btn-primary" onClick={() => addEvent()}>
        Add Event
      </button>{' '}
      <button className="btn btn-primary" onClick={() => addEventPicture()}>
        Add Event Picture
      </button>{' '}
      <button className="btn btn-primary" onClick={() => futureEvents()}>
        Only future events
      </button>{' '}
      <button className="btn btn-primary" onClick={() => allEvents()}>
        All events
      </button>
      <p></p>
      <div className="list-group">
        {events.map((event) => (
          <Link
            key={event.uuid}
            className="list-group-item list-group-item-action"
            to={`/event/${event.uuid}`}
            role="button">
            {event.name +
              ' - ' +
              event.eventtime.year +
              '/' +
              event.eventtime.month +
              '/' +
              event.eventtime.day +
              ' @ ' +
              event.eventtime.hour +
              ':' +
              event.eventtime.minute}
          </Link>
        ))}
      </div>
    </Style>
  );
});
