import HttpUtils from '../network/HttpUtils'
import { USERS } from '../network/Urls'
import { Buffer } from 'buffer'

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

  // 并发上传图片
  const qiniuPromises = base64List.map(async (base64, index) => {
    let filename
    if (type === 'profile') {
      filename = `ineuro/user/${user_id}/profile_${Date.now()}.png-2life_face.jpg`
    }
    const res_token = await HttpUtils.get(USERS.qiniu_token, { filename })
    const key_base64 = Buffer.from(filename).toString('base64')

    if (res_token.code === 0) {
      const qiniu_token = res_token.data // 七牛token

      const URL_qiniu_host = 'https://upload.qiniu.com/putb64/-1/key/'

      const res_qiniu = await fetch(URL_qiniu_host + key_base64, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/octet-stream',
          'Authorization': 'UpToken ' + qiniu_token
        },
        body: base64List[index]
      })

      return res_qiniu
    }
  })

  let imgUrls = []
  for (let i = 0; i < qiniuPromises.length; i++) {
    const res = await qiniuPromises[i]
    if (res.status === 200) {
      const body = JSON.parse(res._bodyText)
      imgUrls.push('https://airing.ursb.me/' + body.key)
    }
  }
  return imgUrls.join(',')
}
