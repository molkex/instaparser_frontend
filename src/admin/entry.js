import React from "react";
import ReactDOM from "react-dom";
import moment from "moment";
import "moment/locale/ru";
moment.locale("ru");
import { LocaleProvider } from "antd";
import ruRU from "antd/es/locale-provider/ru_RU";

import App from "./App";

const container = document.getElementById("container");
ReactDOM.render(
  <LocaleProvider locale={ruRU}>
    <App />
  </LocaleProvider>,
  container
);
