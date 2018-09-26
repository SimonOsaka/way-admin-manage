import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/mp/login/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/mp/login/logout',
    method: 'post'
  })
}

export function getUserInfo() {
  return request({
    url: '/mp/login/user/info',
    method: 'post'
  })
}
