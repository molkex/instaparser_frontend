import React from "react";
import styled from "styled-components";

const SLogo = styled.div`
  float: left;
  color: #fff;
`;

function HeaderContent({ title }) {
  return <SLogo>{title}</SLogo>;
}

export default HeaderContent;
