import request from '@/utils/axios'
import qs from 'qs'

export function login(params) {
  return request({
    url: '/auth/login',
    method: 'post',
    data: params,
  })
}

export function getproduct(params) {
  return request({
    url: '/api/product_scan/pages?' + qs.stringify(params),
    method: 'get',
    data: params,
  })
}

export function baseimgUrl(params) {
  return request({
    url: '/api/config/img/baseUrl',
    method: 'get',
    data: params,
  })
}
export function create(params) {
  return request({
    url: '/api/product_scan/create',
    method: 'post',
    data: params,
  })
}
export function upload(params) {
  return request({
    url: '/api/picture/upload',
    method: 'post',
    data: params,
  })
}
export function consumerFeedback(params) {
  return request({
    url: '/api/consumerFeedback/pages',
    method: 'get',
    data: params,
  })
}

export function update(params) {
  return request({
    url: '/api/product_scan/update',
    method: 'post',
    data: params,
  })
}
export function deleteData(params) {
  return request({
    url: '/api/product_scan/delete?'+ qs.stringify(params),
    method: 'post',
    data: params,
  })
}

export function logout(params) {
  return request({
    url: '/user/logout',
    method: 'get',
    data: params,
  })
}

export function getUserInfo(params) {
  return request({
    url: '/user/info/get',
    method: 'get',
    data: params,
  })
}

export function getUserList(reqData) {
  return request({
    url: '/user/list/get',
    method: 'get',
    data: reqData,
  })
}
