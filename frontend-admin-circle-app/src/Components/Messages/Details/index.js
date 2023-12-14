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

export default withRouter(({id, history}) => {
  if (!id) {
    history.push('/');
  }

  const {state} = useContext(Context);

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      const response = await fetchGraphQL(
        `{
          messagesByAdmin(circleid: "${id}") {
            created
            message
            userid
            user {
              email
              profile {
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

      setMessages(response.data.messagesByAdmin);
    };

    if (isMounted) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [id, state.token]);

  const circles = () => {
    history.push('/circles/all');
  };

  const columns = [
    {
      Header: 'Name',
      accessor: 'user.profile.name',
      sortType: 'basic',
      width: 300,
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
          {row.original.user.email}
        </Link>
      ),
    },
    {
      id: 'created',
      Header: 'Created',
      accessor: 'created',
      width: 200,
      sortType: 'basic',
    },
    {
      id: 'message',
      Header: 'Message',
      accessor: 'message',
      width: 1000,
      sortType: 'basic',
    },
  ];
  return (
    <Style>
      <div>
        <div className="list-group-item">
          <button className="btn btn-primary" onClick={() => circles()}>
            Back to Circles
          </button>
        </div>
        <div>
          {messages ? (
            <Table columns={columns} data={messages} />
          ) : (
            <p>No messages</p>
          )}
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
