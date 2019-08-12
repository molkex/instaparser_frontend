import React from "react";

import { checkResponse } from "../../common/utils";
import { createAccount } from "../../common/api";
import { getErrorMessage } from "../utils";

import AddAccountModal from "./AddAccountModal";

class AddAccountModalContainer extends React.Component {
  state = { error: null, loading: false };

  render() {
    return (
      <AddAccountModal
        onCancel={this.props.onCancel}
        loading={this.state.loading}
        error={this.state.error}
        onCreateBtnClick={this.createAccount}
      />
    );
  }

  createAccount = accountInfo => {
    this.setState({ loading: true });
    return createAccount(accountInfo)
      .then(response => {
        checkResponse(response);
        return response.json();
      })
      .then(result => {
        if (result.error === "") {
          this.props.onSuccess(result.id, {
            ...accountInfo,
            error: result.error,
            checkpoint: result.checkpoint
          });
        } else {
          this.setState({
            error: getErrorMessage(result.error, result.checkpoint)
          });
        }
      })
      .catch(err => {
        this.setState({ error: "При добавлении аккаунта произошла ошибка" });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };
}

export default AddAccountModalContainer;
