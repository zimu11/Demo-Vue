import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/userinfo/login',
    method: 'post',
    params: data
  })
}

export function getInfo(token) {
  return request({
    url: '/userinfo/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/userinfo/logout',
    method: 'post'
  })
}
