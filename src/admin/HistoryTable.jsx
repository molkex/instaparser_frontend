import React from "react";
import styled from "styled-components";
import { Col, Row, Table, Typography } from "antd";
import moment from "moment";
const { Title } = Typography;

import { getInstagramUserUrl } from "../common/utils";
import { getStatistics } from "../common/api";
import SearchHeader from "../common/components/SearchHeader";
import {tablePageSize} from '../common/constants';

const columns = [
  {
    title: "Дата поиска",
    dataIndex: "creation_time",
    render: date => moment(date).format("DD.MM.YY hh:mm:ss")
  },
  {
    title: "Сравниваемые пользователи",
    dataIndex: "compared_users",
    render: users =>
      users.map((username, index) => (
        <a
          key={username}
          target="_blank"
          rel="noopener noreferrer"
          href={getInstagramUserUrl(username)}
        >
          @{username}
          {index === users.length - 1 ? "" : ", "}
        </a>
      ))
  },
  {
    title: "Количество совпавших подписчков",
    dataIndex: "count"
  }
];

// const expandedRowRender = () => {
//   return (
//     <FollowersTable
//       data={["123", "34356"]}
//       count={130}
//       onTablePageChange={() => {}}
//     />
//   );
// };

const SActions = styled.div`
  display: flex;
  justify-content: space-between;
`;

const SSearchHeaderWrapper = styled.div`
  width: 400px;
`;

class HistoryTable extends React.Component {
  state = {
    loading: false,
    pageNumber: 1,
    total: 0,
    statistics: undefined,
    value: ""
  };

  componentDidMount() {
    this.getStatistics();
  }

  render() {
    const { total, loading, statistics } = this.state;

    return (
      <React.Fragment>
        <Row>
          <Col span={14}>
            <Title level={3}>История сканирований</Title>
          </Col>
          <Col span={10}>
            <SearchHeader
              prefix="@"
              onSearch={this.onSearch}
              onResetClick={this.onResetSearch}
            />
          </Col>
        </Row>
        <Table
          pagination={{
            hideOnSinglePage: true,
            total: total,
            pageSize: tablePageSize,
            onChange: this.onTablePageChange
          }}
          loading={loading}
          // expandedRowRender={expandedRowRender}
          rowKey="id"
          columns={columns}
          dataSource={statistics}
        />
      </React.Fragment>
    );
  }

  onSearch = value => {
    this.setState({ value }, () => this.getStatistics());
  };

  onResetSearch = () => {
    this.setState({ value: "", pageNumber: 1 }, () => this.getStatistics());
  };

  onTablePageChange = (pageNumber, pageSize) => {
    this.setState({ pageNumber }, () => this.getStatistics());
  };

  getStatistics = query => {
    this.setState({ loading: true });
    const { value, pageNumber } = this.state;

    getStatistics({ search: value, p: pageNumber })
      .then(res => res.json())
      .then(result =>
        this.setState({
          loading: false,
          statistics: result.stats,
          total: result.count
        })
      );
  };
}

export default HistoryTable;
