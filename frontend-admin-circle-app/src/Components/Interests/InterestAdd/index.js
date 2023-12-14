import React, {useContext, useState} from 'react';
import {Link} from 'react-router-dom';
import {useFormState} from 'react-use-form-state';
import {Context} from '../../../Context';
import Spinner from '../../Spinner';
import FormStyle from './style';
import fetchGraphQL from '../../../Api/fetchGraphQL';

export default ({history}) => {
  const {state} = useContext(Context);
  const [loading, setLoading] = useState(false);

  const [formState, {label, text}] = useFormState(
    {
      interest: '',
      weight: "0",
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
    setLoading(true);

    if (
      Object.entries(formState.errors).length === 0 &&
      formState.errors.constructor === Object
    ) {
      let isMounted = true;
      const {interest, weight} = formState.values;

      await fetchGraphQL(
        `mutation {
          createInterest(
            interest:"${interest}", 
            weight:${weight},
          ) {
            uuid
          }
        }`,
        '',
        state.token,
      );

      setLoading(false);

      // Avoid updating state if the component unmounted before the fetch completes
      if (!isMounted) {
        return;
      }

      history.push('/interests');
    }
  };

  return (
    <>
      <h1>Add a new interest</h1>
      <FormStyle onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="interest" {...label('interest')}>
            Interest
          </label>
          <input
            className="form-control"
            {...text('interest')}
            id="interest"
            required
            minLength="2"
            aria-describedby="interestHelp"
            placeholder="Interest"
            autoFocus
          />
          <small id="interestHelp" className="form-text text-muted">
            Please, write a cool interest.
          </small>
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="weight" {...label('weight')}>
            Weight
          </label>
          <input
            className="form-control"
            {...text('weight')}
            id="weight"
            required
            type="number"
            aria-describedby="weightHelp"
            placeholder="Weight"
          />
          <small id="weightHelp" className="form-text text-muted">
            Float number, 1 by default.
          </small>
        </div>
        <br />
        <button type="submit" className="btn btn-primary">
          Add
        </button>
        <br />
        <Link to="/interests">Back</Link>
      </FormStyle>
      {loading && <Spinner disable={true} />}
    </>
  );
};
