import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const UserLoginIdKey = 'userLoginId'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function getUserLoginId() {
  return Cookies.get(UserLoginIdKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function setUserLoginId(userLoginId) {
  return Cookies.set(UserLoginIdKey, userLoginId)
}

export function removeToken() {
  Cookies.remove(UserLoginIdKey)
  return Cookies.remove(TokenKey)
}
