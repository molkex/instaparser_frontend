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

export function getSameFollowers(id, query = {}) {
  const filteredQuery = filterQuery(query);
  let queryStr = "";

  if (Object.keys(filteredQuery).length > 0) {
    queryStr = "?" + stringify(filteredQuery);
  }

  return fetch(`${apiPrefix}/stats/${id}/commonfollowers${queryStr}`);
}

export function getStatistics(page) {
  return fetch(`${apiPrefix}/stats`);
}

export function login(username, password) {
  return fetch(`${apiPrefix}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
}
