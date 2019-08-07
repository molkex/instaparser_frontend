import React from "react";
import { Icon, Input } from "antd";

class EditableInput extends React.Component {
  state = { edited: false };

  render() {
    const { onChange, value } = this.props;
    const { edited } = this.state;

    return (
      <Input
        disabled={!edited}
        value={value}
        onChange={onChange}
        addonAfter={
          <div style={{ cursor: "pointer" }} onClick={this.onChange}>
            <Icon type={edited ? "save" : "edit"} />{" "}
            {edited ? "Сохранить" : "Изменить"}
          </div>
        }
      />
    );
  }

  onChange = () => {
    const { onSave } = this.props;
    const { edited } = this.state;

    if (edited) {
      this.setState({ edited: false });
      onSave();
    } else {
      this.setState({ edited: true });
    }
  };
}

export default EditableInput;
