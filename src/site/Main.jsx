import React from "react";
import styled from "styled-components";
import { Button, Card, Col, Input, Row, Typography, Spin, Form } from "antd";
const { Title, Paragraph } = Typography;
import { values } from "lodash";

import Loader from "./Loader/Loader";
import Error from "./Error";
import Result from "./Result";
import { createSearchUrlFromId } from "./utils";
import SearchLink from "./SearchLink";

const SWrapper = styled.div`
  background: #fff;
  padding: 12px 24px 24px;
`;

const SButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const SHeader = styled(Title)`
  text-align: center;
`;

const SCard = styled(Card)`
  margin-bottom: 24px !important;
`;

const SResultContainer = styled.div`
  padding: 24px 0 12px;
`;

const instagramUserNameRegExp = /^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)$/;
const validationRules = [
  { required: true, message: "Пожалуйста, введите имя пользователя" },
  {
    pattern: instagramUserNameRegExp,
    message: "Введенное имя пользователя некорректно"
  }
];

const cards = [
  {
    placeholder: "Имя первого пользователя",
    title: "Введите имя первого пользователя",
    fieldName: "firstUserName"
  },
  {
    placeholder: "Имя второго пользователя",
    title: "Введите имя второго пользователя",
    fieldName: "secondUserName"
  }
];

class Main extends React.Component {
  render() {
    const {
      sameFollowers,
      totalFollowers,
      loading,
      searchId,
      parsing,
      currentProgress,
      users,
      errors,
      total,
      searchCount,
      onSearchInTable,
      pageNumber,
      onTablePageChange,
      form
    } = this.props;
    const { getFieldDecorator } = form;

    return (
      <SWrapper>
        <SHeader level={2}>
          Поиск одинаковых подписчиков у пользователей Instagram
        </SHeader>
        <Spin size="large" spinning={parsing}>
          <Form onSubmit={this.handleSubmit}>
            <Row gutter={48}>
              {cards.map((card, index) => (
                <Col key={index} xs={24} sm={24} md={12} xl={12}>
                  <SCard title={card.title}>
                    <Form.Item>
                      {getFieldDecorator(card.fieldName, {
                        rules: validationRules
                      })(<Input placeholder={card.placeholder} />)}
                    </Form.Item>
                  </SCard>
                </Col>
              ))}
            </Row>
            <SButtonWrapper>
              <Button
                htmlType="submit"
                style={{ margin: "0 auto" }}
                type="primary"
                disabled={loading}
              >
                Найти общих подписчиков пользователей
              </Button>
            </SButtonWrapper>
          </Form>
        </Spin>
        <SResultContainer>
          <SearchLink searchId={searchId} />
          {parsing && (
            <Loader
              users={users}
              totalFollowers={totalFollowers}
              currentProgress={currentProgress}
            />
          )}
          {total !== undefined && (
            <Result
              pageNumber={pageNumber}
              onSearchInTable={onSearchInTable}
              onTablePageChange={onTablePageChange}
              loading={loading}
              users={users}
              total={total}
              searchCount={searchCount}
              sameFollowers={sameFollowers}
            />
          )}
          {errors && <Error errors={errors} />}
        </SResultContainer>
      </SWrapper>
    );
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, formValues) => {
      if (!err) {
        const users = values(formValues);
        this.props.onSearchClick(users);
      }
    });
  };
}

export default Form.create({})(Main);
