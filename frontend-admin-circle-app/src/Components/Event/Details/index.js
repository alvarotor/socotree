import React, {useState, useEffect, useContext} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Context} from '../../../Context';
import fetchGraphQL from '../../../Api/fetchGraphQL';
import Style from './style';
import Photo from '../../User/Details/style';

export default withRouter(({id, history}) => {
  if (!id) {
    history.push('/');
  }

  const {state} = useContext(Context);
  const [event, setEvent] = useState({});

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      function kTC(figures) {
        //keepTwoChars
        return ('0' + figures).slice(-2);
      }

      const response = await fetchGraphQL(
        `{
          event(id: "${id}") {
            uuid
            created
            description
            smalldescription
            link
            location
            picture
            name
            updated
            addrestusers
            questionsweight
            recircle
            age
            prematch
            circlesize
            lang
            notify
            type
            eventtime {
              year
              month
              day
              hour
              minute
            }
            eventjoin {
              userid
              user {
                profile {
                  name
                }
              }
            }
            eventregister {
              userid
              user {
                profile {
                  name
                }
              }
            }
          }
        }`,
      );

      // Avoid updating state if the component unmounted before the fetch completes
      if (!isMounted) {
        return;
      }

      const data = response.data.event;
      if (data.eventtime) {
        const {year, month, day, hour, minute} = data.eventtime;
        data.time = `${kTC(month)}/${kTC(day)}/${year} ${kTC(hour)}:${kTC(
          minute,
        )} UTC`;
        // console.log(data.time);
        data.eventtime = new Date(data.time).toString();
        data.created = new Date(data.created).toString();
        data.updated = new Date(data.updated).toString();
      }

      setEvent(data);
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const deleteEvent = async () => {
    var r = window.confirm(`Are you sure to delete ${id}?`);
    if (r !== true) {
      return;
    }

    const response = await fetchGraphQL(
      `mutation {
        deleteEvent(id: "${id}")
      }`,
      '',
      state.token,
    );

    console.log(response.data.deleteEvent);
    alert(response.data.deleteEvent);
    history.push('/events');
  };

  return (
    <Style>
      <h1>Event</h1>
      <ul className="list-group">
        <li className="list-group-item">{event.uuid}</li>
        <li className="list-group-item">{event.name}</li>
        <li className="list-group-item">{event.smalldescription}</li>
        <li className="list-group-item">{event.link}</li>
        <li className="list-group-item">{event.description}</li>
        <li className="list-group-item">{event.location}</li>
        <li className="list-group-item">
          {event.picture ? (
            <>
              <Photo
                src={
                  'https://s3.eu-central-1.amazonaws.com/circles.berlin/' +
                  event.picture
                }
                className="card-img-top"
                alt={event.name}
              />
              <br />
              {event.picture}
            </>
          ) : (
            'No photo yet'
          )}
        </li>
        <li className="list-group-item">
          <b>When:</b> {event.eventtime}
        </li>
        <li className="list-group-item">
          <b>Created:</b> {event.created}
        </li>
        <li className="list-group-item">
          <b>Updated:</b> {event.updated}
        </li>
        <li className="list-group-item">
        <b>add rest users:</b> {event.addrestusers ? 'YES' : 'NO'} <b>re circle:</b> {event.recircle ? 'YES' : 'NO'} <b>age:</b>{' '}
          {event.age ? 'YES' : 'NO'} <b>pre match:</b>{' '}
          {event.prematch ? 'YES' : 'NO'} <b>circle size:</b> {event.circlesize}{' '}
          <b>lang:</b> {event.lang ? 'YES' : 'NO'} <b>notify:</b>{' '}
          {event.notify ? 'YES' : 'NO'}{' '}<b>questionsweight:</b>{' '}
          {event.questionsweight}{' '}<b>type:</b>{' '}
          {event.type === 0 ? 'Chat' : 'Video Conference'}
        </li>
        {state.token && event.eventregister?.length > 0 ? (
          event.eventregister.map((registered, i) => {
            // console.log(registered);
            return (
              <li className="list-group-item" key={registered.userid}>
                {i === 0 ? (
                  <>
                    <b>Reminded users:</b>
                    <br />
                  </>
                ) : (
                  ''
                )}
                <Link to={`/user/${registered.userid}`}>
                  {registered.user?.profile?.name}
                </Link>
              </li>
            );
          })
        ) : (
          <p>
            No users <b>reminded</b> at this event just yet or you are not
            logged in to be able to see it
          </p>
        )}
        {state.token && event.eventjoin?.length > 0 ? (
          event.eventjoin.map((joined, i) => {
            // console.log(joined);
            return (
              <li className="list-group-item" key={joined.userid}>
                {i === 0 ? (
                  <>
                    <b>Joined users:</b>
                    <br />
                  </>
                ) : (
                  ''
                )}
                <Link to={`/user/${joined.userid}`}>
                  {joined.user?.profile?.name}
                </Link>
              </li>
            );
          })
        ) : (
          <p>
            No users <b>joined</b> at this event just yet or you are not logged
            in to be able to see it
          </p>
        )}
        <li className="list-group-item">
          {state.token ? (
            <>
              <button
                className="badge badge-primary badge-pill float-left"
                onClick={() => deleteEvent()}>
                Delete
              </button>
              <Link to={'/update/' + event.uuid}>
                <span className="badge badge-primary badge-pill float-right ml-2">
                  Update
                </span>
              </Link>
              <Link to={'/events/' + event.uuid + '/questions'}>
                <span className="badge badge-primary badge-pill float-right">
                  Questions
                </span>
              </Link>
            </>
          ) : (
            <p>Login to see the options</p>
          )}
        </li>
      </ul>
      <Link to="/events">Back</Link>
    </Style>
  );
});
