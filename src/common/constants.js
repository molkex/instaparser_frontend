//const port = 3000;
//export const prefix = `http://localhost:${port}`;
export const prefix = API_URL;
export const apiPrefix = prefix + "/api";
export const socketAddress = prefix;

export const instagramUrl = "https://instagram.com";

export const socketActions = {
  search: "search",
  progress: "progress",
  check: "check",
  end: "end"
};

export const errorTypes = {
  userNotFound: "UserNotFound",
  userPrivate: "UserIsPrivate",
  userTooManyFollowers: "UserTooManyFollowers"
};

export const accountErrorTypes= {
  wrongLogin: "WrongUsername",
  wrongPassword: "WrongPassword",
  needConfirmation: "CheckpointRequired",
  accountFlagged: "FlaggedForSpam"
};

export const tablePageSize = 15;

export const dataKey = "searchId";