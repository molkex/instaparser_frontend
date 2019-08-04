import React from "react";
import styled from "styled-components";
import { Button, Col, Collapse, Input, Row, Typography } from "antd";
const { Panel } = Collapse;
const { Search } = Input;
const { Title } = Typography;

import FollowersTable from "./FollowersTable";

const SSearchWrapper = styled.div`
  margin-bottom: 12px;
`;

class Result extends React.Component {
  state = { searchVal: "" };

  render() {
    const {
      users,
      total,
      sameFollowers,
      onTablePageChange,
      pageNumber,
      loading,
      onSearchInTable
    } = this.props;
    const { searchVal } = this.state;

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
                <Row gutter={16}>
                  <Col xs={20} md={12} xl={8}>
                    <Search
                      enterButton
                      value={searchVal}
                      onChange={e =>
                        this.setState({ searchVal: e.currentTarget.value })
                      }
                      placeholder="Введите имя пользователя для поиска"
                      onSearch={onSearchInTable}
                    />
                  </Col>
                  <Col xs={4} md={12} xl={16}>
                    <Button onClick={this.onResetClick}>Сброс</Button>
                  </Col>
                </Row>
              </SSearchWrapper>
              <FollowersTable
                loading={loading}
                pageNumber={pageNumber}
                onTablePageChange={onTablePageChange}
                total={total}
                data={sameFollowers}
              />
            </Panel>
          </Collapse>
        )}
      </React.Fragment>
    );
  }

  onResetClick = () => {
    this.setState({ searchVal: "" }, () => this.props.onSearchInTable(""));
  };
}

export default Result;
