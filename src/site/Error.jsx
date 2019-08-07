import React from "react";
import styled from "styled-components";
import { Card, Col, Row, Typography } from "antd";
const { Text } = Typography;

const SWrapper = styled.div`
  margin-bottom: 24px;
`;

class Error extends React.Component {
  render() {
    const { errors } = this.props;

    return (
      <Row type="flex" justify="center" gutter={48}>
        {errors.map((error, index) => (
          <Col key={index} xs={24} sm={24} md={12} xl={12}>
            <SWrapper>
              <Card
                headStyle={{ backgroundColor: "#f5222d", color: "#fff" }}
                size="small"
                title="При сканировании произошла ошибка!"
              >
                <Text level={4}>{error}</Text>
              </Card>
            </SWrapper>
          </Col>
        ))}
      </Row>
    );
  }
}

export default Error;
