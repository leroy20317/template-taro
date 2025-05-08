/*
 * @Author: leroy
 * @Date: 2024-11-25 16:46:28
 * @LastEditTime: 2025-05-08 15:18:08
 * @Description: 工具函数
 */
export const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

// 责任链
export type ChainHandler = (status?: string) => Promise<string | undefined>;
export const createChain = (...handlers: ChainHandler[]): ChainHandler => {
  return async (status) => {
    for (const handler of handlers) {
      const result = await handler(status);
      if (!result) {
        return undefined;
      }
    }
    return undefined;
  };
};
