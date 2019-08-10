import { dataKey } from "./constants";

function setDataInStorage(key, value) {
  localStorage.setItem(key, value);
}

function getDataFromStorage(key) {
  return localStorage.getItem(key);
}

function removeDataFromStorage(key) {
  localStorage.removeItem(key);
}

export function saveSearchId(id) {
  setDataInStorage(dataKey, id);
}

export function getSearchIdFromStorage() {
  return getDataFromStorage(dataKey);
}

export function clearSearchId() {
  removeDataFromStorage(dataKey);
}
