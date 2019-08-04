import React from "react";
import { Input, Table as ATable } from "antd";

import { getInstagramUserUrl } from "../common/utils";

const columns = [
  {
    title: "Имя пользователя",
    dataIndex: "username",
    render: username => (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={getInstagramUserUrl(username)}
      >
        @{username}
      </a>
    )
  }
];

class FollowersTable extends React.Component {
  static defaultProps = {
    onTablePageChange: () => {}
  };

  render() {
    const { data, total, onTablePageChange, pageNumber, loading } = this.props;

    return (
      <ATable
        rowKey="username"
        loading={loading}
        pagination={{
          hideOnSinglePage: true,
          total: total,
          pageSize: 15,
          current: pageNumber,
          onChange: onTablePageChange
        }}
        columns={columns}
        dataSource={data && data.map(item => ({ username: item }))}
      />
    );
  }
}

export default FollowersTable;
