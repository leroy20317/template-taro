import api from '@/utils/api';
import url from '@/utils/url';
import { cityMockData } from '@/utils/consts';
import { waitTime } from '@/utils/util';

export async function getUserInfo(params: { auth?: string }) {
  return api(url.userInfo, {
    method: 'GET',
    params,
  });
}

export type LabelValue = {
  value: any;
  label: string;
}[];
export type LabelValueList = (LabelValue[number] & { children: LabelValue })[];
export async function getCities() {
  await waitTime(500);
  const data = cityMockData;
  const list = [
    {
      value: '热门城市',
      label: '热门城市',
      children: data.hotCity.map((ele) => ({ value: ele, label: ele })),
    },
  ].concat(
    data.data.map((item) => {
      return {
        value: item.province,
        label: item.province,
        children: item.city.map((ele) => ({ value: ele, label: ele })),
      };
    }),
  );
  return list;
}
