import React, {useState, useEffect, useContext} from 'react';
import {withRouter} from 'react-router-dom';
import fetchGraphQL from '../../../Api/fetchGraphQL';
import Style from '../../Events/Details/style';
import {Context} from '../../../Context';
import {Link} from 'react-router-dom';

export default withRouter(({match, history}) => {
  const {id} = match.params;
  if (!id) {
    history.push('/');
  }

  const {state} = useContext(Context);

  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState(null);
  const [questionsEvent, setQuestionsEvent] = useState([]);
  const [hardfilter, setHardFilter] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      const resQ = await fetchGraphQL(
        `{
          questions {
            question
            uuid
          }
        }`,
      );

      return resQ.data.questions;
    };

    const fetchEventQuestions = async () => {
      const resQ = await fetchGraphQL(
        `{
          eventQuestions(eventid: "${id}") {
            eventid
            questionid
            uuid
            hardfilter
          }
        }`,
      );

      // Avoid updating state if the component unmounted before the fetch completes
      if (!isMounted) {
        return;
      }

      const noQGlobals = await fetchData();
      setQuestions(noQGlobals);

      const r = resQ.data.eventQuestions.map((eq) => {
        eq.text = noQGlobals.filter(
          (q) => q.uuid === eq.questionid,
        )[0].question;
        return eq;
      });
      setQuestionsEvent(r);
    };

    fetchEventQuestions();

    return () => {
      isMounted = false;
    };
  }, [id, state.token]);

  const saveData = async () => {
    const resQ = await fetchGraphQL(
      `mutation {
        createEventQuestion(questionid: "${question}", eventid: "${id}", hardfilter: ${hardfilter}) {
          eventid
          questionid
          uuid
        }
      }`,
      '',
      state.token,
    );

    if (!resQ?.data?.createEventQuestion) {
      alert(resQ.errors[0].message);
      return null;
    }
    return [
      resQ.data.createEventQuestion.uuid,
      resQ.data.createEventQuestion.questionid,
    ];
  };

  const selectQuestion = (e) => {
    const value = e.target.value;
    if (value !== 'null') {
      setQuestion(e.target.value);
    } else {
      setQuestion(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question) {
      return;
    }

    const uuid = await saveData();
    if (uuid[0] && uuid[1]) {
      setQuestionsEvent([
        ...questionsEvent,
        {
          uuid: uuid[0],
          text: questions.filter((q) => q.uuid === uuid[1])[0].question,
          hardfilter
        },
      ]);
      setHardFilter(false);
    }
  };

  const deleteMatch = async (e) => {
    const match = await fetchGraphQL(
      `mutation {
        deleteEventQuestion(id: "${e}")
      }`,
      '',
      state.token,
    );
    if (match.data.deleteEventQuestion) {
      history.push('/event/' + id);
    } else {
      alert(match.errors[0].message);
    }
  };

  return (
    <Style>
      <h1>Event Questions</h1>
      <form onSubmit={handleSubmit}>
        <select className="my-1 mr-sm-2" onChange={selectQuestion}>
          <option defaultValue value="null">
            Choose question...
          </option>
          {questions.map((q) => (
            <option key={q.uuid} value={q.uuid}>
              {q.question}
            </option>
          ))}
        </select>{' '}
        hard filter
        <input
          id="hardfilter"
          type="checkbox"
          onChange={() => setHardFilter(!hardfilter)}
        />{' '}
        <button type="submit" className="btn btn-primary" disabled={!question}>
          Add
        </button>
      </form>
      <hr />
      <div className="list-group">
        {questionsEvent.length > 0 ? (
          questionsEvent.map((a) => (
            <div
              className="list-group-item list-group-item-action"
              key={a.uuid}
              role="button">
              {a.text}{' - hardfilter: '}{a.hardfilter?'true':'false'}{' '}
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => deleteMatch(a.uuid)}>
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No questions added yet</p>
        )}
      </div>
      <Link to={'/event/' + id}>Back</Link>
    </Style>
  );
});
