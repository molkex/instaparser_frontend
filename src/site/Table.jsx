import React from "react";
import { Table as ATable } from "antd";

const columns = [
  {
    title: "Имя пользователя",
    key: "username",
    dataIndex: "username"
  }
];

function Table({ data }) {
  return (
    <ATable
      rowKey="username"
      pagination={{ hideOnSinglePage: true }}
      columns={columns}
      dataSource={data}
    />
  );
}

export default Table;
