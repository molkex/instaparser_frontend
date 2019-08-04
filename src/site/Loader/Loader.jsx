import React from "react";
import styled from "styled-components";
import { Alert, Col, Row, Spin, Typography } from "antd";
const { Title } = Typography;

import LoadProgress from "./LoadProgress";

const STitle = styled(Title)`
  text-align: center;
  margin-top: 30px;
`;

const SSpinWrapper = styled.div`
  display: flex;
  padding-top: 10px;
  justify-content: center;
`;

class Loader extends React.Component {
  render() {
    const { currentProgress, totalFollowers, users } = this.props;

    return (
      <React.Fragment>
        {totalFollowers.length > 0 ? (
          <React.Fragment>
            <STitle level={3}>Ищем общих подписчиков...</STitle>
            <Row>
              {totalFollowers.map((item, index) => (
                <Col xl={12} md={12} sm={24} key={index}>
                  <LoadProgress
                    username={users[index]}
                    current={currentProgress[index]}
                    total={totalFollowers[index]}
                  />
                </Col>
              ))}
            </Row>
            <Alert
              closable
              message="Поиск время от времени может приостанавливаться, это нормально."
              type="warning"
            />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <STitle level={3}>Проверяем профили...</STitle>
            <SSpinWrapper>
              <Spin size="large" />
            </SSpinWrapper>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default Loader;
