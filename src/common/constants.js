const port = 3000;
//export const prefix = `http://5.189.102.24`;
export const prefix = `http://localhost:${port}`;
export const apiPrefix = prefix + "/api";
export const socketAddress = prefix;

export const socketActions = {
  search: "search",
  progress: "progress",
  check: "check",
  end: "end"
};

export const errorTypes = {
  userNotFound: "userNotFound",
  userPrivate: "userPrivate",
  userTooManyFollowers: "userTooManyFollowers"
};
