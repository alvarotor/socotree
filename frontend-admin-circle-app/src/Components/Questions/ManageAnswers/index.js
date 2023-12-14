import React, {useState, useEffect, useContext} from 'react';
import {withRouter} from 'react-router-dom';
import fetchGraphQL from '../../../Api/fetchGraphQL';
import Style from '../../Events/Details/style';
import {Context} from '../../../Context';
import {Link} from 'react-router-dom';

export default withRouter(({history}) => {
  const {state} = useContext(Context);

  // eslint-disable-next-line
  const [answerMatches, setAnswerMatches] = useState([]);
  const [questions1, setQuestions1] = useState([]);
  const [questions2, setQuestions2] = useState([]);
  // eslint-disable-next-line
  const [question1, setQuestion1] = useState('');
  const [answers1, setAnswers1] = useState([]);
  const [answer1, setAnswer1] = useState('');
  // eslint-disable-next-line
  const [question2, setQuestion2] = useState('');
  const [answers2, setAnswers2] = useState([]);
  const [answer2, setAnswer2] = useState('');
  const [weigth, setWeigth] = useState(1);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      const resQ = await fetchGraphQL(
        `{
          questions {
            question
            uuid
            global
            answers {
              answer
              uuid
            }
          }
        }`,
        '',
      );

      const resA = await fetchGraphQL(
        `{
            readEventAnswersMatches {
              uuid
              eventanswerid1
              eventanswerid2
              weight
            }
          }`,
        '',
        state.token,
      );

      // Avoid updating state if the component unmounted before the fetch completes
      if (!isMounted) {
        return;
      }

      const noQGlobals = resQ.data.questions.filter((q) => !q.global);
      setQuestions1(noQGlobals);

      if (noQGlobals.length > 0) {
        const a = resA.data.readEventAnswersMatches.map((r) => {
          console.log(
            noQGlobals
              .map((q) =>
                q.answers.filter((ans) => ans.uuid === r.eventanswerid2),
              )
              .filter((ans) => ans.length > 0)[0][0].answer,
          );
          const answer1 = noQGlobals
            .map((q) =>
              q.answers.filter((ans) => ans.uuid === r.eventanswerid1),
            )
            .filter((ans) => ans.length > 0)[0][0].answer;
          const answer2 = noQGlobals
            .map((q) =>
              q.answers.filter((ans) => ans.uuid === r.eventanswerid2),
            )
            .filter((ans) => ans.length > 0)[0][0].answer;
          r.answer1 = answer1;
          r.answer2 = answer2;
          return r;
        });

        setAnswerMatches(a);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [state.token]);

  const saveData = async (ea1, ea2, w) => {
    const match = await fetchGraphQL(
      `mutation {
        createEventAnswersMatch(eventanswerid1: "${ea1}", eventanswerid2: "${ea2}", weight: ${w})
      }`,
      '',
      state.token,
    );
    if (match.data.createEventAnswersMatch) {
      history.push('/questions');
    } else {
      alert(match.errors[0].message);
    }
  };

  const selectQuestion1 = (e) => {
    setQuestion1(e.target.value);
    setAnswers1(questions1.filter((q) => q.uuid === e.target.value)[0].answers);
  };

  const selectAsnwer1 = (e) => {
    setAnswer1(e.target.value);
    setQuestions2(questions1);
  };

  const selectQuestion2 = (e) => {
    setQuestion2(e.target.value);
    setAnswers2(questions2.filter((q) => q.uuid === e.target.value)[0].answers);
  };

  const selectAsnwer2 = (e) => {
    setAnswer2(e.target.value);
  };

  const selectWeigth = (e) => {
    setWeigth(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(question1);
    // console.log(question2);
    // console.log(answer1);
    // console.log(answer2);
    // console.log(weigth);
    saveData(answer1, answer2, weigth);
  };

  const deleteMatch = async (e) => {
    const match = await fetchGraphQL(
      `mutation {
        deleteEventAnswersMatch(id: "${e}")
      }`,
      '',
      state.token,
    );
    if (match.data.deleteEventAnswersMatch) {
      history.push('/questions');
    } else {
      alert(match.errors[0].message);
    }
  };

  return (
    <Style>
      <h1>Manage Answers</h1>
      <div className="list-group">
        {answerMatches.length > 0 ? (
          answerMatches.map((a) => (
            <div
              className="list-group-item list-group-item-action"
              key={a.uuid}
              role="button">
              {a.uuid} - {a.answer1} - {a.answer2} - {a.weight} -{' '}
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
      <hr />
      <form onSubmit={handleSubmit}>
        <select className="my-1 mr-sm-2" onChange={selectQuestion1}>
          <option defaultValue>Choose question 1...</option>
          {questions1.map((q) => (
            <option key={q.uuid} value={q.uuid}>
              {q.question}
            </option>
          ))}
        </select>
        <select className="my-1 mr-sm-2" onChange={selectAsnwer1}>
          <option defaultValue>Choose answer...</option>
          {answers1.map((a) => (
            <option key={a.uuid} value={a.uuid}>
              {a.answer}
            </option>
          ))}
        </select>
        <br />
        <select className="my-1 mr-sm-2" onChange={selectQuestion2}>
          <option defaultValue>Choose question 2...</option>
          {questions2.map((q) => (
            <option key={q.uuid} value={q.uuid}>
              {q.question}
            </option>
          ))}
        </select>
        <select className="my-1 mr-sm-2" onChange={selectAsnwer2}>
          <option defaultValue>Choose answer...</option>
          {answers2.map((a) => (
            <option key={a.uuid} value={a.uuid}>
              {a.answer}
            </option>
          ))}
        </select>
        <br />
        <div className="form-group">
          <label htmlFor="weight">Weight</label>
          <input
            className="form-control"
            id="weight"
            required
            type="number"
            aria-describedby="weightHelp"
            defaultValue="1"
            onChange={selectWeigth}
          />
          <small id="weightHelp" className="form-text text-muted">
            Float number, 1 by default.
          </small>
        </div>
        <br />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!answer1 || !answer2 || !weigth}>
          Add
        </button>
      </form>
      <br />
      <Link to="/questions">Back</Link>
    </Style>
  );
});
