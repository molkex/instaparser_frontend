import React from "react";
import styled from "styled-components";
import { Input, Typography } from "antd";

const { Paragraph, Title } = Typography;

import { createSearchUrlFromId } from "./utils";

const SWrapper = styled.div`
  display: flex;
`;

const STitle = styled(Title)`
  margin-right: 12px;
`;

const SParagraph = styled(Paragraph)`
  margin: 0 !important;
`;

const SearchLink = ({ searchId }) => {
  if (!searchId) return null;

  return (
    <SWrapper>
      <STitle level={3}>Ссылка на данное сканирование: </STitle>
      <Input
        value={createSearchUrlFromId(searchId)}
        style={{ width: "370px" }}
        suffix={
          <SParagraph copyable={{ text: createSearchUrlFromId(searchId) }} />
        }
      />
    </SWrapper>
  );
};

export default SearchLink;
