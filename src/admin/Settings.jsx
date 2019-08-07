import React from "react";
import styled from "styled-components";
import { message, Typography } from "antd";
const { Title } = Typography;

import { editSettings, getSettings } from "../common/api";
import { checkResponse, errorHandler } from "../common/utils";

import EditableInput from "../common/components/EditableInput";

const SDefinition = styled.div`
  float: left;
  margin-right: 1em;
`;

const SValue = styled.div`
  float: left;
`;

const SClearfix = styled.div`
  clear: both;
`;

class Settings extends React.Component {
  state = { maxFollowers: 0, initialValue: 0 };

  componentDidMount() {
    getSettings()
      .then(response => response.json())
      .then(result =>
        this.setState({
          maxFollowers: result.max_followers,
          initialValue: result.max_followers
        })
      );
  }

  render() {
    const { maxFollowers } = this.state;

    return (
      <Title level={4}>
        <SDefinition>
          Максимальное количество подписчиков для парсинга:
        </SDefinition>
        <SValue>
          <EditableInput
            value={maxFollowers}
            onSave={this.onSave}
            onChange={e =>
              this.setState({ maxFollowers: e.currentTarget.value })
            }
          />
        </SValue>
        <SClearfix />
      </Title>
    );
  }

  onSave = () => {
    const { maxFollowers } = this.state;
    editSettings({ maxFollowers })
      .then(response => {
        checkResponse(response);
        this.setState({ initialValue: maxFollowers });
        message.success("Изменение сохранено!", 1);
      })
      .catch(err => {
        this.setState({ maxFollowers: this.state.initialValue });
        errorHandler(err, "Во время сохранения изменения произошла ошибка!");
      });
  };
}

export default Settings;
