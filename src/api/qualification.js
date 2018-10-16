import request from '@/utils/request'

export function getShopQualification(params) {
  return request({
    url: '/mp/qualification/get',
    method: 'post',
    data: params
  })
}
