import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import {useFormState} from 'react-use-form-state';
import {Context} from '../../Context';
import FormStyle from './style';
import fetchGraphQL from '../../Api/fetchGraphQL';
import Form from '../Form';

export default ({history}) => {
  const {state} = useContext(Context);
  const [formState, {label, text, number, checkbox, select}] = useFormState(
    {
      name: 'A beautiful event name',
      smalldescription: 'my small description',
      description: 'my description',
      location: 'my location',
      year: '2021',
      month: (new Date().getMonth() + 1).toString(),
      day: new Date().getDate().toString(),
      hour: '19',
      minute: '00',
      circlesize: 2,
      notify: true,
      type: 0,
      questionsweight: 0,
      // type: ['sedan', 'suv', 'van'],
    },
    {
      onChange(e, stateValues, nextStateValues) {
        const {name, value} = e.target;
        console.log(`The ${name} input has changed to ${value}!`);
      },
    },
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formState);

    if (
      Object.entries(formState.errors).length === 0 &&
      formState.errors.constructor === Object
    ) {
      let isMounted = true;
      const {
        name,
        location,
        description,
        smalldescription,
        link,
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
        lang,
        circlesize,
        notify,
        type,
      } = formState.values;

      const create = await fetchGraphQL(
        `mutation {
          createEvent(
            name: "${name}",
            location: "${location}",
            smalldescription: "${smalldescription}",
            link: "${link}",
            description: "${description}",
            year: ${year},
            month: ${parseInt(month, 10)},
            day: ${parseInt(day, 10)},
            hour: ${parseInt(hour, 10)},
            minute: ${parseInt(minute, 10)},
            addrestusers: ${addrestusers},
            questionsweight: ${parseFloat(questionsweight)},
            recircle: ${recircle},
            circlesize: ${circlesize},
            age: ${age},
            prematch: ${prematch},
            lang: ${lang},
            notify: ${notify},
            type: ${type},
          ) {
            created
            name
            uuid
          }
        }`,
        '',
        state.token,
      );

      console.log(create);

      // Avoid updating state if the component unmounted before the fetch completes
      if (!isMounted) {
        return;
      }

      history.push('/events');
    }
  };

  return (
    <>
      <h1>Add a new event</h1>
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
          Add
        </button>
        <br />
        <Link to="/events">Back</Link>
      </FormStyle>
    </>
  );
};
