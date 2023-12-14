import React, {useEffect, useContext} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {useFormState} from 'react-use-form-state';
import {Context} from '../../../../Context';
import fetchGraphQL from '../../../../Api/fetchGraphQL';
import FormStyle from './style';

export default withRouter(({id, history}) => {
  if (!id) {
    history.push('/');
  }

  const {state} = useContext(Context);
  let [formState, {label, text, checkbox}] = useFormState();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchGraphQL(
        `{
          question(questionid: "${id}") {
            answers {
              answer
              uuid
            }
            question
            uuid
            global
          }
        }`,
      );

      const {question, answers, global} = response.data.question;

      formState.setField('question', question);
      formState.setField(
        'answer1',
        answers.length >= 1 ? answers[0].answer : '',
      );
      formState.setField(
        'answer2',
        answers.length >= 2 ? answers[1].answer : '',
      );
      formState.setField(
        'answer3',
        answers.length >= 3 ? answers[2].answer : '',
      );
      formState.setField(
        'answer4',
        answers.length >= 4 ? answers[3].answer : '',
      );
      formState.setField(
        'answer5',
        answers.length >= 5 ? answers[4].answer : '',
      );
      formState.setField(
        'answer6',
        answers.length >= 6 ? answers[5].answer : '',
      );
      formState.setField(
        'idanswer1',
        answers.length >= 1 ? answers[0].uuid : '',
      );
      formState.setField(
        'idanswer2',
        answers.length >= 2 ? answers[1].uuid : '',
      );
      formState.setField(
        'idanswer3',
        answers.length >= 3 ? answers[2].uuid : '',
      );
      formState.setField(
        'idanswer4',
        answers.length >= 4 ? answers[3].uuid : '',
      );
      formState.setField(
        'idanswer5',
        answers.length >= 5 ? answers[4].uuid : '',
      );
      formState.setField(
        'idanswer6',
        answers.length >= 6 ? answers[5].uuid : '',
      );
      formState.setField('global', global);
    };

    fetchData();
  }, [formState, id]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (formState.errors.constructor === Object && checkNoErrors()) {
      const {
        question,
        answer1,
        answer2,
        answer3,
        answer4,
        answer5,
        answer6,
        global,
        idanswer1,
        idanswer2,
        idanswer3,
        idanswer4,
        idanswer5,
        idanswer6,
      } = formState.values;

      await fetchGraphQL(
        `mutation {
          updateQuestion(
            questionid: "${id}", 
            question: "${question}",
            global:${global}
          ) 
        }`,
        '',
        state.token,
      );

      if (answer1) {
        await updateAnswer(idanswer1, answer1);
      }
      if (answer2) {
        await updateAnswer(idanswer2, answer2);
      }
      if (answer3) {
        await updateAnswer(idanswer3, answer3);
      }
      if (answer4) {
        await updateAnswer(idanswer4, answer4);
      }
      if (answer5) {
        await updateAnswer(idanswer5, answer5);
      }
      if (answer6) {
        await updateAnswer(idanswer6, answer6);
      }

      history.push('/question/' + id);
    }
  }

  const updateAnswer = async (id, answer) => {
    // console.log(id, answer)
    await fetchGraphQL(
      `mutation {
        updateQuestionsAnswer(
          answerid: "${id}", 
          answer: "${answer}"
        ) 
      }`,
      '',
      state.token,
    );
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
      <h1>Update this question</h1>
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
        <div
          className={
            formState.values.answer1 ? 'form-group' : 'form-group invisible'
          }>
          <label htmlFor="answer1" {...label('answer1')}>
            Answer 1
          </label>
          <input id="idanswer1" {...text('idanswer1')} type="hidden" />
          <input
            className="form-control"
            id="answer1"
            {...text('answer1')}
            minLength="1"
            placeholder="Answer 1"
          />
        </div>
        <div
          className={
            formState.values.answer2 ? 'form-group' : 'form-group invisible'
          }>
          <label htmlFor="answer2" {...label('answer2')}>
            Answer 2
          </label>
          <input id="idanswer2" {...text('idanswer2')} type="hidden" />
          <input
            className="form-control"
            id="answer2"
            {...text('answer2')}
            minLength="1"
            placeholder="Answer 2"
          />
        </div>
        <div
          className={
            formState.values.answer3 ? 'form-group' : 'form-group invisible'
          }>
          <label htmlFor="answer3" {...label('answer3')}>
            Answer 3
          </label>
          <input id="idanswer3" {...text('idanswer3')} type="hidden" />
          <input
            className="form-control"
            id="answer3"
            {...text('answer3')}
            minLength="1"
            placeholder="Answer 3"
          />
        </div>
        <div
          className={
            formState.values.answer4 ? 'form-group' : 'form-group invisible'
          }>
          <label htmlFor="answer4" {...label('answer4')}>
            Answer 4
          </label>
          <input id="idanswer4" {...text('idanswer4')} type="hidden" />
          <input
            className="form-control"
            id="answer4"
            {...text('answer4')}
            minLength="1"
            placeholder="Answer 4"
          />
        </div>
        <div
          className={
            formState.values.answer5 ? 'form-group' : 'form-group invisible'
          }>
          <label htmlFor="answer5" {...label('answer5')}>
            Answer 5
          </label>
          <input id="idanswer5" {...text('idanswer5')} type="hidden" />
          <input
            className="form-control"
            id="answer5"
            {...text('answer5')}
            minLength="1"
            placeholder="Answer 5"
          />
        </div>
        <div
          className={
            formState.values.answer6 ? 'form-group' : 'form-group invisible'
          }>
          <label htmlFor="answer6" {...label('answer6')}>
            Answer 6
          </label>
          <input id="idanswer6" {...text('idanswer6')} type="hidden" />
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
          <input id="idglobal" {...text('idglobal')} type="hidden" />
          <input
            {...checkbox('global')}
            className="form-check-input"
            id="global"
          />
        </div>
        <br />
        <button type="submit" className="btn btn-primary">
          Update
        </button>
        <br />
        <Link to={`/question/${id}`}>Back to question</Link>
      </FormStyle>
    </>
  );
});
