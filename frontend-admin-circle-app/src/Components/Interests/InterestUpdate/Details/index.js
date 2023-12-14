import React, {useEffect, useContext} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {useFormState} from 'react-use-form-state';
import {Context} from '../../../../Context';
import fetchGraphQL from '../../../../Api/fetchGraphQL';
import FormStyle from './style';

export default withRouter(({id, history}) => {
  if (!id) {
    history.push('/interests');
  }

  const {state} = useContext(Context);
  let [formState, {label, text}] = useFormState();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchGraphQL(
        `{
          interest(interestid: "${id}") {
            name
            uuid
            weight
          }
        }`,
      );

      const {name, weight} = response.data.interest;

      formState.setField('interest', name);
      formState.setField('weight', weight);
    };

    fetchData();
  }, [formState, id]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (formState.errors.constructor === Object && checkNoErrors()) {
      const {interest, weight} = formState.values;

      await fetchGraphQL(
        `mutation {
          updateInterest(
            interestid: "${id}", 
            interest: "${interest}",
            weight: ${weight} 
          ) 
        }`,
        '',
        state.token,
      );

      history.push('/interest/' + id);
    }
  }

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
      <h1>Update this interest</h1>
      <FormStyle onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name" {...label('interest')}>
            Interest
          </label>
          <input
            className="form-control"
            {...text('interest')}
            id="interest"
            required
            minLength="5"
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
        <button type="submit" className="btn btn-primary">
          Update
        </button>
        <br />
        <Link to={`/interest/${id}`}>Back to interest</Link>
      </FormStyle>
    </>
  );
});
