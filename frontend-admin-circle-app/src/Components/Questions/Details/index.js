import React, {useState, useEffect, useContext} from 'react';
import {withRouter} from 'react-router-dom';
import fetchGraphQL from '../../../Api/fetchGraphQL';
import Style from '../../Events/Details/style';
import {Context} from '../../../Context';
import {Link} from 'react-router-dom';

export default withRouter(({history}) => {
  const {state} = useContext(Context);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      const response = await fetchGraphQL(
        `{
          questions {
            question
            uuid
            global
          }
        }
        `,
        '',
      );
      // Avoid updating state if the component unmounted before the fetch completes
      if (!isMounted) {
        return;
      }
      setQuestions(response.data.questions);
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [state.token]);

  const addQuestion = () => {
    history.push('/question/add');
  };

  const manageAnswers = () => {
    history.push('/questions/manageanswers');
  };

  return (
    <Style>
      <button className="btn btn-primary" onClick={() => addQuestion()}>
        Add Question
      </button>
      {' '}
      <button className="btn btn-primary" onClick={() => manageAnswers()}>
        Manage Answers
      </button>
      <p></p>
      <div className="list-group">
        {questions ? (
          questions.map((q) => (
            <Link
              className="list-group-item list-group-item-action"
              key={q.uuid}
              to={`/question/${q.uuid}`}
              role="button">
              {q.question} - {'global: ' + q.global}
            </Link>
          ))
        ) : (
          <p>No questions</p>
        )}
      </div>
    </Style>
  );
});
