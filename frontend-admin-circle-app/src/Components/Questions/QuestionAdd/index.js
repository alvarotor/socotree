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

  const [formState, {label, text, checkbox}] = useFormState(
    {
      question: '',
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
      const {
        question,
        answer1,
        answer2,
        answer3,
        answer4,
        answer5,
        answer6,
        global,
      } = formState.values;

      const q = await fetchGraphQL(
        `mutation {
          createQuestion(
            question:"${question}", 
            global:${global}, 
          ) {
            uuid
          }
        }`,
        '',
        state.token,
      );

      const uuid = q.data.createQuestion.uuid;

      if (answer1) {
        await sendAnswer(uuid, answer1);
      }
      if (answer2) {
        await sendAnswer(uuid, answer2);
      }
      if (answer3) {
        await sendAnswer(uuid, answer3);
      }
      if (answer4) {
        await sendAnswer(uuid, answer4);
      }
      if (answer5) {
        await sendAnswer(uuid, answer5);
      }
      if (answer6) {
        await sendAnswer(uuid, answer6);
      }

      setLoading(false);

      // Avoid updating state if the component unmounted before the fetch completes
      if (!isMounted) {
        return;
      }

      history.push('/questions');
    }
  };

  const sendAnswer = async (qid, answer) => {
    console.log('sendAnswer', qid, answer);
    await fetchGraphQL(
      `mutation {
        createQuestionsAnswer(
          questionid: "${qid}", 
          answer: "${answer}") {
            question
            uuid
          }
        }`,
      '',
      state.token,
    );
  };

  return (
    <>
      <h1>Add a new question</h1>
      <FormStyle onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name" {...label('question')}>
            Question
          </label>
          <input
            className="form-control"
            {...text('question')}
            id="question"
            required
            minLength="5"
            aria-describedby="questionHelp"
            placeholder="Question"
            autoFocus
          />
          <small id="questionHelp" className="form-text text-muted">
            Please, write a cool question.
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="answer1" {...label('answer1')}>
            Answer 1
          </label>
          <input
            className="form-control"
            id="answer1"
            {...text('answer1')}
            minLength="1"
            placeholder="Answer 1"
          />
        </div>
        <div className="form-group">
          <label htmlFor="answer2" {...label('answer2')}>
            Answer 2
          </label>
          <input
            className="form-control"
            id="answer2"
            {...text('answer2')}
            minLength="1"
            placeholder="Answer 2"
          />
        </div>
        <div className="form-group">
          <label htmlFor="answer3" {...label('answer3')}>
            Answer 3
          </label>
          <input
            className="form-control"
            id="answer3"
            {...text('answer3')}
            minLength="1"
            placeholder="Answer 3"
          />
        </div>
        <div className="form-group">
          <label htmlFor="answer4" {...label('answer4')}>
            Answer 4
          </label>
          <input
            className="form-control"
            id="answer4"
            {...text('answer4')}
            minLength="1"
            placeholder="Answer 4"
          />
        </div>
        <div className="form-group">
          <label htmlFor="answer5" {...label('answer5')}>
            Answer 5
          </label>
          <input
            className="form-control"
            id="answer5"
            {...text('answer5')}
            minLength="1"
            placeholder="Answer 5"
          />
        </div>
        <div className="form-group">
          <label htmlFor="answer6" {...label('answer6')}>
            Answer 6
          </label>
          <input
            className="form-control"
            id="answer6"
            {...text('answer6')}
            minLength="1"
            placeholder="Answer 6"
          />
        </div>
        <div className="form-check">
          <label className="form-check-label" htmlFor="global">
            Global
          </label>
          <br />
          <input
            {...checkbox('global')}
            className="form-check-input"
            id="global"
          />
        </div>
        <br />
        <button type="submit" className="btn btn-primary">
          Add
        </button>
        <br />
        <Link to="/questions">Back</Link>
      </FormStyle>
      {loading && <Spinner disable={true} />}
    </>
  );
};
