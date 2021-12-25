import { weibo, qq, qqZone, douban, shareUrl, shareTitle } from '@/utils/env'
import * as mutils from '@/utils/mUtils'

function getParamsUrl(obj) {
  let paramsUrl = ''
  for (let key in obj) {
    paramsUrl += key + '=' + obj[key] + '&'
  }
  return paramsUrl
}
