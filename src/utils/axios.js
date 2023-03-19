import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

// 创建axios实例
let service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000, // 请求超时时间
})
// request拦截器
service.interceptors.request.use(
  (config) => {
    // if (store.getters.token) {
    config.headers = {
      token: getToken('Token'), //携带权限参数
    }
    // }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// respone拦截器
service.interceptors.response.use(
  (response) => {
    /**
     * code:200,接口正常返回;
     */
    const res = response.data
    if (res.code !== 0) {
      Message({
        message: res.desc,
        type: 'error',
        duration: 5 * 1000,
      })
      // 根据服务端约定的状态码：5001:非法的token; 5002:其他客户端登录了; 5004:Token 过期了;
      if (res.code === 401) {
        MessageBox.confirm('权限过期，请重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          store.dispatch('LogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      if (res.code === 5001 || res.code === 5002 || res.code === 5004) {
        MessageBox.confirm(
          '你已被登出，可以取消继续留在该页面，或者重新登录',
          '确定登出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning',
          }
        ).then(() => {
          store.dispatch('LogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      return Promise.reject('error')
    } else {
      // res.code === 200,正常返回数据
      return response.data
    }
  },
  (error) => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000,
    })
    store.dispatch('LogOut').then(() => {
      location.reload() // 为了重新实例化vue-router对象 避免bug
    })
    return Promise.reject(error)
  }
)
/* 上传文件 */
export function fetchUpload(url, formData) {
  url = url + suffix
  return new Promise((resolve, reject) => {
    instance
      .post(url, formData, {
        contentType: false,
        processData: false,
      })
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        // reject(error);
        info(error)
        resolve({
          ok: false,
          msg: '请求超时，请重试',
        })
      })
  })
}
/* 上传文件 */
export function fetchPost(url, formData) {
  url = url
  const headers = {
    token: getToken('Token'),
    'Content-Type': 'application/json',
  }
  return new Promise((resolve, reject) => {
    axios
      .post(url, formData, {
        headers,
      })
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        // reject(error);
        resolve({
          ok: false,
          msg: '请求超时，请重试',
        })
      })
  })
}
/* 下载文件 */
export function getFile(url) {
  const headers = { token: getToken('Token') }
  return new Promise((resolve, reject) => {
    axios
      .get(url, { responseType: 'arraybuffer', responseType: 'blob', headers })
      .then((res) => {
        resolve(res.data)
      })
      .catch((err) => {
        error(err)
      })
  })
}

export default service
