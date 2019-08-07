import React from "react";
import { Button, Form, Input } from "antd";
import { values } from "lodash";

class CreateAccountForm extends React.Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Form.Item>
            {getFieldDecorator("username", {})(
              <Input placeholder="Имя пользователя" />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("password", {})(<Input placeholder="Пароль" />)}
          </Form.Item>
          <Button type="primary" htmlType="submit" on>
            Сохранить пользователя
          </Button>
        </Form>
      </div>
    );
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, form) => {
      if (!err) {
        this.props.onCreateBtnClick(form);
      }
    });
  };
}

export default Form.create()(CreateAccountForm);
