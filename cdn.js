import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import rd from 'rd';
import co from 'co';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import mime from 'mime';

const appName = process.env.npm_package_name;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cdnHost = '';

// 阿里云 OSS 的配置参数
const region = ''; // 例如 oss-cn-beijing
const accessKeyId = '';
const secretAccessKey = '';
const endpoint = `https://${region}.aliyuncs.com`; // 阿里云 OSS 的 endpoint
const bucket = '';

// 创建 S3 客户端对象
const S3 = new S3Client({
  region,
  endpoint,
  credentials: { accessKeyId, secretAccessKey },
  forcePathStyle: true, // 对于非 AWS S3 兼容服务，通常需要设置为 true
});

// 文件上传
function uploadFile(key, localFile) {
  return S3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: mime.getType(localFile),
      Body: fs.createReadStream(localFile),
    }),
  );
}
// 异步遍历目录下的所有文件
rd.each(
  path.join(__dirname, './public/static'),
  function (f, s, next) {
    if (s.isFile()) {
      let ossName = f.replace(__dirname, appName);
      ossName = path
        .normalize(ossName)
        .replace(/\\/g, '/')
        .replace(/public\//g, '');

      co(function* () {
        try {
          const result = yield uploadFile(ossName, f);
          return result;
        } catch (error) {
          console.log(error);
        }
      }).then(function () {
        console.log(`上传文件至 https://${cdnHost}/${ossName} 成功`);
      });
    }
    next();
  },
  function (err) {
    if (err) throw err;
  },
);
