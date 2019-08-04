import React from "react";
import ReactDOM from "react-dom";
import moment from "moment";
import "moment/locale/ru";
moment.locale("ru");

import App from "./App";

const container = document.getElementById("container");
ReactDOM.render(<App />, container);
