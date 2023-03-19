import request from '@/utils/axios'
import qs from 'qs'
import { getFile, fetchPost } from '@/utils/axios'
export function login(params) {
  return request({
    url: '/gs/mg/user/login',
    method: 'post',
    data: params,
  })
}
/**游戏分类 */
export function categorylist(params) {
  return request({
    url: '/gs/mg/category/list?' + qs.stringify(params),
    method: 'get',
    data: params,
  })
}

/**游戏分类 */
export function downloadtemplate(params) {
  return getFile('/gs/mg/game/downloadtemplate')
}

export function categorycreate(params) {
  console.log('params', params)
  return request({
    url: '/gs/mg/category/add',
    method: 'post',
    data: params,
  })
}

export function mggameadd(params) {
  console.log('params', params)
  return request({
    url: '/gs/mg/game/add',
    method: 'post',
    data: params,
  })
}
export function mggamesetdgstatus(params) {
  console.log('params', params)
  return request({
    url: '/gs/mg/game/setdgstatus',
    method: 'post',
    data: params,
  })
}
export function mggameupdatetags(params) {
  console.log('params', params)
  return request({
    url: '/gs/mg/game/updatetags',
    method: 'post',
    data: params,
  })
}

export function mggameupdate(params) {
  console.log('params', params)
  return request({
    url: '/gs/mg/game/update',
    method: 'post',
    data: params,
  })
}
export function categoryupdate(params) {
  return request({
    url: '/gs/mg/category/update',
    method: 'post',
    data: params,
  })
}

export function categorydel(params) {
  return request({
    url: '/gs/mg/category/del',
    method: 'post',
    data: params,
  })
}
export function gamedel(params) {
  return request({
    url: '/gs/mg/game/del',
    method: 'post',
    data: params,
  })
}
export function domainadd(params) {
  return request({
    url: '/gs/mg/domain/add',
    method: 'post',
    data: params,
  })
}

export function domainupdate(params) {
  return request({
    url: '/gs/mg/domain/update',
    method: 'post',
    data: params,
  })
}

/**游戏配置详情 */
export function mggameinfo(params) {
  return request({
    url: '/gs/mg/game/info?' + qs.stringify(params),
    method: 'get',
    data: params,
  })
}
/**游戏配置详情设置 */
export function setgamesort(params) {
  return fetchPost('/gs/mg/domain/setgamesort', params)
}

/**游戏配置列表 */
export function mggamelist(params) {
  return request({
    url: '/gs/mg/game/list?' + qs.stringify(params),
    method: 'get',
    data: params,
  })
}
/**域名配置列表 */
export function mgdomainlist(params) {
  return request({
    url: '/gs/mg/domain/list?' + qs.stringify(params),
    method: 'get',
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
  return getFile('/gs/comm/fileupload', params)
}
export function consumerFeedback(params) {
  return request({
    url: '/api/consumerFeedbackScan/pages',
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
    url: '/api/product_scan/delete?' + qs.stringify(params),
    method: 'post',
    data: params,
  })
}

export function logout(params) {
  return request({
    url: '/gs/mg/user/logout',
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
