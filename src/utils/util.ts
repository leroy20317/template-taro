export const qs = (params: Record<string, string | number>) => {
  return Object.entries(params)
    .filter(([, val]) => !!val)
    .map(([key, val]) => `${key}=${val}`)
    .join('&');
};

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

type LabelValueList = {
  value: any;
  label: string;
  children?: {
    value: any;
    label: string;
  }[];
}[];
// 根据子类的 id 查找父类的 id
export const findIds = (data: LabelValueList, id: number) => {
  for (const item of data) {
    for (const child of item.children!) {
      if (child.value === id) {
        return [item.value, id];
      }
    }
  }
  return undefined;
};
// 根据 value 查找 label
export const findLabel = (data: LabelValueList, id: number) => {
  for (const item of data) {
    if (item.value === id) {
      return item.label;
    }
    if (item.children) {
      for (const child of item.children) {
        if (child.value === id) {
          return child.label;
        }
      }
    }
  }
  return undefined;
};
