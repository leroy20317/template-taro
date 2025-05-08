/*
 * @Author: leroy
 * @Date: 2024-11-25 16:46:28
 * @LastEditTime: 2025-05-08 15:18:32
 * @Description: api
 */

import axios, { type AxiosRequestConfig } from 'axios';
import Taro from '@tarojs/taro';
import { TextDecoder } from 'text-encoding-shim';

// 流式响应接口定义
interface StreamResponse {
  abort: () => void;
  getTextStream: () => AsyncGenerator<string, void, unknown>;
  getJsonStream: () => AsyncGenerator<Record<string, any>, void, unknown>;
}

// 覆盖返回类型
declare module 'axios' {
  export interface AxiosResponse<T = any> extends Promise<T> {}
  export interface AxiosInstance {
    uploadFile<T = any>(config: {
      // 服务器上传地址
      url: string;
      // 要上传文件资源的路径
      filePath?: string;
      // 文件
      file?: File;
      // 文件对应的 key，开发者在服务器端通过这个 key 可以获取到文件二进制内容
      name: string;
      // HTTP 请求中其他额外的 form data
      formData?: any;
      [key: string]: any;
    }): Promise<T>;

    stream: (config: AxiosRequestConfig) => Promise<StreamResponse>;
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
  withCredentials: true,
});

// 自定义上传方法
instance.uploadFile = async ({ url, filePath, file, name, formData }) => {
  if (process.env.TARO_ENV !== 'weapp') {
    if (!file) {
      return Promise.reject('文件不能为空');
    }
    const data = new FormData();
    data.append(name, file);
    if (formData) {
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key] as string);
      });
    }
    return instance.post(url, data);
  }
  // 小程序上传
  if (!filePath) {
    return Promise.reject('文件路径不能为空');
  }
  return new Promise((resolve, reject) => {
    // 这里是自定义上传逻辑的示例
    // 你可以根据需要实现自己的上传逻辑
    const uploadTask = Taro.uploadFile({
      url,
      filePath,
      name,
      formData,
      success: (res) => {
        console.log('uploadFile res:', res);
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
// 扩展您现有的axios实例
instance.stream = async function (config) {
  const type = process.env.TARO_ENV;
  // 默认使用weapp实现
  return new Promise((resolve) => {
    // 创建数据队列和控制变量
    const dataQueue: string[] = [];
    let done = false;
    let error: Error | null = null;
    let waitingResolve: ((value: IteratorResult<string, void>) => void) | null = null;

    // 请求任务引用
    let requestTask: any;
    let abortController: AbortController | null = null;

    if (!config.url) {
      throw new Error('url不能为空');
    }

    if (type === 'weapp') {
      // ===== 微信小程序环境实现 =====
      requestTask = Taro.request({
        url: config.url,
        method: (config.method || 'GET').toUpperCase() as any,
        data: config.data,
        header: config.headers,
        enableChunked: true,
        success: () => {
          // 请求成功完成时标记done
          done = true;
          if (waitingResolve) {
            waitingResolve({ done: true, value: undefined });
            waitingResolve = null;
          }
        },
        fail: (err) => {
          // 请求失败时设置error
          error = new Error(err.errMsg || '请求失败');
          done = true;
          if (waitingResolve) {
            waitingResolve({ done: true, value: undefined });
            waitingResolve = null;
          }
        },
      });

      // 设置数据块接收回调
      requestTask.onChunkReceived((res) => {
        const chunk = new Uint8Array(res.data);
        const str = new TextDecoder('utf-8').decode(chunk);

        // 将数据存入队列
        dataQueue.push(str);

        // 如果有正在等待的resolve，则解决它
        if (waitingResolve) {
          const data = dataQueue.shift()!;
          waitingResolve({ done: false, value: data });
          waitingResolve = null;
        }
      });
    } else if (type === 'h5') {
      // ===== H5环境实现 =====
      abortController = new AbortController();

      fetch(config.url, {
        method: (config.method || 'GET').toUpperCase(),
        body: config.data ? JSON.stringify(config.data) : undefined,
        headers: config.headers as HeadersInit,
        signal: abortController.signal,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          // 获取响应体的reader
          const reader = response.body!.getReader();

          // 使用递归函数处理数据流
          function processStream() {
            reader
              .read()
              .then(({ done: streamDone, value }) => {
                if (streamDone) {
                  // 请求完成
                  done = true;
                  if (waitingResolve) {
                    waitingResolve({ done: true, value: undefined });
                    waitingResolve = null;
                  }
                  return;
                }

                // 处理接收到的数据块
                const str = new TextDecoder('utf-8').decode(value);

                // 将数据存入队列
                dataQueue.push(str);

                // 如果有正在等待的resolve，则解决它
                if (waitingResolve) {
                  const data = dataQueue.shift()!;
                  waitingResolve({ done: false, value: data });
                  waitingResolve = null;
                }

                // 继续处理流
                processStream();
              })
              .catch((err) => {
                // 处理读取流时的错误
                error = err;
                done = true;
                if (waitingResolve) {
                  waitingResolve({ done: true, value: undefined });
                  waitingResolve = null;
                }
              });
          }

          // 开始处理流
          processStream();
        })
        .catch((err) => {
          // 处理fetch请求失败
          error = err;
          done = true;
          if (waitingResolve) {
            waitingResolve({ done: true, value: undefined });
            waitingResolve = null;
          }
        });
    } else {
      // 不支持的类型
      error = new Error(`不支持的请求类型: ${type}`);
      done = true;
    }

    // 创建用于文本流的异步生成器
    async function* createTextStream(): AsyncGenerator<string, void, unknown> {
      while (!done || dataQueue.length > 0) {
        if (error) {
          throw error;
        }

        if (dataQueue.length > 0) {
          // 如果队列中有数据，直接返回
          yield dataQueue.shift()!;
        } else if (!done) {
          // 如果没有数据但请求未完成，则等待
          yield await new Promise<string>((resolve) => {
            waitingResolve = (result) => {
              if (result.done) {
                // 如果请求已完成，则返回解决值
                resolve('');
              } else {
                resolve(result.value);
              }
            };
          });
        }
      }
    }

    // 创建用于JSON流的异步生成器
    async function* createJsonStream(): AsyncGenerator<any, void, unknown> {
      // 缓存不完整的行
      let buffer = '';

      for await (const chunk of createTextStream()) {
        buffer += chunk;

        // 按行处理缓冲区
        const lines = buffer.split('\n');
        // 保留最后一行（可能不完整）作为新的缓冲区
        buffer = lines.pop() || '';

        // 处理完整的行
        for (const line of lines) {
          if (line.trim() && line.startsWith('data: ')) {
            const content = line.substring(6);
            // 处理JSON响应中的[DONE]
            if (content === '[DONE]') {
              return; // 结束生成器
            }
            try {
              const jsonData = JSON.parse(content);
              yield jsonData;
            } catch (e) {
              console.warn('解析JSON失败:', content, e);
            }
          }
        }
      }

      // 处理可能剩余的最后一行
      if (buffer.trim() && buffer.startsWith('data: ')) {
        try {
          const content = buffer.substring(6);
          // 处理JSON响应中的[DONE]
          if (content === '[DONE]') {
            return; // 结束生成器
          }
          const jsonData = JSON.parse(content);
          yield jsonData;
        } catch (e) {
          console.warn('解析JSON失败:', buffer.substring(6), e);
        }
      }
    }

    // 构建并返回响应对象
    resolve({
      abort: () => {
        if (type === 'weapp' && requestTask) {
          requestTask.abort();
        } else if (type === 'h5' && abortController) {
          abortController.abort();
        }
        done = true;
        error = new Error('请求已取消');
        if (waitingResolve) {
          waitingResolve({ done: true, value: undefined });
          waitingResolve = null;
        }
      },
      getTextStream: createTextStream,
      getJsonStream: createJsonStream,
    });
  });
};

/**
 * 异常处理程序
 */

instance.interceptors.request.use(
  async (config) => {
    return config;
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
    console.log('fetchInitDialogue error', error);
    if (typeof window !== 'undefined') {
      const handleCode = codeMessage[statusCode];
      if (handleCode && typeof handleCode !== 'string') {
        handleCode();
      } else if (statusCode) {
        console.log('statusCode:', error, statusCode);
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
