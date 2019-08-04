import { hot } from "react-hot-loader/root";
import React from "react";
import styled from "styled-components";
import moment from "moment";
import { Layout, Table } from "antd";
const { Header, Content } = Layout;

import HeaderContent from "../common/components/Header";
import GlobalStyles from "../common/globalStyles";
import { getInstagramUserUrl } from "../common/utils";
import { getStatistics } from "../common/api";

const SContent = styled(Content)`
  margin: 0 auto;
  width: 100%;
  max-width: 1200px;
  padding: 0 15px;
`;

const SActions = styled.div`
  height: 150px;
  width: 100%;
`;

const SWrapper = styled.div`
  background: #fff;
  padding: 12px 24px 24px;
`;

const columns = [
  {
    title: "Дата поиска",
    dataIndex: "creation_time",
    render: date => moment(date).format("DD.MM.YY hh:mm:ss")
  },
  {
    title: "Сравниваемые пользователи",
    dataIndex: "compared_users",
    render: users =>
      users.map((username, index) => (
        <a
          key={username}
          target="_blank"
          rel="noopener noreferrer"
          href={getInstagramUserUrl(username)}
        >
          @{username}
          {index === users.length - 1 ? "" : ", "}
        </a>
      ))
  },
  {
    title: "Количество совпавших подписчков",
    dataIndex: "count"
  }
];

// const expandedRowRender = () => {
//   return (
//     <FollowersTable
//       data={["123", "34356"]}
//       count={130}
//       onTablePageChange={() => {}}
//     />
//   );
// };

class App extends React.Component {
  state = { loading: false, statistics: undefined, count: 0 };

  componentDidMount() {
    this.getStatistics({ page: 1 });
  }

  render() {
    const { count, loading, statistics } = this.state;

    return (
      <Layout>
        <GlobalStyles />
        <Header>
          <HeaderContent title="Instaparser admin panel" />
        </Header>
        <SContent>
          <SWrapper>
            <SActions>Some actions here</SActions>
            <Table
              pagination={{
                hideOnSinglePage: true,
                total: count,
                pageSize: 15,
                onChange: this.onTablePageChange
              }}
              loading={loading}
              // expandedRowRender={expandedRowRender}
              rowKey="id"
              columns={columns}
              dataSource={statistics}
            />
          </SWrapper>
        </SContent>
      </Layout>
    );
  }

  onTablePageChange = (pageNumber, pageSize) => {
    this.getStatistics({ page: pageNumber });
  };

  getStatistics = ({ page }) => {
    this.setState({ loading: true });

    getStatistics(page)
      .then(res => res.json())
      .then(result =>
        this.setState({
          loading: false,
          statistics: result.stats,
          count: result.count
        })
      );
  };
}

export default hot(App);
