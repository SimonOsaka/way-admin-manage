import request from '@/utils/request'

export function queryCommodity(params) {
  return request({
    url: '/mp/commodity/list',
    method: 'post',
    data: params
  })
}

export function modifyCommodityStatus(params) {
  return request({
    url: '/mp/commodity/status',
    method: 'post',
    data: params
  })
}
