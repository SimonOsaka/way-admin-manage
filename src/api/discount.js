import request from '@/utils/request'

export function queryDiscount(params) {
  return request({
    url: '/mp/discount/list',
    method: 'post',
    data: params
  })
}

export function deleteDiscount(params) {
  return request({
    url: '/mp/discount/delete',
    method: 'post',
    data: params
  })
}
