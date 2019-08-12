import React from "react";
import styled from "styled-components";
import { Button, Col, Row, Input } from "antd";
const { Search } = Input;

const SWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const SButton = styled(Button)`
  margin-left: 15px;
`;

class SearchHeader extends React.Component {
  static defaultProps = { prefix: "" };

  render() {
    const { onSearch, prefix, onChange, value, onResetClick } = this.props;

    return (
      <SWrapper>
        <Search
          prefix={prefix}
          enterButton
          value={value}
          onChange={e => onChange(e.currentTarget.value)}
          placeholder="Введите имя пользователя для поиска"
          onSearch={() => onSearch(value)}
        />
        <SButton onClick={onResetClick}>Сброс</SButton>
      </SWrapper>
    );
  }
}

export default SearchHeader;
