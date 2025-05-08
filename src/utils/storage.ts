/*
 * @Author: leroy
 * @Date: 2025-01-20 14:14:37
 * @LastEditTime: 2025-03-31 14:05:50
 * @Description: 本地存储storage
 */

import Taro from '@tarojs/taro';

async function get<T = unknown>(key: string): Promise<T | undefined> {
  try {
    const val = Taro.getStorageSync<T>(key);
    if (val) {
      return val;
    }
    return undefined;
  } catch (error) {
    console.error('storage get error', error);
    return undefined;
  }
}
async function set(key: string, value: any) {
  try {
    Taro.setStorageSync(key, value);
    return true;
  } catch (error) {
    console.error('storage set error', error);
    return false;
  }
}
async function remove(key: string) {
  try {
    Taro.removeStorageSync(key);
    return true;
  } catch (error) {
    console.error('storage remove error', error);
    return false;
  }
}

export default {
  get,
  set,
  remove,
};
