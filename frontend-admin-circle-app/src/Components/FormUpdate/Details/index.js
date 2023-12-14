import React, {useEffect, useContext} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {useFormState} from 'react-use-form-state';
import {Context} from '../../../Context';
import fetchGraphQL from '../../../Api/fetchGraphQL';
import FormStyle from './style';
import Form from '../../Form';

export default withRouter(({id, history}) => {
  if (!id) {
    history.push('/');
  }

  const {state} = useContext(Context);
  let [formState, {label, text, number, checkbox, select}] = useFormState();

  useEffect(() => {
    const fetchData = async () => {
      function kTC(figures) {
        //keepTwoChars
        return ('0' + figures).slice(-2);
      }

      const res = await fetchGraphQL(
        `{
          event(id: "${id}") {
            smalldescription
            link
            description
            location
            name
            addrestusers
            questionsweight,
            recircle
            age
            prematch
            circlesize
            lang
            notify,
            type,
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

      const {
        name,
        description,
        smalldescription,
        link,
        location,
        addrestusers,
        questionsweight,
        recircle,
        age,
        prematch,
        circlesize,
        lang,
        notify,
        type,
      } = res.data.event;
      if (res.data.event.eventtime) {
        const {year, month, day, hour, minute} = res.data.event.eventtime;
        // console.log(res.data.event.eventtime);
        const time = `${kTC(month)}/${kTC(day)}/${year} ${kTC(hour)}:${kTC(
          minute,
        )} UTC`;

        formState.setField('year', year);
        formState.setField('month', month);
        formState.setField('day', day);
        formState.setField('hour', new Date(time).getHours());
        formState.setField('minute', minute);
      }
      formState.setField('name', name);
      formState.setField('description', description);
      formState.setField('smalldescription', smalldescription);
      formState.setField('link', link);
      formState.setField('location', location);
      formState.setField('addrestusers', addrestusers);
      formState.setField('questionsweight', questionsweight);
      formState.setField('recircle', recircle);
      formState.setField('age', age);
      formState.setField('prematch', prematch);
      formState.setField('circlesize', circlesize);
      formState.setField('lang', lang);
      formState.setField('notify', notify);
      formState.setField('type', type);
    };

    fetchData();
  }, [formState, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formState.errors.constructor === Object && checkNoErrors()) {
      const {
        name,
        location,
        smalldescription,
        link,
        description,
        year,
        month,
        day,
        hour,
        minute,
        addrestusers,
        questionsweight,
        recircle,
        age,
        prematch,
        circlesize,
        lang,
        notify,
        type,
      } = formState.values;

      const res = await fetchGraphQL(
        `mutation {
          updateEvent(
              id: "${id}",
              name: "${name}",
              location: "${location}",
              description: "${description}",
              smalldescription: "${smalldescription}",
              link: "${link}",
              year: ${year},
              month: ${parseInt(month, 10)},
              day: ${parseInt(day, 10)},
              hour: ${parseInt(hour, 10)},
              minute: ${parseInt(minute, 10)},
              questionsweight: ${parseFloat(questionsweight)},
              addrestusers: ${addrestusers},
              recircle: ${recircle},
              age: ${age},
              prematch: ${prematch},
              circlesize: ${circlesize},
              lang: ${lang},
              notify: ${notify},
              type: ${type},
            ) {
            created
            name
            updated
            uuid
          }
        }`,
        '',
        state.token,
      );

      history.push('/event/' + res.data.updateEvent.uuid);
    }
  };

  function checkNoErrors() {
    if (Object.entries(formState.errors).length > 0) {
      Object.entries(formState.errors).forEach((error) => {
        if (error[1] !== undefined) {
          return false;
        }
      });
    }
    return true;
  }

  return (
    <>
      <h1>Update this event</h1>
      <FormStyle onSubmit={handleSubmit}>
        <Form
          label={label}
          text={text}
          number={number}
          checkbox={checkbox}
          select={select}
        />
        <br />
        <button type="submit" className="btn btn-primary">
          Update
        </button>
        <br />
        <Link to={`/event/${id}`}>Back to event</Link>
      </FormStyle>
    </>
  );
});
