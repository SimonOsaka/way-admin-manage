import request from '@/utils/request'

export function queryUser(params) {
  return request({
    url: '/mp/user/list',
    method: 'post',
    data: params
  })
}

export function disableUser(params) {
  return request({
    url: '/mp/user/disable',
    method: 'post',
    data: params
  })
}
