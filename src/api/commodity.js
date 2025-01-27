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

export function queryCommodityLogList(params) {
  return request({
    url: '/mp/commodity/log/list',
    method: 'post',
    data: params
  })
}

export function queryAllCommodityStatus(params) {
  return request({
    url: '/mp/commodity/allCommodityStatus',
    method: 'post',
    data: params
  })
}
