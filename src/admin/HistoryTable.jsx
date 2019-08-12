import React from "react";
import styled, { css } from "styled-components";
import { Col, Row, Table, Tooltip, Typography } from "antd";
import moment from "moment";
const { Title } = Typography;

import { getStatistics } from "../common/api";
import SearchHeader from "../common/components/SearchHeader";
import { tablePageSize } from "../common/constants";
import { getWordEndSuffixFromNumber } from "./utils";

const backgroundHeight = 500;
const offset = 14 * 1.5; // font-size * line-height
const SBackground = styled.div`
  width: 100%;
  height: ${backgroundHeight}px;
  position: absolute;
  top: -${props => Math.min(props.count * 5, backgroundHeight - offset)}px;
  left: 0;
  background: rgb(241, 248, 233);
  background: linear-gradient(
    180deg,
    rgba(241, 248, 233, 1) 0%,
    rgba(76, 175, 80, 1) 50%,
    rgba(27, 94, 32, 1) 100%
  );
  z-index: 0;
`;

const SWrapper = styled.div`
  float: left;
  height: 1.5em;
  padding: 0 5px;
  border-radius: 5px;
  position: relative;
  overflow: hidden;
`;

const SLink = styled.a`
  position: relative;
  z-index: 1;
`;

const SUsername = props => {
  const { count, children, ...linkProps } = props;
  return (
    <SWrapper>
      <SBackground count={count} />
      <SLink {...linkProps}>{children}</SLink>
    </SWrapper>
  );
};

class HistoryTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      pageNumber: 1,
      total: 0,
      statistics: undefined,
      searchValue: ""
    };

    this.columns = [
      {
        title: "Номер сканирования",
        dataIndex: "id",
        render: (text, record) => (
          <a href={"/?" + text} target="_blank">
            {text}
          </a>
        )
      },
      {
        title: "Дата поиска",
        dataIndex: "creation_time",
        render: date => moment(date).format("DD.MM.YY hh:mm:ss")
      },
      {
        title: "Сравниваемые пользователи",
        dataIndex: "compared_users",
        render: users =>
          users.map((user, index) => (
            <React.Fragment>
              <Tooltip
                key={index}
                title={`${user.count} ${getWordEndSuffixFromNumber(
                  "сканирован",
                  user.count
                )}`}
              >
                <SUsername
                  count={user.count}
                  href="javascript:;"
                  onClick={() =>
                    this.setState({ searchValue: user.username }, () =>
                      this.getStatistics()
                    )
                  }
                >
                  @{user.username}
                </SUsername>
              </Tooltip>
              <div style={{ float: "left", marginRight: "5px" }}>
                {index === users.length - 1 ? "" : ", "}
              </div>
            </React.Fragment>
          ))
      },
      {
        title: "Количество совпавших подписчков",
        dataIndex: "count"
      }
    ];
  }

  componentDidMount() {
    this.getStatistics();
  }

  render() {
    const { total, loading, statistics, searchValue } = this.state;

    return (
      <React.Fragment>
        <Row>
          <Col span={14}>
            <Title level={3}>История сканирований</Title>
          </Col>
          <Col span={10}>
            <SearchHeader
              prefix="@"
              value={searchValue}
              onSearch={this.onSearch}
              onChange={this.onInputSearchChange}
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
          rowKey="id"
          columns={this.columns}
          dataSource={statistics}
        />
      </React.Fragment>
    );
  }

  onInputSearchChange = searchValue => this.setState({ searchValue });

  onSearch = () => {
    this.getStatistics();
  };

  onResetSearch = () => {
    this.setState({ searchValue: "", pageNumber: 1 }, () =>
      this.getStatistics()
    );
  };

  onTablePageChange = (pageNumber, pageSize) => {
    this.setState({ pageNumber }, () => this.getStatistics());
  };

  dataAdapter = data =>
    data.map(item => ({
      ...item,
      compared_users: item.compared_users.map(user => ({ username: user }))
    }));

  getStatistics = query => {
    this.setState({ loading: true });
    const { searchValue, pageNumber } = this.state;

    getStatistics({ search: searchValue, p: pageNumber })
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
