import { hot } from "react-hot-loader/root";
import React from "react";
import styled from "styled-components";
import { Layout, Typography } from "antd";
const { Header, Content } = Layout;
const { Title } = Typography;

import HeaderContent from "../common/components/Header";
import GlobalStyles from "../common/globalStyles";

import AccountsTable from "./AccountsTable";
import HistoryTable from "./HistoryTable";
import Settings from "./Settings";

const SContent = styled(Content)`
  margin: 0 auto;
  width: 100%;
  max-width: 1200px;
  padding: 0 15px;
`;

const SCenteredTitle = styled(Title)`
  text-align: center;
`;

const SWrapper = styled.div`
  background: #fff;
  padding: 12px 24px 24px;
`;

const SAccountsWrapper = styled.div`
  margin-bottom: 24px;
`;

class App extends React.Component {
  render() {
    return (
      <Layout>
        <GlobalStyles />
        <Header>
          <HeaderContent title="Instaparser admin panel" />
        </Header>
        <SContent>
          <SWrapper>
            <SCenteredTitle level={1}>Настройки</SCenteredTitle>
            <Settings />
            <SAccountsWrapper>
              <AccountsTable />
            </SAccountsWrapper>
            <HistoryTable />
          </SWrapper>
        </SContent>
      </Layout>
    );
  }
}

export default hot(App);
