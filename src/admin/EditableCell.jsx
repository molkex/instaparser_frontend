import React from "react";
import { Form, Input } from "antd";

import { AccountTableContext } from "./utils";

class EditableCell extends React.Component {
  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      record,
      index,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Пожалуйста, заполните поле`
                }
              ],
              initialValue: record[dataIndex]
            })(<Input />)}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    return (
      <AccountTableContext.Consumer>
        {this.renderCell}
      </AccountTableContext.Consumer>
    );
  }
}

export default EditableCell;
