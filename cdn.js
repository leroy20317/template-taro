import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from 'node:fs'
import rd from 'rd'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import mime from 'mime';
import pLimit from 'p-limit';
// 限制并发数
const limit = pLimit(10);

// 获取项目名称
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
  forcePathStyle: false, // 对于非 AWS S3 兼容服务，通常需要设置为 true
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

// 排除文件
const EXCLUDED_FILES = [
  '.DS_Store', // macOS 隐藏文件
  'Thumbs.db', // Windows 缩略图文件
  '.gitkeep', // git 保留文件
];

function processDirectory(dirPath, nameTransformer) {
  const uploads = [];

  return new Promise((resolve, reject) => {
    rd.each(
      dirPath,
      function (f, s, next) {
        const fileName = path.basename(f);
        // 检查文件是否在排除列表中
        if (s.isFile() && !EXCLUDED_FILES.includes(fileName)) {
          const ossName = nameTransformer(f);

          uploads.push(limit(async () => {
            try {
              const result = await uploadFile(ossName, f);
              console.log(`上传文件至 https://${cdnHost}/${ossName} 成功`);
              return result;
            } catch (error) {
              console.error(`上传文件 ${ossName} 失败:`, error);
              throw error;
            }
          }));
        }
        next();
      },
      async function (err) {
        if (err) return reject(err);
        try {
          await Promise.all(uploads);
          console.log(`${dirPath} 所有文件上传完成`);
          resolve();
        } catch (error) {
          console.error('上传过程中发生错误:', error);
          reject(error);
        }
      }
    );
  });
}

(async function uploadAllFiles() {
  try {
    // 处理 public/static
    await processDirectory(
      path.join(__dirname, './public/static'),
      (f) => {
        let ossName = f.replace(__dirname, appName);
        return path.normalize(ossName).replace(/\\/g, '/').replace(/public\//g, '');
      }
    );

    console.log('所有目录处理完成');
  } catch (error) {
    console.error('处理过程中发生错误:', error);
    throw error;
  }
})()
