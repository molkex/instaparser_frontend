import { apiPrefix } from "./constants";
import { stringify } from "qs";

function filterQuery(query) {
  const filteredQuery = {};

  for (let key in query) {
    if (query.hasOwnProperty(key)) {
      const queryVal = query[key];
      if (
        queryVal !== null &&
        queryVal !== undefined &&
        queryVal !== "" &&
        !Number.isNaN(queryVal) &&
        typeof queryVal !== "object"
      ) {
        filteredQuery[key] = queryVal.toString();
      }
    }
  }

  return filteredQuery;
}

function getParams(query, allowedParams = [], replaceKeys = {}) {
  return allowedParams.reduce((acc, paramName) => {
    const key = replaceKeys[paramName] || paramName;
    acc[key] = query[paramName];
    return acc;
  }, {});
}

const checkQueryLength = query => Object.keys(query).length > 0;

function getQueryStr(query) {
  const filteredQuery = filterQuery(query);
  let queryStr = "";

  if (checkQueryLength(filteredQuery)) {
    queryStr = "?" + stringify(filteredQuery);
  }

  return queryStr;
}

//main
export function getSameFollowers(id, query = {}) {
  const queryStr = getQueryStr(query);
  return fetch(`${apiPrefix}/stats/${id}/commonfollowers${queryStr}`);
}

//admin
export function getStatistics(query = {}) {
  const queryStr = getQueryStr(query);
  return fetch(`${apiPrefix}/stats${queryStr}`);
}

export function getSettings() {
  return fetch(`${apiPrefix}/settings`);
}

export function editSettings(query) {
  const params = getParams(query, ["maxFollowers"], {
    maxFollowers: "max_followers"
  });

  if (checkQueryLength(params)) {
    return fetch(`${apiPrefix}/settings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params)
    });
  } else {
    return Promise.reject();
  }
}

export function getAccounts(query = {}) {
  const queryStr = getQueryStr(query);

  return fetch(`${apiPrefix}/account${queryStr}`);
}

export function createAccount(query) {
  const params = getParams(query, ["username", "password"]);

  if (checkQueryLength(params)) {
    return fetch(`${apiPrefix}/account`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params)
    });
  } else {
    return Promise.reject();
  }
}

export function editAccount(query) {
  const params = getParams(query, ["id", "username", "password"]);

  if (checkQueryLength(params, 1)) {
    return fetch(`${apiPrefix}/account`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params)
    });
  } else {
    return Promise.reject();
  }
}

export function removeAccount(id) {
  return fetch(`${apiPrefix}/account/${id}/remove`);
}

export function checkAccount(id) {
  return fetch(`${apiPrefix}/account/${id}/check`);
}

// login
export function login(username, password) {
  return fetch(`${apiPrefix}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
}
