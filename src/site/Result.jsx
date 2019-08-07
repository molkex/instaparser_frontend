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
  state = { searchVal: "" };

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
    this.props.onSearchInTable("");
  };
}

export default Result;
