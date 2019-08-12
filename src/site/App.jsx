import { hot } from "react-hot-loader/root";
import React from "react";
import styled from "styled-components";
import io from "socket.io-client";

import { set } from "lodash";

import { Layout } from "antd";
const { Content, Header } = Layout;

import { socketActions, socketAddress } from "../common/constants";
import { getSameFollowers, startComparing } from "../common/api";
import {
  getError,
  getSearchQuery,
  getUsersWithError,
  validateQuery
} from "./utils";
import {
  clearSearchId,
  getSearchIdFromStorage,
  saveSearchId
} from "../common/storage";

import GlobalStyles from "../common/globalStyles";
import HeaderContent from "../common/components/Header";
import Main from "./Main";

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
  searchId: undefined,

  parsing: false,
  loading: false
};

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
      .then(response => response.json())
      .then(result => {
        const comparedUsers = result.compared_users;
        this.setState({
          users: comparedUsers.map(user => user.username),
          searchId: id
        });

        if (result.count !== null) {
          this.setState({
            sameFollowers: result.common_followers,
            total: result.count,
            searchCount: result.count,
            parsing: false
          });
          clearSearchId();
        } else {
          this.setState({
            parsing: true,
            currentProgress: comparedUsers.map(user => ({
              name: user.username,
              progress: 0
            })),
            totalFollowers: comparedUsers.map(user => user.total_followers)
          });
          this.initSocket(id);
        }
      })
      .catch(err => {
        this.setState({
          errors: ["Сканирования с таким номером не найдено"],
          parsing: false
        });
      });
  }

  initSocket(id) {
    this.socket = io(socketAddress, { query: { room_id: id } });

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
            searchId: id,
            total: result.count,
            searchCount: result.count,
            parsing: false
          })
        )
        .catch(err => {
          this.setState({ errors: [err] });
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
      searchId,
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
            searchId={searchId}
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
    getSameFollowers(this.state.searchId, { search: value })
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
    const { searchId } = this.state;

    this.setState({ loading: true });
    getSameFollowers(searchId, { p: pageNumber, search: this.state.search })
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

    startComparing(users)
      .then(response => {
        return response.json();
      })
      .then(result => {
        const { users, id } = result;
        const usersWithError = getUsersWithError(users);

        if (usersWithError.length > 0) {
          const errors = usersWithError.map(user => getError(user));
          this.setState({ errors, parsing: false });
        } else {
          saveSearchId(id);
          this.initSocket(id);
          this.setState({
            searchId: id,
            totalFollowers: users.map(user => user.total_followers)
          });
        }
      });
  };
}

export default hot(App);
