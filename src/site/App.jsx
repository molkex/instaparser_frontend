import { hot } from "react-hot-loader/root";
import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Layout } from "antd";
import io from "socket.io-client";
import { set } from "lodash";

const { Content, Header } = Layout;

import { errorTypes, socketActions, socketAddress } from "../common/constants";
import { getSameFollowersList } from "../common/api";

import HeaderContent from "./Header";
import Main from "./Main";

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
  }
`;

const SContent = styled(Content)`
  margin: 0 auto;
  width: 100%;
  max-width: 1200px;
  padding: 0 15px;
`;

const initialState = {
  result: undefined,
  totalFollowers: [],
  currentProgress: [0, 0],
  count: undefined,
  users: [],
  errors: null,

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
  const { error, username } = user;

  if (error === errorTypes.userNotFound) {
    return `Пользователь @${username} не найден`;
  } else if (error === errorTypes.userPrivate) {
    return `Профиль пользователя @${username} является приватным`;
  } else if (error === errorTypes.userTooManyFollowers) {
    return `У пользователя @${username} слишком много подписчков`;
  }
}

class App extends React.Component {
  state = initialState;

  initSocket() {
    this.socket = io(socketAddress);

    this.socket.on(socketActions.check, users => {
      console.log("check", users);
      const usersWithError = getUsersWithError(users);

      if (usersWithError.length > 0) {
        const errors = usersWithError.map(user => getError(user));
        this.setState({ errors, loading: false });

        this.socket.close();
      } else {
        this.setState({
          totalFollowers: users.map(user => user.totalFollowers)
        });
      }
    });

    this.socket.on(socketActions.progress, response => {
      const { name, followersProgress } = response;
      const index = this.state.users.findIndex(user => user === name);

      this.setState(prevState => ({
        currentProgress: set(
          prevState.currentProgress,
          `${index}.progress`,
          followersProgress
        )
      }));
    });

    // todo: get result from rest api, not socket
    //  socket should return id for request
    this.socket.on(socketActions.end, result => {
      this.socket.close();

      console.log(result);

      this.setState({
        result: result.users,
        count: result.count,
        loading: false
      });

      // getSameFollowersList(id)
      //   .then(result => result.json())
      //   .then(result =>
      //     this.setState({
      //       result: result.users,
      //       count: result.count,
      //       loading: false
      //     })
      //   );
    });
  }

  render() {
    const {
      totalFollowers,
      loading,
      currentProgress,
      result,
      users,
      count,
      errors
    } = this.state;
    return (
      <Layout>
        <GlobalStyles />
        <Header>
          <HeaderContent />
        </Header>
        <SContent>
          <Main
            count={count}
            errors={errors}
            result={result}
            users={users}
            loading={loading}
            totalFollowers={totalFollowers}
            currentProgress={currentProgress}
            onSearchClick={this.onSearchClick}
          />
        </SContent>
      </Layout>
    );
  }

  onSearchClick = users => {
    this.setState({
      ...initialState,
      users,
      currentProgress: users.map(user => ({ name: user, progress: 0 })),
      loading: true
    });

    this.initSocket();
    this.socket.emit(socketActions.search, users);
  };
}

export default hot(App);
