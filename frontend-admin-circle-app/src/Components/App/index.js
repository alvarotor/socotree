import React, {useContext} from 'react';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import {Context} from '../../Context';
import GlobalStyle from './styleGlobal';
import Header from '../Header';
import NotFound from '../NotFoundPage';
import Events from '../Events';
import Event from '../Event';
import FormAdd from '../FormAdd';
import FormUpdate from '../FormUpdate';
import Users from '../Users';
import User from '../User';
import Login from '../Login';
import Circles from '../Circles';
import CirclesAll from '../CirclesAll';
import Questions from '../Questions';
import Question from '../Questions/Question';
import QuestionAdd from '../Questions/QuestionAdd';
import QuestionUpdate from '../Questions/QuestionUpdate';
import EventsQuestions from '../Event/Questions';
import QuestionManageAnswers from '../Questions/ManageAnswers';
import Interests from '../Interests';
import Interest from '../Interests/Interest';
import InterestAdd from '../Interests/InterestAdd';
import InterestUpdate from '../Interests/InterestUpdate';
import CircleMessages from '../Messages';
import Versions from '../Versions';
import VersionsUpdate from '../Versions/Update';
import EventUploadPicture from '../EventUploadPicture';

const PrivateRoute = ({component: Component, ...rest}) => {
  const {state} = useContext(Context);
  return (
    <Route
      {...rest}
      render={(props) =>
        state.token ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
            }}
          />
        )
      }
    />
  );
};

function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <Header />
      <Switch>
        <Route exact path="/" component={Login} />
        <PrivateRoute path="/events/:id/questions" component={EventsQuestions} />
        <Route path="/events" component={Events} />
        <PrivateRoute path="/add" component={FormAdd} />
        <PrivateRoute path="/users" component={Users} />
        <Route path="/login" component={Login} />
        <PrivateRoute path="/questions/manageanswers" component={QuestionManageAnswers} />
        <Route path="/questions" component={Questions} />
        <PrivateRoute path="/question/add" component={QuestionAdd} />
        <PrivateRoute path="/question/:id/update" component={QuestionUpdate} />
        <PrivateRoute path="/question/:id/update" component={QuestionUpdate} />
        <Route path="/question/:id" component={Question} />
        <PrivateRoute path="/interests" component={Interests} />
        <PrivateRoute path="/interest/add" component={InterestAdd} />
        <PrivateRoute path="/interest/:id/update" component={InterestUpdate} />
        <PrivateRoute path="/interest/:id" component={Interest} />
        <PrivateRoute path="/user/:id" component={User} />
        <PrivateRoute path="/update/:id" component={FormUpdate} />
        <PrivateRoute path="/eventuploadpicture" component={EventUploadPicture} />
        <PrivateRoute path="/circles/all" component={CirclesAll} />
        <PrivateRoute path="/circles" component={Circles} />
        <PrivateRoute path="/versions/update" component={VersionsUpdate} />
        <Route path="/versions" component={Versions} />
        <Route path="/event/:id" component={Event} />
        <PrivateRoute path="/circle/messages/:id" component={CircleMessages} />
        <Route path="" component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
