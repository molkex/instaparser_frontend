import React from "react";
import { accountErrorTypes } from "../common/constants";
import { Icon, Tooltip } from "antd";

export const AccountTableContext = React.createContext();

export function getAccountsDiff(oldAccountInfo, newAccountInfo) {
  const result = { id: oldAccountInfo.id };
  let count = 0;

  if (oldAccountInfo.username !== newAccountInfo.username) {
    result.username = newAccountInfo.username;
    count++;
  }

  if (oldAccountInfo.password !== newAccountInfo.password) {
    result.password = newAccountInfo.password;
    count++;
  }

  if (count === 0) return null;
  return result;
}

export function getErrorMessage(error, checkpoint) {
  if (error === accountErrorTypes.wrongLogin) {
    return "Неправильный логин";
  } else if (error === accountErrorTypes.wrongPassword) {
    return "Неправильный пароль";
  } else if (error === accountErrorTypes.accountFlagged) {
    return "Аккаунт помечен как спам-аккаунт";
  } else if (error === accountErrorTypes.needConfirmation) {
    return (
      <React.Fragment>
        Требуется подтвердить аккаунт (
        <a target="_blank" href={checkpoint}>
          подтвердить
        </a>
        ){" "}
        <Tooltip title="Зайдите в этот аккаунт и перейдите по ссылке">
          <Icon type="question-circle" />
        </Tooltip>
      </React.Fragment>
    );
  } else {
    return "Произошла неизвестная ошибка";
  }
}

export function getWordEndSuffixFromNumber(word, number) {
  let suffix = "";
  if (number === 1) {
    suffix = "ие";
  } else if (number >= 2 && number <= 4) {
    suffix = "ия";
  } else if (number === 0 || number >= 5) {
    suffix = "ий";
  } 
  
  return word + suffix;
}