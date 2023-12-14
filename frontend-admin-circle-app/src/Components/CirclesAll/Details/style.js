import styled from 'styled-components';

export default styled.div`
  width: 100%;
  height: 100%;

  justify-content: center;
  display: flex;
  padding: 1rem;

  * {
    box-sizing: border-box;
    font-size: 14px;
  }

  .table {
    /* border: 1px solid #d3d3d3; */
    width: 100%;
    overflow-x: auto;
  }

  .header {
    font-weight: bold;
    height: 32px;
    background-color: #f8f9fa;
  }

  .header-row {
    border-bottom: 1px solid #d3d3d3;
    height: 32px;
  }

  .header-cell {
    height: 32px;
    width: auto;
    line-height: 30px;

    :last-child {
      border: 0;
    }
  }

  /* .rows {
    overflow-y: auto;
  } */

  .row {
    border-bottom: 1px solid #d3d3d3;
    height: 45px;
    &.body {
      :last-child {
        border: 0;
      }
    }
  }

  .cell {
    height: 100px;
    width: auto;
    line-height: 17px;
    border-right: 1px solid #d3d3d3;
    padding-left: 5px;
    :last-child {
      border: 0;
    }
  }
`;
