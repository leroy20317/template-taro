/*
 * @Author: leroy
 * @Date: 2025-01-20 14:14:37
 * @LastEditTime: 2025-03-31 14:03:10
 * @Description: 本地存储storage h5
 */

import localforage from 'localforage';

localforage.config({
  name: 'ssqz',
  storeName: 'db',
});
function get<T = unknown>(key: string): Promise<T | undefined> {
  return new Promise((resolve) => {
    localforage.getItem(key, (_, value) => {
      resolve((value as T) || undefined);
    });
  });
}
function set(key: string, value: any) {
  return new Promise((resolve) => {
    localforage.setItem(key, value, (err) => {
      resolve(err ? false : true);
    });
  });
}
function remove(key: string) {
  return new Promise((resolve) => {
    localforage.removeItem(key, (err) => {
      resolve(err ? false : true);
    });
  });
}

export default {
  get,
  set,
  remove,
};
