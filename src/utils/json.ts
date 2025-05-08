/*
 * @Author: leroy
 * @Date: 2025-04-29 15:29:54
 * @LastEditTime: 2025-04-29 15:30:20
 * @Description:
 */

// 排除空值
export const excludeEmptyValue = (params: Record<string, any>) => {
  return Object.entries(params).reduce<Record<string, any>>((acc, [key, val]) => {
    if (Array.isArray(val) && val.length === 0) {
      return acc;
    }
    if ([undefined, null, ''].includes(val)) {
      return acc;
    }
    acc[key] = val;
    return acc;
  }, {});
};

export const qs = (params: Record<string, any>) => {
  return Object.entries(excludeEmptyValue(params))
    .map(([key, val]) => `${key}=${val}`)
    .join('&');
};

// 根据子类的 id 查找父类的 id
export const findIds = (data: LabelValueList = [], value?: LabelValue['value']) => {
  if (!value) return undefined;
  for (const item of data) {
    if (!item.children) {
      if (item.value.toString() === value.toString()) {
        return [item.value];
      }
      continue;
    }
    for (const child of item.children) {
      if (child.value.toString() === value.toString()) {
        return [item.value, child.value];
      }
    }
  }
  return undefined;
};
// 根据 value 查找 label
export const findLabel = (data: LabelValueList = [], value?: LabelValue['value'] | any[]) => {
  if (value === undefined || value === '' || (Array.isArray(value) && value.length === 0))
    return undefined;
  const _value: any[] = Array.isArray(value) ? value : ([value] as any);
  const retArr: string[] = [];
  for (let i = 0; i < _value.length; i += 1) {
    let isFind = false;

    for (const item of data) {
      if (isFind) {
        break;
      }

      if (item.children) {
        for (const child of item.children) {
          if (child.value.toString() === _value[i].toString()) {
            // return child.label;
            retArr.push(child.label);
            isFind = true;
            break;
          }
        }
      } else if (item.value.toString() === _value[i].toString()) {
        // return item.label;
        retArr.push(item.label);
        break;
      }
    }
  }

  return retArr.length > 0 ? retArr.join(' / ') : value.toString();
};
