import React, {useState, useEffect, useContext} from 'react';
import {Link} from 'react-router-dom';
import fetchGraphQL from '../../../Api/fetchGraphQL';
import Style from './style';
import {Context} from '../../../Context';
import {
  useTable,
  useAbsoluteLayout,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
} from 'react-table';
import Spinner from '../../Spinner';

export default () => {
  const [users, setUsers] = useState([]);
  const {state} = useContext(Context);

  useEffect(() => {
    let isMounted = true;

    function compare(a, b) {
      if (a.profile.updated < b.profile.updated) {
        return 1;
      }
      if (a.profile.updated > b.profile.updated) {
        return -1;
      }
      return 0;
    }

    const fetchData = async () => {

      const response = await fetchGraphQL(
        `{
          usersByAdmin {
            userid
            email
            updated
            created
            profile {
              admin
              name
              photo
              platform
              build
              updated
              ageyear
              agemonth
              ageday
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

      setUsers(response.data.usersByAdmin.sort(compare));
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [state.token]);

  const columns = [
    {
      Header: 'Name',
      accessor: 'profile.name',
      width: 235,
      sortType: 'basic',
    },
    {
      Header: 'Email',
      accessor: 'email',
      sortType: 'basic',
      width: 300,
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
      id: 'age',
      Header: 'Age',
      sortType: 'basic',
      accessor: (d) =>
        d.profile.ageyear + '/' + d.profile.agemonth + '/' + d.profile.ageday,
      width: 90,
    },
    {
      id: 'photo',
      Header: 'Photo',
      sortType: 'basic',
      accessor: (d) => (d.profile.photo.length > 0 ? 'YES' : 'NO'),
      width: 60,
    },
    {
      id: 'created',
      Header: 'Created',
      accessor: (d) => d.created,
      width: 190,
      sortType: 'basic',
    },
    {
      id: 'updated',
      Header: 'Updated',
      accessor: 'profile.updated',
      width: 190,
      sortType: 'basic',
    },
    {
      id: 'platform',
      Header: 'Platform',
      accessor: (d) => d.profile.platform,
      width: 100,
      sortType: 'basic',
    },
    {
      id: 'build',
      Header: 'Build',
      accessor: (d) => d.profile.build,
      width: 80,
      sortType: 'basic',
    },
  ];

  return (
    <Style>
      <div>
        {users ? <Table columns={columns} data={users} /> : <p>No users</p>}
        {users.length === 0 ? <Spinner /> : null}
      </div>
    </Style>
  );
};

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
            key={i}
            {...headerGroup.getHeaderGroupProps()}
            className="row header-group">
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
          width: '800px',
        }}
      />
    </span>
  );
}
