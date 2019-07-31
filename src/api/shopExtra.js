import request from '@/utils/request'

export function changeOwnerToSelf(params) {
  return request({
    url: '/mp/shop/extra/owner/self',
    method: 'post',
    data: params
  })
}

export function changeOwnerToManager(params) {
  return request({
    url: '/mp/shop/extra/owner/manager',
    method: 'post',
    data: params
  })
}
