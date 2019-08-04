import { hot } from "react-hot-loader/root";
import React from "react";
import styled from "styled-components";
import GlobalStyles from "../common/globalStyles";
import HeaderContent from "../common/components/Header";
import {
  Alert,
  Button,
  Form,
  Icon,
  Input,
  Layout,
  Spin,
  Typography
} from "antd";
import { login } from "../common/api";
const { Title } = Typography;
const { Header } = Layout;

const SWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
  padding-top: 15%;
`;

const SCard = styled.div`
  max-width: 400px;
  width: 100%;
  padding: 30px;
  background-color: #fff;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
`;

const STitle = styled(Title)`
  text-align: center;
`;

class App extends React.Component {
  state = {
    error: undefined,
    loading: false
  };

  render() {
    const { error, loading } = this.state;
    const { getFieldDecorator } = this.props.form;

    return (
      <Layout style={{ height: "100%" }}>
        <GlobalStyles />
        <Header>
          <HeaderContent title="Instaparser admin panel" />
        </Header>
        <SWrapper>
          <SCard>
            <Spin spinning={loading}>
              <STitle level={4}>Вход в панель управления</STitle>
              <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item>
                  {getFieldDecorator("username", {
                    rules: [
                      {
                        required: true,
                        message: "Пожалуйста, введите ваш логин"
                      }
                    ]
                  })(
                    <Input
                      prefix={
                        <Icon
                          type="user"
                          style={{ color: "rgba(0,0,0,.25)" }}
                        />
                      }
                      onChange={this.onInputChange}
                      placeholder="Логин"
                    />
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator("password", {
                    rules: [
                      {
                        required: true,
                        message: "Пожалуйста, введите ваш пароль"
                      }
                    ]
                  })(
                    <Input.Password
                      prefix={
                        <Icon
                          type="lock"
                          style={{ color: "rgba(0,0,0,.25)" }}
                        />
                      }
                      onChange={this.onInputChange}
                      type="password"
                      placeholder="Пароль"
                    />
                  )}
                </Form.Item>
                {error && (
                  <Alert
                    style={{ marginBottom: "12px" }}
                    type="error"
                    message={error}
                  />
                )}
                <Button
                  type="primary"
                  disabled={loading}
                  htmlType="submit"
                  onClick={this.onSubmit}
                >
                  Войти
                </Button>
              </Form>
            </Spin>
          </SCard>
        </SWrapper>
      </Layout>
    );
  }

  onInputChange = () => this.setState({ error: undefined });

  onSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true });
        login(values.username, values.password)
          .then(response => response.json())
          .then(result => {
            const loginResult = result.success;
            if (loginResult) {
              //location.href = "/admin";
            } else {
              this.setState({ error: "Неправильный логин или пароль" });
            }
          })
          .catch(response => {
            this.setState({
              error:
                "Произошла непредвиденная ошибка. Пожалуйста, повторите позднее."
            });
          })
          .finally(() => this.setState({ loading: false }));
      }
    });
  };
}

const WrappedLoginForm = Form.create({ name: "login_form" })(App);
export default hot(WrappedLoginForm);
