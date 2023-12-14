import React, {useState, useEffect, useContext} from 'react';
import {Link, withRouter} from 'react-router-dom';
import moment from 'moment';
import fetchGraphQL from '../../../Api/fetchGraphQL';
import Style from '../../Event/Details/style';
import Photo from './style';
import {Context} from '../../../Context';

const districts = [
  {label: 'Select District', value: 'Select District'},
  {label: 'Mitte', value: 'Mitte'},
  {label: 'Friedrichshain-Kreuzberg', value: 'Friedrichshain-Kreuzberg'},
  {label: 'Pankow', value: 'Pankow'},
  {label: 'Charlottenburg-Wilmersdorf', value: 'Charlottenburg-Wilmersdorf'},
  {label: 'Spandau', value: 'Spandau'},
  {label: 'Steglitz-Zehlendorf', value: 'Steglitz-Zehlendorf'},
  {label: 'Tempelhof-Schöneberg', value: 'Tempelhof-Schöneberg'},
  {label: 'Neukölln', value: 'Neukölln'},
  {label: 'Treptow-Köpenick', value: 'Treptow-Köpenick'},
  {label: 'Marzahn-Hellersdorf', value: 'Marzahn-Hellersdorf'},
  {label: 'Lichtenberg', value: 'Lichtenberg'},
  {label: 'Reinickendorf', value: 'Reinickendorf'},
];

export default withRouter(({id, history}) => {
  if (!id) {
    history.push('/');
  }

  const [user, setUser] = useState({});
  const [profile, setProfile] = useState({});
  const [interests, setInterest] = useState([]);
  const [admin, setAdmin] = useState(false);
  const [nameRejected, setNameRejected] = useState(false);
  const [photoRejected, setPhotoRejected] = useState(false);
  const [dobRejected, setDOBRejected] = useState(false);
  const [questionsRejected, setQuestionsRejected] = useState(false);
  const [interestsRejected, setInterestsRejected] = useState(false);
  const [districtRejected, setDistrictRejected] = useState(false);
  const timeFormat = 'dddd, MMMM Do YYYY, HH:mm:ss';
  const {state} = useContext(Context);

  useEffect(() => {
    let isUserMounted = true;

    const fetchData = async () => {
      const response = await fetchGraphQL(
        `{
          userByAdmin(userid: "${id}") {
            userid
            email
            created
            updated
            emailverified
            profile {
              ageday
              agemonth
              ageyear
              admin
              name
              photo
              phoneprefix
              phone
              fcmtoken
              newsupdate
              login
              district
              profession
              adminrejectedname
              adminrejecteddob
              adminrejectedphoto
              adminrejectedinterests
              adminrejectedquestions
              adminrejecteddistrict
              pushnotificationswitch
              emailsswitch
              logged
              platform
              build
            }
            userinterest {
              interest {
                name
              }
            }
          }
        }`,
        '',
        state.token,
      );

      // Avoid updating state if the component unmounted before the fetch completes
      if (!isUserMounted) {
        return;
      }

      const data = response.data.userByAdmin;
      data.created = moment
        .utc(new Date(data.created))
        .local()
        .format(timeFormat);
      data.updated = moment
        .utc(new Date(data.updated))
        .local()
        .format(timeFormat);
      setUser(data);
      setProfile(data.profile);
      // console.log(data.profile);
      setInterest(data.userinterest);
      setAdmin(data.profile.admin);
      setNameRejected(data.profile.adminrejectedname);
      setPhotoRejected(data.profile.adminrejectedphoto);
      setDOBRejected(data.profile.adminrejecteddob);
      setQuestionsRejected(data.profile.adminrejectedquestions);
      setInterestsRejected(data.profile.adminrejectedinterests);
      setDistrictRejected(data.profile.adminrejecteddistrict);
    };

    fetchData();

    return () => {
      isUserMounted = false;
    };
  }, [id, state.token]);

  const adminToggle = async () => {
    setAdmin(!admin);

    const res = await fetchGraphQL(
      `mutation {updateUserAdminByAdmin(userid: "${user.userid}", 
        admin: ${!admin})}`,
      '',
      state.token,
    );

    if (!res || !res.data || !res.data.updateUserAdminByAdmin) {
      alert('There was a problem changing admin value');
    }
  };

  const adminRejectedSave = async () => {
    if (!user.userid) {
      return;
    }

    // console.log(`mutation {
    //   updateUserAdminRejectedByAdmin(userid: "${user.userid}",
    //   adminrejectedname: ${nameRejected},
    //   adminrejecteddob: ${dobRejected},
    //   adminrejectedphoto: ${photoRejected},
    //   adminrejectedinterests: ${interestsRejected},
    //   adminrejectedquestions: ${questionsRejected},
    //   adminrejecteddistrict: ${districtRejected}
    // )
    // }`);

    const res = await fetchGraphQL(
      `mutation {
          updateUserAdminRejectedByAdmin(userid: "${user.userid}",
          adminrejectedname: ${nameRejected},
          adminrejecteddob: ${dobRejected},
          adminrejectedphoto: ${photoRejected},
          adminrejectedinterests: ${interestsRejected},
          adminrejectedquestions: ${questionsRejected},
          adminrejecteddistrict: ${districtRejected}
      )}`,
      '',
      state.token,
    );

    if (!res || !res.data || !res.data.updateUserAdminRejectedByAdmin) {
      alert('There was a problem changing admin rejected value');
    } else {
      alert('Saved.');
    }
  };

  return (
    <Style>
      <h1>User</h1>
      <ul className="list-group">
        <li className="list-group-item">
          <b>id:</b> {user.userid}
        </li>
        <li className="list-group-item">
          <b>platform:</b> {profile.platform} <b>build:</b> {profile.build}
        </li>
        <li className="list-group-item">
          <b>name:</b> {profile.name}
        </li>
        <li className="list-group-item">
          <b>email:</b> {user.email}
        </li>
        <li className="list-group-item">
          <b>email verified:</b> {user.emailverified ? 'YES' : 'NO'}
        </li>
        <li className="list-group-item">
          <b>age:</b>{' '}
          {profile.ageday + '/' + profile.agemonth + '/' + profile.ageyear}
        </li>
        <li className="list-group-item">
          <b>prefix:</b> {profile.phoneprefix} <b>phone:</b> {profile.phone}
        </li>
        <li className="list-group-item">
          <b>profession:</b> {profile.profession}
        </li>
        <li className="list-group-item">
          <b>district:</b>{' '}
          {profile.district ? districts[profile.district].label : ''}
        </li>
        <li className="list-group-item">FcmToken: {profile.fcmtoken}</li>
        <li className="list-group-item">
          NewsUpdate: {profile.newsupdate ? 'YES' : 'NO'} <br />
          Push notification switch:{' '}
          {profile.pushnotificationswitch ? 'YES' : 'NO'}
          <br />
          Emails switch: {profile.emailsswitch ? 'YES' : 'NO'} <br />
          Logged: {profile.logged ? 'YES' : 'NO'}
        </li>
        <li className="list-group-item">
          <b>interests:</b>
          {interests.map((i) => i.interest.name + ',')}
        </li>
        <li className="list-group-item">
          <b>admin rejected:</b> Name:
          <input
            type="checkbox"
            checked={nameRejected}
            onChange={() => {
              setNameRejected(!nameRejected);
            }}
          />{' '}
          Photo:
          <input
            type="checkbox"
            checked={photoRejected}
            onChange={() => {
              setPhotoRejected(!photoRejected);
            }}
          />{' '}
          DOB:
          <input
            type="checkbox"
            checked={dobRejected}
            onChange={() => {
              setDOBRejected(!dobRejected);
            }}
          />{' '}
          Questions:
          <input
            type="checkbox"
            checked={questionsRejected}
            onChange={() => {
              setQuestionsRejected(!questionsRejected);
            }}
          />{' '}
          Intereses:
          <input
            type="checkbox"
            checked={interestsRejected}
            onChange={() => {
              setInterestsRejected(!interestsRejected);
            }}
          />{' '}
          District:
          <input
            type="checkbox"
            checked={districtRejected}
            onChange={() => {
              setDistrictRejected(!districtRejected);
            }}
          />{' '}
          <button onClick={adminRejectedSave}>Save</button>
        </li>
        <li className="list-group-item">
          admin:
          <input type="checkbox" checked={admin} onChange={adminToggle} />
        </li>
        <li className="list-group-item">
          <b>Created:</b> {user.created}
        </li>
        <li className="list-group-item">
          <b>Updated:</b> {user.updated}
        </li>
        <li className="list-group-item">
          <b>Login:</b> {profile.login}
        </li>
        {profile.photo ? (
          <li className="list-group-item">
            photo:{' '}
            <Photo
              src={profile.photo}
              className="card-img-top"
              alt={user.name}
            />
            <br />
            {profile.photo}
          </li>
        ) : null}
      </ul>
      <Link to="/users">Back</Link>
    </Style>
  );
});
