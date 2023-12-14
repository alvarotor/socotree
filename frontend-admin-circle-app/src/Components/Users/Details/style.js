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
    border: 1px solid #d3d3d3;
    max-width: 1400px;
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
    height: 32px;
    &.body {
      :last-child {
        border: 0;
      }
    }
  }

  .cell {
    height: 100%;
    width: auto;
    line-height: 30px;
    border-right: 1px solid #d3d3d3;
    padding-left: 5px;
    :last-child {
      border: 0;
    }
  }

  .headerColumn {
    height: 32px;
    background-color: #d3d3d3;
  }
`;
