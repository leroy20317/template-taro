/**
 * @author: leroy
 * @date: 2021/9/26 16:35
 * @description：request
 */

import axios from 'axios';
import Taro from '@tarojs/taro';

// 覆盖返回类型
declare module 'axios' {
  export interface AxiosResponse<T = any> extends Promise<T> {}
  export interface AxiosInstance {
    uploadFile<T = any>(config: {
      // 服务器上传地址
      url: string;
      // 要上传文件资源的路径
      filePath: string;
      // 文件对应的 key，开发者在服务器端通过这个 key 可以获取到文件二进制内容
      name: string;
      // HTTP 请求中其他额外的 form data
      formData?: any;
      [key: string]: any;
    }): Promise<T>;
  }
}

const codeMessage: Record<number, string | (() => void)> = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  429: () => {
    window.location.reload();
  },
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const instance = axios.create({
  baseURL: process.env.TARO_APP_API_HOST,
  withCredentials: true,
});

// 自定义上传方法，仅适用于小程序
instance.uploadFile = ({ url, filePath, name, formData }) => {
  return new Promise((resolve, reject) => {
    if (process.env.TARO_ENV !== 'weapp') {
      reject('仅支持小程序');
      return;
    }
    // 这里是自定义上传逻辑的示例
    // 你可以根据需要实现自己的上传逻辑
    const uploadTask = Taro.uploadFile({
      url,
      filePath,
      name,
      formData,
      success: (res) => {
        // 上传成功后的处理逻辑
        if (200 === res.statusCode) {
          // 假设服务器返回的是 JSON 数据
          resolve(JSON.parse(res.data));
        } else {
          // 处理错误情况
          reject(res);
        }
      },
      fail: reject,
    });
    uploadTask.progress((res) => {
      console.log('上传进度', res.progress);
      console.log('已经上传的数据长度', res.totalBytesSent);
      console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend);
    });
  });
};

/**
 * 异常处理程序
 */

instance.interceptors.request.use(
  (config) => {
    const headers = config.headers || {};
    const token = '';
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return { ...config, headers };
  },
  (error) => {
    console.log('请求错误', error);
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const statusCode = error.response && error.response.status;
    if (typeof window !== 'undefined') {
      const handleCode = codeMessage[statusCode];
      if (handleCode && typeof handleCode !== 'string') {
        handleCode();
      } else {
        Taro.showToast({
          title: codeMessage[statusCode] as string,
          icon: 'none',
        });
      }
      return undefined;
    }
    return Promise.reject(codeMessage[statusCode]);
  },
);

export default instance;
