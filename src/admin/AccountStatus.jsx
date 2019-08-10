import React from "react";
import { Alert } from "antd";
import { getErrorMessage } from "./utils";

class AccountStatus extends React.Component {
  render() {
    const { error, checkpoint } = this.props;
    if (error !== "") {
      const message = getErrorMessage(error, checkpoint);
      return <Alert showIcon message={message} type="error" />;
    }

    return <Alert showIcon message="Работает" type="success" />;
  }
}

export default AccountStatus;
