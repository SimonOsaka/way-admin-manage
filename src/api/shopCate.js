import request from '@/utils/request'

export function queryAllCate(params) {
  return request({
    url: '/mp/shop/cate/all',
    method: 'post',
    data: params
  })
}
