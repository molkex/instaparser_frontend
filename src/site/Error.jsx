import React from "react";
import { Card, Col, Row, Typography } from "antd";
const { Title, Text } = Typography;

class Error extends React.Component {
  render() {
    const { errors } = this.props;

    return (
      <Row type="flex" justify="center" gutter={48}>
        {errors.map((error, index) => (
          <Col key={index} sm={24} md={24} xl={12}>
            <Card
              headStyle={{ backgroundColor: "#f5222d", color: "#fff" }}
              size="small"
              title="При парсинге произошла ошибка!"
            >
              <Text level={4}>{error}</Text>
            </Card>
          </Col>
        ))}
      </Row>
    );
  }
}

export default Error;
