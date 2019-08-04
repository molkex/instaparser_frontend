import { instagramUrl } from "./constants";

export function getInstagramUserUrl(username) {
  return `${instagramUrl}/${username}`;
}
