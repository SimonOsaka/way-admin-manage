import request from '@/utils/request'

export function queryShopList(params) {
  return request({
    url: '/mp/shop/list',
    method: 'post',
    data: params
  })
}

export function createShop(params, token) {
  return request({
    url: '/mp/shop/create',
    method: 'post',
    headers: { token },
    data: params
  })
}

export function updateShop(params) {
  return request({
    url: '/mp/shop/update',
    method: 'post',
    data: params
  })
}

export function deleteShop(params) {
  return request({
    url: '/mp/shop/delete',
    method: 'post',
    data: params
  })
}

export function getShop(params) {
  return request({
    url: '/mp/shop/get',
    method: 'post',
    data: params
  })
}

export function onlineShop(params) {
  return request({
    url: '/mp/shop/online',
    method: 'post',
    data: params
  })
}

export function offlineShop(params) {
  return request({
    url: '/mp/shop/offline',
    method: 'post',
    data: params
  })
}

export function getShopCateRoot(params) {
  return request({
    url: '/mp/shop/cate/root',
    method: 'post',
    data: params
  })
}

export function getShopCateLeaf(params) {
  return request({
    url: '/mp/shop/cate/leaf',
    method: 'post',
    data: params
  })
}

export function getShopCateAll() {
  return request({
    url: '/mp/shop/cate/all',
    method: 'post'
  })
}

export function modifyShopStatus(params) {
  return request({
    url: '/mp/shop/status',
    method: 'post',
    data: params
  })
}

export function queryShopLogList(params) {
  return request({
    url: '/mp/shop/log/list',
    method: 'post',
    data: params
  })
}
