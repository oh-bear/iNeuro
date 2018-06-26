import HttpUtils from '../network/HttpUtils'
import { USERS } from '../network/Urls'
import { Buffer } from 'buffer'
import { Platform } from 'react-native'

export const isDev = global.process.env.NODE_ENV === 'development'

/**
 * 上传base64至七牛
 * @param {Array of String} base64List
 * @param {Object} obj
 * @returns {String} 图片链接 img_url,img_url...
 */
export async function postImgToQiniu(base64List, obj) {
  if (base64List.length === 0) return ''
  const { type, user_id } = obj
  if (!type && !user_id) return

  const URL_qiniu_host = 'http://upload.qiniu.com/putb64/-1/key/'
  const BASE_IMG_URL = 'https://airing.ursb.me/'

  // 并发上传图片
  const qiniuPromises = base64List.map(async (base64, index) => {
    let filename
    if (type === 'note') {
      filename = `2life/user/${user_id}/img_${Date.now()}.png-2life_note.jpg`
    }
    if (type === 'profile') {
      filename = `2life/user/${user_id}/profile_${Date.now()}.png-2life_face.jpg`
    }
    const res_token = await HttpUtils.get(USERS.qiniu_token, { filename })
    const key_base64 = Buffer.from(filename).toString('base64')

    if (res_token.code === 0) {
      const qiniu_token = res_token.data // 七牛token
      if (Platform.OS === 'ios') {
        let xmlPromise = new Promise(function (resolve, reject) {
          let request = new XMLHttpRequest()
          request.onreadystatechange = handler
          request.open('POST', URL_qiniu_host + key_base64, true)
          request.setRequestHeader('Content-Type', 'application/octet-stream')
          request.setRequestHeader('Authorization', 'UpToken ' + qiniu_token)
          request.send(base64List[index])
          function handler() {
            if (request.readyState !== 4) {
              return
            }
            if (request.status === 200) {
              console.log('success', request.responseText)
              let res = {}
              res._bodyText = request.responseText
              res.status = 200
              resolve(res)
            } else {
              reject('error')
            }
          }
        })
        return xmlPromise
      } else {
        const res_qiniu = await fetch(URL_qiniu_host + key_base64, {
          method: 'post',
          headers: {
            'Content-Type': 'application/octet-stream',
            'Authorization': 'UpToken ' + qiniu_token
          },
          body: base64List[index]
        })
        return res_qiniu
      }
    }
  })
  let imgUrls = []
  for (let i = 0; i < qiniuPromises.length; i++) {
    const res = await qiniuPromises[i]
    // alert(JSON.stringify(res))
    if (res.status === 200) {
      const body = JSON.parse(res._bodyText)
      // alert(body.key)
      imgUrls.push(BASE_IMG_URL + body.key)
    }
  }
  return imgUrls.join(',')
}
