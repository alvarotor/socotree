import React, {useState, useEffect, useContext} from 'react';
import {withRouter} from 'react-router-dom';
import fetchGraphQL from '../../../Api/fetchGraphQL';
import {Link} from 'react-router-dom';
import {Context} from '../../../Context';
import Style from './style';
import {
  useTable,
  useAbsoluteLayout,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
} from 'react-table';
import {
  circleMe,
  makeCircle,
  joinUsers,
  circles,
  matchCircles,
  notifyCircles,
} from './core';
import Spinner from '../../Spinner';

export default withRouter(({history}) => {
  const [users, setUsers] = useState([]);
  const [circle, setCircle] = useState([]);
  const [sending, setSending] = useState(false);
  const [addrestusers, setAddRestUsers] = useState(false);
  const [recircle, setReCircle] = useState(false);
  const [age, setAge] = useState(false);
  const [prematch, setPrematch] = useState(false);
  const [circlesize, setCircleSize] = useState(false);
  const [lang, setLang] = useState(false);
  const [events, setEvents] = useState([]);
  const [questionsweight, setQuestionswWeight] = useState(0);
  const [event, setEvent] = useState('');
  const {state} = useContext(Context);

  const districts = [
    {label: 'Select District', value: 'No district'},
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

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      const res = await fetchGraphQL(
        `{
          events(filterOlds:true) {
            uuid
            name
            eventtime {
              year
            }
          }
        }`,
      );

      // Avoid updating state if the component unmounted before the fetch completes
      if (!isMounted) {
        return;
      }

      if (res.data.errors?.length > 0) {
        alert(res.data.errors[0].message);
      } else {
        // console.log(res.data.events);
        setEvents(res.data.events.reverse());
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      const response = await fetchGraphQL(
        `{
          usersByAdmin {
            userid
            email
            profile {
              name
              ageday
              agemonth
              ageyear
              district
              adminrejectedname
              adminrejecteddob
              adminrejectedphoto
              adminrejectedinterests
              adminrejectedquestions
              adminrejecteddistrict
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
      if (!isMounted) {
        return;
      }

      setUsers(response.data.usersByAdmin);
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [state.token]);

  const selectEvent = (event) => {
    setEvent(event.target.value);
  };

  const selectCircleSize = (event) => {
    setCircleSize(event.target.value);
  };

  const matchCirclesNow = () => {
    matchCircles(
      history,
      setSending,
      addrestusers,
      questionsweight,
      recircle,
      age,
      prematch,
      lang,
      circlesize,
      event,
    );
  };

  const columns = [
    {
      Header: 'Name',
      accessor: 'profile.name',
      sortType: 'basic',
      width: 250,
    },
    {
      Header: 'Email',
      accessor: 'email',
      sortType: 'basic',
      width: 300,
      id: 'eLink',
      Cell: ({row}) => (
        <Link
          key={row.original.userid}
          to={`/user/${row.original.userid}`}
          role="button">
          {row.original.email}
        </Link>
      ),
    },
    {
      id: 'district',
      Header: 'District',
      accessor: (d) => districts[d.profile.district].value,
      width: 220,
      sortType: 'basic',
    },
    {
      id: 'age',
      Header: 'Age',
      accessor: (d) =>
        d.profile.ageyear +
        '/' +
        ('0' + d.profile.agemonth).slice(-2) +
        '/' +
        ('0' + d.profile.ageday).slice(-2),
      width: 100,
      sortType: 'basic',
    },
    {
      id: 'interests',
      Header: 'Interests',
      accessor: (d) => d.userinterest.map((i) => i.interest.name).join(', '),
      width: 300,
      sortType: 'basic',
    },
    {
      id: 'CheckBox',
      Header: ' ',
      sortable: false,
      filterable: false,
      width: 150,
      Cell: ({row}) => {
        // if (row.original.email==='alvaro@socotree.io')
        // console.log( row.original.profile.name.length === 0 ,
        //   row.original.profile.ageday < 1 ,
        //   row.original.profile.agemonth < 1 ,
        //   row.original.profile.ageyear < 1 ,
        //   row.original.profile.district === 0 ,
        //   row.original.profile.adminrejectedname ,
        //   row.original.profile.adminrejecteddob ,
        //   row.original.profile.adminrejectedphoto ,
        //   row.original.profile.adminrejectedinterests ,
        //   row.original.profile.adminrejectedquestions ,
        //   row.original.profile.adminrejecteddistrict)
        return (
          <input
            type="checkbox"
            defaultChecked={
              circle.filter((c) => row.original.userid === c).length > 0
                ? true
                : false
            }
            onChange={() => circleMe(row.original.userid, circle, setCircle)}
            disabled={
              row.original.profile.name.length === 0 ||
              row.original.profile.ageday < 1 ||
              row.original.profile.agemonth < 1 ||
              row.original.profile.ageyear < 1 ||
              row.original.profile.district === 0 ||
              row.original.profile.adminrejectedname ||
              row.original.profile.adminrejecteddob ||
              row.original.profile.adminrejectedphoto ||
              row.original.profile.adminrejectedinterests ||
              row.original.profile.adminrejectedquestions ||
              row.original.profile.adminrejecteddistrict
            }
          />
        );
      },
    },
  ];

  return (
    <Style>
      <div>
        <div className="list-group-item">
          <button
            className="btn btn-primary"
            onClick={() =>
              makeCircle(circle, setSending, state.token, setCircle, event)
            }
            disabled={sending}>
            Make Circle
          </button>{' '}
          <button className="btn btn-default" onClick={() => circles(history)}>
            All Circles
          </button>
        </div>
        <div className="list-group-item">
          <select className="my-1 mr-sm-2" onChange={selectEvent}>
            <option defaultValue>Choose...</option>
            {events.map((event) => (
              <option key={event.uuid} value={event.uuid}>
                {event.name}
              </option>
            ))}
          </select>
          <button
            className="btn btn-primary"
            onClick={() =>
              joinUsers(circle, setSending, state.token, setCircle, event)
            }
            disabled={sending}>
            Join users
          </button>
        </div>
        <div className="list-group-item">
          add rest users{' '}
          <input
            type="checkbox"
            disabled={sending}
            onChange={() => setAddRestUsers(!addrestusers)}
          />{' '}
          re circle{' '}
          <input
            type="checkbox"
            disabled={sending}
            onChange={() => setReCircle(!recircle)}
          />{' '}
          age{' '}
          <input
            type="checkbox"
            disabled={sending}
            onChange={() => setAge(!age)}
          />{' '}
          pre matched{' '}
          <input
            type="checkbox"
            disabled={sending}
            onChange={() => setPrematch(!prematch)}
          />{' '}
          lang question{' '}
          <input
            type="checkbox"
            disabled={sending}
            onChange={() => setLang(!lang)}
          />{' '}
          circle size{' '}
          <select
            className="my-1 mr-sm-2"
            onChange={selectCircleSize}
            disabled={sending}
            defaultValue="2">
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
          questions weight{' '}
          <input
            style={{width: '50px'}}
            type="number"
            disabled={sending}
            onChange={(e) => setQuestionswWeight(e.target.value)}
          />
          <br />
          <button
            className="btn btn-primary"
            onClick={() => matchCirclesNow()}
            disabled={sending}>
            Match Circles
          </button>{' '}
          <button
            className="btn btn-primary"
            onClick={() => notifyCircles(state.token, setSending, event)}
            disabled={sending}>
            Notify Circles by event
          </button>
        </div>
        <div>
          {users ? <Table columns={columns} data={users} /> : <p>No users</p>}
          {users.length === 0 ? <Spinner /> : null}
        </div>
      </div>
    </Style>
  );
});

function Table({columns, data}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    preGlobalFilteredRows,
    setGlobalFilter,
    visibleColumns,
    state,
  } = useTable(
    {
      columns,
      data,
    },
    useAbsoluteLayout,
    useFilters,
    useGlobalFilter,
    useSortBy,
  );

  // Render the UI for your table
  return (
    <div {...getTableProps()} className="table">
      <div colSpan={visibleColumns.length} className="searchFiled">
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      </div>

      <div className="headerColumn">
        {headerGroups.map((headerGroup, i) => (
          <div
            {...headerGroup.getHeaderGroupProps()}
            className="row header-group"
            key={i}>
            {headerGroup.headers.map((column, j) => (
              <div key={j}>
                <div
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="cell header">
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="rows" {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <div {...row.getRowProps()} className="row body" key={i}>
              {row.cells.map((cell, index) => {
                // console.log(cell, index)
                return (
                  <div
                    {...cell.getCellProps()}
                    key={index}
                    className={index === 4 ? 'cell minfont' : 'cell'}>
                    {cell.render('Cell')}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GlobalFilter({preGlobalFilteredRows, globalFilter, setGlobalFilter}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <span>
      Search:{' '}
      <input
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
        style={{
          fontSize: '1.1rem',
          border: '1',
          width: '700px',
        }}
      />
    </span>
  );
}
