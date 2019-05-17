import request from '@/utils/request'

export function totalUsers() {
  return request({
    url: '/mp/dashboard/user/total',
    method: 'post'
  })
}

export function totalShops() {
  return request({
    url: '/mp/dashboard/shop/total',
    method: 'post'
  })
}

export function totalCommodities() {
  return request({
    url: '/mp/dashboard/commodity/total',
    method: 'post'
  })
}
