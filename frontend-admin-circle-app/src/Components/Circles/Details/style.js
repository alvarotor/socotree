import styled from 'styled-components';

export default styled.div`
  width: 100%;
  height: 100%;

  justify-content: center;
  display: flex;
  padding: 1rem;

  * {
    box-sizing: border-box;
  }

  .table {
    /* border: 1px solid #d3d3d3; */
    width: 100%;
    overflow-x: auto;
  }

  .header {
    font-weight: bold;
    line-height: 60px;
    background-color: #f8f9fa;
  }

  .rows {
    overflow-y: auto;
  }

  .row {
    border-bottom: 1px solid #d3d3d3;
    height: 80px;
    &.body {
      :last-child {
        border: 0;
      }
    }
  }

  .cell {
    height: auto;
    width: auto;
    line-height: 20px;
    border-right: 1px solid #d3d3d3;
    padding-left: 5px;
    :last-child {
      border: 0;
    }
  }

  .headercolumn {
    height: 100px;
    background-color: #d3d3d3;
  }

  .buttoncell {
    margin: 20px;
  }

  .button-row {
    border-right: 1px solid #d3d3d3;
    margin: 20px;
  }

  .minfont {
    font-size: 9px;
  }
`;
