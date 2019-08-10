import React from "react";
import styled from "styled-components";
import {
  Button,
  Form,
  Icon,
  Modal,
  Popconfirm,
  Table,
  message,
  Typography
} from "antd";
const { Title } = Typography;

import { editAccount, getAccounts, removeAccount } from "../common/api";
import { AccountTableContext, getAccountsDiff } from "./utils";
import { checkResponse, errorHandler } from "../common/utils";
import { tablePageSize } from "../common/constants";

import CreateAccountForm from "./addAccountModal";
import AccountStatus from "./AccountStatus";
import EditableCell from "./EditableCell";

const STitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

class AccountsTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      accountsData: [],
      editingId: "",
      pageNumber: 1,
      total: 0,
      loading: true,

      createAccountModalVisible: false
    };

    this.columns = [
      {
        title: "Логин",
        editable: true,
        dataIndex: "username"
      },
      {
        title: "Пароль",
        editable: true,
        dataIndex: "password"
      },
      {
        title: "Статус",
        width: "250px",
        editable: false,
        dataIndex: "status",
        render: (text, record) => (
          <AccountStatus error={record.error} checkpoint={record.checkpoint} />
        )
      },
      {
        title: "",
        dataIndex: "operation",
        width: "200px",
        render: (text, record) => {
          const { editingId } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <AccountTableContext.Consumer>
                {form => (
                  <a
                    href="javascript:;"
                    onClick={() => this.save(form, record.id)}
                    style={{ marginRight: 8 }}
                  >
                    Сохранить
                  </a>
                )}
              </AccountTableContext.Consumer>
              <Popconfirm
                title="Отменить редактирование?"
                onConfirm={() => this.cancel(record.id)}
              >
                <a>Отмена</a>
              </Popconfirm>
            </span>
          ) : (
            <React.Fragment>
              <a
                disabled={editingId !== ""}
                onClick={() => this.edit(record.id)}
              >
                Изменить
              </a>{" "}
              <Popconfirm
                title="Удалить аккаунт?"
                onConfirm={() => this.remove(record.id)}
              >
                <a disabled={editingId !== ""}>Удалить</a>
              </Popconfirm>
            </React.Fragment>
          );
        }
      }
    ];
  }

  componentDidMount() {
    this.getAccounts();
  }

  getAccounts() {
    const { pageNumber } = this.state;

    getAccounts({ p: pageNumber })
      .then(response => response.json())
      .then(result => {
        this.setState({
          accountsData: result.accounts,
          total: result.count,
          loading: false
        });
      });
  }

  isEditing = record => record.id === this.state.editingId;

  cancel = () => {
    this.setState({ editingId: "" });
  };

  save(form, id) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }

      const newData = this.state.accountsData;
      const index = newData.findIndex(item => id === item.id);

      if (index !== -1) {
        const item = newData[index];
        const newItem = { ...item, ...row };

        const accountDiff = getAccountsDiff(item, row);
        if (accountDiff) {
          this.setState({ loading: true });
          editAccount(newItem)
            .then(response => {
              return response.json();
            })
            .then(result => {
              if (result.error === "") {
                this.setState({
                  editingId: ""
                });
              }

              newItem.error = result.error;
              newData[index] = newItem;
              this.setState({
                accountsData: newData
              });
            })
            .catch(err => {
              errorHandler(err, "Во время редактирования произошла ошибка!");
            })
            .finally(() => {
              this.setState({ loading: false });
            });
        }
      }
    });
  }

  edit(id) {
    this.setState({ editingId: id });
  }

  remove(id) {
    removeAccount(id)
      .then(response => {
        checkResponse(response);
        this.setState(prevState => ({
          accountsData: prevState.accountsData.filter(user => user.id !== id)
        }));
        message.success("Аккаунт успешно удален!");
      })
      .catch(err => errorHandler(err, "Во время удаления произошла ошибка!"));
  }

  render() {
    const { loading, accountsData } = this.state;
    const components = {
      body: {
        cell: EditableCell
      }
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: record => ({
          record,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record)
        })
      };
    });

    return (
      <AccountTableContext.Provider value={this.props.form}>
        <Modal
          title="Добавить аккаунт"
          footer={false}
          visible={this.state.createAccountModalVisible}
          onCancel={this.hideCreateAccountModal}
        >
          <CreateAccountForm
            onSuccess={this.onCreateAccountSuccess}
            onCancel={this.hideCreateAccountModal}
          />
        </Modal>
        <Table
          components={components}
          loading={loading}
          title={() => (
            <STitleWrapper>
              <Title level={3}>
                Список инстаграм аккаунтов, использующихся для сканирования
              </Title>
              <Button type="primary" onClick={this.showCreateAccountModal}>
                Добавить аккаунт <Icon type="plus" />
              </Button>
            </STitleWrapper>
          )}
          pagination={{
            hideOnSinglePage: true,
            onChange: this.onTablePageChange,
            pageSize: tablePageSize
          }}
          columns={columns}
          dataSource={accountsData}
          rowKey="id"
        />
      </AccountTableContext.Provider>
    );
  }

  showCreateAccountModal = () => {
    this.setState({ createAccountModalVisible: true });
  };

  hideCreateAccountModal = () => {
    this.setState({ createAccountModalVisible: false });
  };

  onTablePageChange = (pageNumber, pageSize) => {
    this.setState({ pageNumber }, () => {
      this.getAccounts();
    });
  };

  onCreateAccountSuccess = (id, accountInfo) => {
    this.setState(prevState => ({
      accountsData: prevState.accountsData.concat({
        id: id,
        ...accountInfo
      })
    }));

    this.hideCreateAccountModal();
    message.success("Аккаунт успешно добавлен!");
  };
}

const EditableAccountsTable = Form.create()(AccountsTable);
export default EditableAccountsTable;
