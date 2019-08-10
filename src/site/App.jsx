import { hot } from "react-hot-loader/root";
import React from "react";
import styled from "styled-components";
import io from "socket.io-client";

import { set } from "lodash";

import { Layout } from "antd";
const { Content, Header } = Layout;

import { errorTypes, socketActions, socketAddress } from "../common/constants";
import { getSameFollowers } from "../common/api";

import GlobalStyles from "../common/globalStyles";
import HeaderContent from "../common/components/Header";
import Main from "./Main";
import { getSearchQuery, validateQuery } from "./utils";
import {
  clearSearchId,
  getSearchIdFromStorage,
  saveSearchId
} from "../common/storage";

const SContent = styled(Content)`
  margin: 0 auto;
  width: 100%;
  max-width: 1200px;
  padding: 0 15px;
`;

const initialState = {
  sameFollowers: undefined,
  totalFollowers: [],
  currentProgress: [0, 0],
  pageNumber: 1,
  total: undefined,
  searchCount: undefined,
  users: [],
  search: "",
  errors: undefined,
  resultId: undefined,

  parsing: false,
  loading: false
};

function checkUser(user) {
  return user.error === "";
}

function getUsersWithError(users) {
  return users.reduce(
    (acc, user) => (checkUser(user) ? acc : acc.concat(user)),
    []
  );
}

function getError(user) {
  const { error, username, limit } = user;

  if (error === errorTypes.userNotFound) {
    return `Пользователь @${username} не найден`;
  } else if (error === errorTypes.userPrivate) {
    return `Профиль пользователя @${username} является приватным`;
  } else if (error === errorTypes.userTooManyFollowers) {
    return `У пользователя @${username} слишком много подписчков. Максимальное количество доступное для сканирования ${limit} подписчиков`;
  }
}

class App extends React.Component {
  state = initialState;

  componentDidMount() {
    const searchIdFromQuery = getSearchQuery();
    const searchIdFromStorage = getSearchIdFromStorage();

    if (searchIdFromQuery && validateQuery(searchIdFromQuery)) {
      this.setState({ parsing: true });
      this.getSameFollowers(searchIdFromQuery);
    } else if (searchIdFromStorage) {
      this.setState({ parsing: true });
      this.getSameFollowers(searchIdFromStorage);
    }
  }

  getSameFollowers(id) {
    return getSameFollowers(id)
      .then(result => result.json())
      .then(result => {
        if (result.count !== 0) {
          this.setState({
            sameFollowers: result.common_followers,
            resultId: id,
            users: result.compared_users,
            total: result.count,
            searchCount: result.count,
            parsing: false
          });
          clearSearchId();
        } else {
          this.setState({
            parsing: false,
            errors: ["Сканирование данных аккаунтов ещё не завершено"]
          });
        }
      })
      .catch(err => {
        this.setState({
          errors: ["Сканирования с таким номером не найдено"],
          parsing: false
        });
      });
  }

  initSocket() {
    this.socket = io(socketAddress);

    this.socket.on(socketActions.check, result => {
      const { users, id } = result;
      saveSearchId(id);
      const usersWithError = getUsersWithError(users);

      if (usersWithError.length > 0) {
        const errors = usersWithError.map(user => getError(user));
        this.setState({ errors, parsing: false });

        this.socket.close();
      } else {
        this.setState({
          totalFollowers: users.map(user => user.total_followers)
        });
      }
    });

    this.socket.on(socketActions.progress, response => {
      const { name, followers_progress } = response;
      const index = this.state.users.findIndex(user => user === name);

      this.setState(prevState => ({
        currentProgress: set(
          prevState.currentProgress,
          `${index}.progress`,
          followers_progress
        )
      }));
    });

    this.socket.on(socketActions.end, id => {
      this.socket.close();
      clearSearchId();

      getSameFollowers(id)
        .then(result => result.json())
        .then(result =>
          this.setState({
            sameFollowers: result.common_followers,
            resultId: id,
            total: result.count,
            searchCount: result.count,
            parsing: false
          })
        )
        .catch(err => {
          this.setState({ errors: [""] });
        });
    });

    this.socket.on("error", error => {
      this.socket.close();
      this.setState({ errors: [error] });
      console.log(error);
    });
  }

  render() {
    const {
      totalFollowers,
      parsing,
      loading,
      currentProgress,
      sameFollowers,
      users,
      total,
      searchCount,
      pageNumber,
      errors
    } = this.state;

    return (
      <Layout>
        <GlobalStyles />
        <Header>
          <HeaderContent title="Instagram comparer" />
        </Header>
        <SContent>
          <Main
            total={total}
            errors={errors}
            sameFollowers={sameFollowers}
            users={users}
            searchCount={searchCount}
            onTablePageChange={this.onTablePageChange}
            onSearchInTable={this.onSearchInTable}
            parsing={parsing}
            loading={loading}
            totalFollowers={totalFollowers}
            pageNumber={pageNumber}
            currentProgress={currentProgress}
            onSearchClick={this.onSearchClick}
          />
        </SContent>
      </Layout>
    );
  }

  onSearchInTable = value => {
    this.setState({ loading: true, pageNumber: 1 });
    getSameFollowers(this.state.resultId, { search: value })
      .then(result => result.json())
      .then(result => {
        this.setState({
          sameFollowers: result.common_followers,
          searchCount: result.count,
          search: value,
          loading: false
        });
      });
  };

  onTablePageChange = (pageNumber, pageSize) => {
    const { resultId } = this.state;

    this.setState({ loading: true });
    getSameFollowers(resultId, { p: pageNumber, search: this.state.search })
      .then(result => result.json())
      .then(result => {
        this.setState({
          pageNumber,
          sameFollowers: result.common_followers,
          loading: false
        });
      });
  };

  onSearchClick = users => {
    this.setState({
      ...initialState,
      users,
      currentProgress: users.map(user => ({ name: user, progress: 0 })),
      parsing: true
    });

    this.initSocket();
    this.socket.emit(socketActions.search, users);
  };
}

export default hot(App);
