import { message } from "antd";

import { instagramUrl } from "./constants";

export function getInstagramUserUrl(username) {
  return `${instagramUrl}/${username}`;
}

export function errorHandler(err, text) {
  message.error(text);
}

export function checkResponse(response) {
  if (response.status !== 200)
    throw new Error("Error while get response, code: " + response.status);
}