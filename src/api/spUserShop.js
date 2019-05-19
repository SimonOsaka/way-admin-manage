import request from '@/utils/request'

export function querySpUserShop(params) {
  return request({
    url: '/mp/sp/usershop/list',
    method: 'post',
    data: params
  })
}

export function updateSpUserShop(params) {
  return request({
    url: '/mp/sp/usershop/update',
    method: 'post',
    data: params
  })
}
