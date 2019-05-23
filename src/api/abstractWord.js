import request from '@/utils/request'

export function queryAbstractWord(params) {
  return request({
    url: '/mp/commodity/abstractword/list',
    method: 'post',
    data: params
  })
}

export function createAbstractWord(params) {
  return request({
    url: '/mp/commodity/abstractword/create',
    method: 'post',
    data: params
  })
}

export function updateAbstractWord(params) {
  return request({
    url: '/mp/commodity/abstractword/update',
    method: 'post',
    data: params
  })
}

export function deleteAbstractWord(params) {
  return request({
    url: '/mp/commodity/abstractword/delete',
    method: 'post',
    data: params
  })
}

export function queryAbstractWordByName(params) {
  return request({
    url: '/mp/commodity/abstractword/query',
    method: 'post',
    data: params
  })
}

export function queryAbstractWordRelationship(params) {
  return request({
    url: '/mp/commodity/abstractword/relationship/list',
    method: 'post',
    data: params
  })
}

export function saveAbstractWordRelationship(params) {
  return request({
    url: '/mp/commodity/abstractword/relationship/save',
    method: 'post',
    data: params
  })
}
