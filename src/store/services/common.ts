/*
 * @Author: leroy
 * @Date: 2024-11-28 14:23:58
 * @LastEditTime: 2025-05-08 15:25:36
 * @Description: common
 */
import api from '@/utils/api';
import url from '@/utils/url';
import { cityMockData } from '@/utils/consts';
import { waitTime } from '@/utils/util';
import storage from '@/utils/storage';

export async function getUserInfo(params: { auth?: string }) {
  return api(url.userInfo, {
    method: 'GET',
    params,
  });
}

export async function getCities() {
  await waitTime(500);
  let data = await storage.get<LabelValueList>('cities');

  if (!data) {
    const res = cityMockData;
    data = [
      {
        value: '热门城市',
        label: '热门城市',
        children: res.hotCity.map((ele) => ({ value: ele, label: ele })),
      },
    ].concat(
      res.data.map((item) => ({
        value: item.province,
        label: item.province,
        children: item.city.map((ele) => ({ value: ele, label: ele })),
      })),
    );
    if (data?.length) storage.set('cities', data);
  }
  return data;
}
