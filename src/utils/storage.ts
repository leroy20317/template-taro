/**
 * @author: leroy
 * @date: 2024-11-26 11:38
 * @description：storage
 */
import Taro from '@tarojs/taro';

const get = (key: string) => {
  if (process.env.TARO_ENV === 'h5') {
    const value = localStorage.getItem(key) || '';
    try {
      // 尝试将取出的字符串转换为对象
      return JSON.parse(value);
    } catch (e) {
      console.log('e', e);
      // 如果转换失败（说明原本就不是对象），直接返回原始字符串
      return value;
    }
  }
  return Taro.getStorageSync(key);
};
const set = (key: string, value: any) => {
  if (process.env.TARO_ENV === 'h5') {
    localStorage.setItem(key, JSON.stringify(value));
    return;
  }
  Taro.setStorageSync(key, value);
};

export default {
  get,
  set,
};
