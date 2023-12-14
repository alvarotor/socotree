import React, {useState, useEffect, useContext} from 'react';
import {withRouter} from 'react-router-dom';
import fetchGraphQL from '../../../Api/fetchGraphQL';
import Style from './style';
import {Context} from '../../../Context';
import {Link} from 'react-router-dom';
import {
  useTable,
  useAbsoluteLayout,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
} from 'react-table';
import Spinner from '../../Spinner';

export default withRouter(({history}) => {
  const [circles, setCircles] = useState([]);
  const {state} = useContext(Context);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      const response = await fetchGraphQL(
        `{
          circlesByAdmin {
            eventid
            event {
              name
            }
            circleid
            created
            numbermessages
            user {
              userid
              email
              profile {
                name
              }
            }
          }
        }
        `,
        '',
        state.token,
      );

      // Avoid updating state if the component unmounted before the fetch completes
      if (!isMounted) {
        return;
      }

      var output = [];
      response.data.circlesByAdmin.forEach(function (item) {
        var existing = output.filter((v, i) => v.circleid === item.circleid);
        if (existing.length) {
          var existingIndex = output.indexOf(existing[0]);
          const newUsers = [item.user];
          output[existingIndex].users = output[existingIndex].users.concat(
            newUsers,
          );
        } else {
          const users = [item.user];
          output.push({
            eventid: item.eventid,
            event: item.event.name,
            circleid: item.circleid,
            users,
            numbermessages: item.numbermessages,
            created: item.created,
          });
        }
      });

      setCircles(output);
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [state.token]);

  const deleteCircle = async (id) => {
    var r = window.confirm(`Are you sure to delete circle ${id}?`);
    if (r !== true) {
      return;
    }

    const res = await fetchGraphQL(
      `mutation {
        deleteCircleByAdmin(circleId:"${id}")
      }`,
      '',
      state.token,
    );

    if (!res || !res.data || !res.data.deleteCircleByAdmin) {
      alert(res.data.errors[0].message);
    } else {
      alert(
        'Gone! the list of circles is not refreshed yet, just go to another page and come back',
      );
    }
  };

  const makeCircle = () => {
    history.push('/circles');
  };

  const messagesCircle = (id) => {
    history.push('/circle/messages/' + id);
  };

  const getNames = (circle) => {
    const names = [];
    for (let index = 0; index < circle.users.length; index++) {
      names.push(circle.users[index].profile.name);
    }
    return names.toString();
  };

  const columns = [
    {
      Header: 'Event',
      sortType: 'basic',
      width: 340,
      Cell: ({row}) => (
        <Link to={`/event/${row.original.eventid}`} role="button">
          {row.original.event}
        </Link>
      ),
    },
    {
      Header: 'Circle ID',
      accessor: 'circleid',
      sortType: 'basic',
      width: 340,
    },
    {
      Header: 'Date Created',
      accessor: 'created',
      sortType: 'basic',
      width: 170,
    },
    {
      Header: 'Users',
      accessor: (d) => getNames(d),
      sortType: 'basic',
      width: 300,
      Cell: ({row}) => {
        return row.original.users.map((user, i) => (
          <Link key={i} to={`/user/${user.userid}`} role="button">
            {row.original.users.length === i + 1
              ? user.profile.name
              : user.profile.name + ', '}
          </Link>
        ));
      },
    },
    {
      Header: 'Num',
      accessor: (d) => d.users.length,
      sortType: 'basic',
      width: 70,
    },
    {
      id: 'deleteCircle',
      Header: ' ',
      sortable: false,
      filterable: false,
      width: 120,
      Cell: ({row}) => (
        <button
          className="btn btn-primary"
          onClick={() => deleteCircle(row.original.circleid)}>
          Delete Circle
        </button>
      ),
    },
    {
      id: 'messagesCircle',
      Header: ' ',
      sortable: false,
      filterable: false,
      width: 110,
      Cell: ({row}) => (
        <button
          className="btn btn-primary"
          onClick={() => messagesCircle(row.original.circleid)}>
          Messages
        </button>
      ),
    },
    {
      id: 'messagesNumber',
      Header: 'Mess',
      accessor: (d) => d.numbermessages,
      sortType: 'basic',
      width: 70,
    },
  ];

  return (
    <Style>
      <div>
        <div className="list-group-item">
          <button className="btn btn-primary" onClick={() => makeCircle()}>
            See people
          </button>
        </div>
        <div>
          <Table columns={columns} data={circles} />
          {circles.length === 0 ? <Spinner /> : null}
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

      <div className="header">
        {headerGroups.map((headerGroup, i) => (
          <div
            {...headerGroup.getHeaderGroupProps()}
            className="header-row  "
            key={i}>
            {headerGroup.headers.map((column, j) => (
              <div key={j} className="header">
                <div
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="header-cell header">
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
            <div {...row.getRowProps()} className="row body">
              {row.cells.map((cell, index) => (
                <div {...cell.getCellProps()} key={index} className="cell">
                  {cell.render('Cell')}
                </div>
              ))}
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
