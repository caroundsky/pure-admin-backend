// 临时密钥服务例子
var STS = require("qcloud-cos-sts")

// 配置参数
var config = {
  secretId: process.env.SecretId,
  secretKey: process.env.SecretKey,
  proxy: '',
  durationSeconds: 129600,
  bucket: process.env.Bucket,
  region: process.env.Region,
  // 允许操作（上传）的对象前缀，可以根据自己网站的用户登录态判断允许上传的目录，例子： user1/* 或者 * 或者a.jpg
  // 请注意当使用 * 时，可能存在安全风险，详情请参阅：https://cloud.tencent.com/document/product/436/40265
  allowPrefix: "pic/*",
  // 密钥的权限列表
  allowActions: [
    // 所有 action 请看文档
    // COS actions: https://cloud.tencent.com/document/product/436/31923
    // 简单上传
    "name/cos:PutObject",
    "name/cos:PostObject",
    // 分片上传
    "name/cos:InitiateMultipartUpload",
    "name/cos:ListMultipartUploads",
    "name/cos:ListParts",
    "name/cos:UploadPart",
    "name/cos:CompleteMultipartUpload",
    // 下载文件
    "name/cos:GetObject",
    // 删除文件
    "name/cos:DeleteObject"
  ],
  // 限制的上传后缀
  extWhiteList: ["jpg", "jpeg", "png", "gif", "bmp"],
}

// 获取临时密钥
export function getSts() {
  return new Promise((resolve, reject) => {
    // 获取临时密钥
    var AppId = config.bucket.substr(config.bucket.lastIndexOf("-") + 1)
    // 数据万象DescribeMediaBuckets接口需要resource为*,参考 https://cloud.tencent.com/document/product/460/41741
    var policy = {
      version: "2.0",
      statement: [
        {
          action: config.allowActions,
          effect: "allow",
          resource: [
            // cos相关授权路径
            "qcs::cos:" +
              config.region +
              ":uid/" +
              AppId +
              ":" +
              config.bucket +
              "/" +
              config.allowPrefix,
            // ci相关授权路径 按需使用
            "qcs::ci:" +
              config.region +
              ":uid/" +
              AppId +
              ":bucket/" +
              config.bucket +
              "/" +
              "job/*",
          ],
        },
      ],
    }
    var startTime = Math.round(Date.now() / 1000)
    STS.getCredential(
      {
        secretId: config.secretId,
        secretKey: config.secretKey,
        proxy: config.proxy,
        region: config.region,
        durationSeconds: config.durationSeconds,
        // endpoint: 'sts.internal.tencentcloudapi.com', // 支持设置sts内网域名
        policy: policy,
      },
      function (err, tempKeys) {
        if (tempKeys) tempKeys.startTime = startTime
        if (err) {
          reject(err)
        } else {
          resolve(tempKeys)
        }
      }
    )
  })
} 
