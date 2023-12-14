import React, {useState, useEffect, useContext, useCallback} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Context} from '../../../../Context';
import fetchGraphQL from '../../../../Api/fetchGraphQL';
import Style from './style';

export default withRouter(({id, history}) => {
  if (!id) {
    history.push('/questions');
  }

  const {state} = useContext(Context);
  const [question, setQuestion] = useState({});

  const fetchData = useCallback(async () => {
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

    setQuestion(response.data.question);
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const deleteQuestion = async () => {
    if (window.confirm(`Are you sure to delete ${id}?`) !== true) {
      return;
    }

    let isMounted = true;
    const response = await fetchGraphQL(
      `mutation {
        deleteQuestion(questionid: "${id}")
      }`,
      '',
      state.token,
    );
    // Avoid updating state if the component unmounted before the fetch completes
    if (!isMounted) {
      return;
    }
    console.log('question', response.data.deleteQuestion);
    history.push('/questions');
  };

  const deleteQuestionAnswer = async (quuid, uuid) => {
    if (window.confirm(`Are you sure to delete ${uuid}?`) !== true) {
      return;
    }

    let isMounted = true;
    const response = await fetchGraphQL(
      `mutation {
        deleteQuestionsAnswer(answerid: "${uuid}")
      }`,
      '',
      state.token,
    );
    // Avoid updating state if the component unmounted before the fetch completes
    if (!isMounted) {
      return;
    }
    console.log('answer', response.data.deleteQuestionsAnswer);
    fetchData();
  };

  return (
    <Style>
      <h1>Question</h1>
      <ul className="list-group">
        <li className="list-group-item">{question.uuid}</li>
        <li className="list-group-item">{question.question} - {'global: ' + question.global}</li>
        {question.answers && question.answers.length > 0 ? (
          question.answers.map((a, i) => (
            <li className="list-group-item" key={a.uuid}>
              {i + 1} - {a.uuid} - {a.answer}
              {state.token ? (
                <button
                  className="badge badge-primary badge-pill float-left"
                  onClick={() => deleteQuestionAnswer(question.uuid, a.uuid)}>
                  Delete Answer
                </button>
              ) : null}
            </li>
          ))
        ) : (
          <li className="list-group-item">
            <p>No answers in this question just yet</p>
          </li>
        )}
        {state.token ? (
          <li className="list-group-item">
            <button
              className="badge badge-primary badge-pill float-left"
              onClick={() => deleteQuestion()}>
              Delete
            </button>
            <Link to={`/question/${question.uuid}/update`}>
              <span className="badge badge-primary badge-pill float-right">
                Update
              </span>
            </Link>
          </li>
        ) : null}
      </ul>
      <Link to="/questions">Back</Link>
    </Style>
  );
});
