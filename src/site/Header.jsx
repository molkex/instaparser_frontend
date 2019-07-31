import React from "react";
import styled from 'styled-components';

const SLogo = styled.div`
  float: left;
  color: #fff;
`;

class HeaderContent extends React.Component {
  render() {
    return (
        <SLogo>Instagram comparer</SLogo>
    );
  }
}

export default HeaderContent;
