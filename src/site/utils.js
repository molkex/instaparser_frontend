import { parse } from "qs";
import { errorTypes, prefix } from "../common/constants";

export function getSearchQuery() {
  const location = window.location;
  const query = parse(location);
  return query.search && query.search.substring(1);
}

export function validateQuery(query) {
  return query.length === 24;
}

function checkUser(user) {
  return user.error === "" || user.error === undefined;
}

export function getUsersWithError(users) {
  return users.reduce(
    (acc, user) => (checkUser(user) ? acc : acc.concat(user)),
    []
  );
}

export function getError(user) {
  const { error, username, limit } = user;

  if (error === errorTypes.userNotFound) {
    return `Пользователь @${username} не найден`;
  } else if (error === errorTypes.userPrivate) {
    return `Профиль пользователя @${username} является приватным`;
  } else if (error === errorTypes.userTooManyFollowers) {
    return `У пользователя @${username} слишком много подписчков. Максимальное количество доступное для сканирования ${limit} подписчиков`;
  }
}

export function createSearchUrlFromId(id) {
  return `${prefix}/?${id}`;
}
