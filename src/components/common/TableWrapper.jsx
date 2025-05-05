import React from 'react';

const TableWrapper = ({ title, headers, children }) => (
  <div className="card shadow p-4">
    <h4 className="mb-3">{title}</h4>
    <table className="table table-striped">
      <thead>
        <tr>{headers.map(h => <th key={h}>{h}</th>)}</tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);

export default TableWrapper;
