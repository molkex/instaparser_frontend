import { apiPrefix } from "./constants";

export function getSameFollowersList(id) {
  return fetch(`${apiPrefix}/samefollowers/${id}`);
}
