import React from "react";
import { Button, Form, Spin, Input, Alert } from "antd";

class CreateAccountForm extends React.Component {
  render() {
    const { loading, error, form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <div>
        <Spin spinning={loading}>
          <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} onSubmit={this.handleSubmit}>
            <Form.Item label="Имя пользователя">
              {getFieldDecorator("username", {})(
                <Input placeholder="Имя пользователя" />
              )}
            </Form.Item>
            <Form.Item label="Пароль">
              {getFieldDecorator("password", {})(
                <Input placeholder="Пароль" />
              )}
            </Form.Item>
            {error && (
              <Alert
                type="error"
                style={{ marginBottom: "12px" }}
                showIcon
                message={error}
              />
            )}
            <Button type="primary" htmlType="submit">
              Добавить аккаунт
            </Button>
            <Button
              style={{ marginLeft: "10px" }}
              onClick={this.props.onCancel}
            >
              Отмена
            </Button>
          </Form>
        </Spin>
      </div>
    );
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, form) => {
      if (!err) {
        this.props.onCreateBtnClick(form);
      }
    });
  };
}

export default Form.create()(CreateAccountForm);
