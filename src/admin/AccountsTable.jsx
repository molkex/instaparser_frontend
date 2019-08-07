import React from "react";
import styled from "styled-components";
import {
  Button,
  Form,
  Icon,
  Input,
  Modal,
  Popconfirm,
  Table,
  message,
  Typography
} from "antd";
import {
  createAccount,
  editAccount,
  getAccounts,
  removeAccount
} from "../common/api";
import { checkResponse, errorHandler } from "../common/utils";
import { tablePageSize } from "../common/constants";
import CreateAccountForm from "./AddAccountModal";
const { Title } = Typography;

const EditableContext = React.createContext();

const STitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

// todo: декомпозиция компонента
class AccountsTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      accountsData: [],
      createAccountModalVisible: false,
      editingId: "",
      pageNumber: 1,
      total: 0,
      loading: true
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
        title: "",
        dataIndex: "operation",
        render: (text, record) => {
          const { editingId } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <a
                    href="javascript:;"
                    onClick={() => this.save(form, record.id)}
                    style={{ marginRight: 8 }}
                  >
                    Сохранить
                  </a>
                )}
              </EditableContext.Consumer>
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

  getAccountsDiff(oldAccountInfo, newAccountInfo) {
    const result = { id: oldAccountInfo.id };
    let count = 0;

    if (oldAccountInfo.username !== newAccountInfo.username) {
      result.username = newAccountInfo.username;
      count++;
    }

    if (oldAccountInfo.password !== newAccountInfo.password) {
      result.password = newAccountInfo.password;
      count++;
    }

    if (count === 0) return null;
    return result;
  }

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

        const accountDiff = this.getAccountsDiff(item, row);
        if (accountDiff) {
          editAccount(accountDiff)
            .then(response => {
              checkResponse(response);
              newData[index] = newItem;
              this.setState({ accountsData: newData, editingId: "" });
            })
            .catch(err =>
              errorHandler(err, "Во время редактирования произошла ошибка!")
            );
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
      <EditableContext.Provider value={this.props.form}>
        <Modal
          title="Добавить аккаунт"
          footer={false}
          visible={this.state.createAccountModalVisible}
          onCancel={this.hideCreateAccountModal}
        >
          <CreateAccountForm onCreateBtnClick={this.createAccount} />
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
      </EditableContext.Provider>
    );
  }

  createAccount = accountInfo => {
    createAccount(accountInfo)
      .then(response => {
        checkResponse(response);
        return response.json();
      })
      .then(result => {
        this.hideCreateAccountModal();
        this.setState(prevState => ({
          accountsData: prevState.accountsData.concat({
            id: result.id,
            ...accountInfo
          })
        }));
        message.success("Аккаунт успешно добавлен!");
      })
      .catch(err =>
        errorHandler(err, "При добавлении пользователя произошла ошибка")
      );
  };

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
}

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
      <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
    );
  }
}

const EditableAccountsTable = Form.create()(AccountsTable);
export default EditableAccountsTable;
