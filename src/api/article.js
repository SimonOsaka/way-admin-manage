import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/mp/article',
    method: 'get',
    params: query
  })
}

export function fetchArticle(postId) {
  return request({
    url: '/mp/article/' + postId,
    method: 'get'
  })
}

export function auditArticle(data) {
  return request({
    url: '/mp/article/audit/' + data.postId,
    method: 'put',
    data
  })
}
