import React from "react";
import styled from "styled-components";
import { Button, Col, Collapse, Input, Row, Typography } from "antd";
const { Panel } = Collapse;
const { Search } = Input;
const { Title } = Typography;

import FollowersTable from "./FollowersTable";
import SearchHeader from "../common/components/SearchHeader";

const SSearchWrapper = styled.div`
  margin-bottom: 12px;
`;

class Result extends React.Component {
  state = { searchValue: "" };

  render() {
    const {
      users,
      total,
      searchCount,
      sameFollowers,
      onTablePageChange,
      pageNumber,
      loading,
      onSearchInTable
    } = this.props;
    const { searchValue } = this.state;

    return (
      <React.Fragment>
        <Title level={3}>
          У пользователей @{users[0]} и @{users[1]} найдено {total} общих
          подписчиков
        </Title>
        {total > 0 && (
          <Collapse>
            <Panel header="Показать список общих подписчков">
              <SSearchWrapper>
                <SearchHeader
                  prefix="@"
                  onSearch={onSearchInTable}
                  onResetClick={this.onResetClick}
                  value={searchValue}
                  onChange={this.onInputSearchChange}
                />
              </SSearchWrapper>
              <FollowersTable
                loading={loading}
                pageNumber={pageNumber}
                onTablePageChange={onTablePageChange}
                total={searchCount}
                data={sameFollowers}
              />
            </Panel>
          </Collapse>
        )}
      </React.Fragment>
    );
  }

  onResetClick = () => {
    this.setState({ searchValue: "" });
    this.props.onSearchInTable("");
  };

  onInputSearchChange = searchValue => this.setState({ searchValue });
}

export default Result;
