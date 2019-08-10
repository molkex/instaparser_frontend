import { parse } from "qs";

export function getSearchQuery() {
  const location = window.location;
  const query = parse(location);
  return query.search && query.search.substring(1);
}

export function validateQuery(query) {
  return query.length === 24;
}