/*
 * @Author: leroy
 * @Date: 2025-03-18 14:43:06
 * @LastEditTime: 2025-05-08 15:01:25
 * @Description: 全局类型
 */
/// <reference types="@tarojs/taro" />

declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg' {
  export function ReactComponent(props: React.SVGProps<SVGSVGElement>): React.ReactElement;
  const url: string;
  export default url;
}
declare namespace NodeJS {
  interface ProcessEnv {
    /** NODE 内置环境变量, 会影响到最终构建生成产物 */
    NODE_ENV: 'development' | 'production';
    /** 当前构建的平台 */
    TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt' | 'quickapp' | 'qq' | 'jd';
    /**
     * 当前构建的小程序 appid
     * @description 若不同环境有不同的小程序，可通过在 env 文件中配置环境变量`TARO_APP_ID`来方便快速切换 appid， 而不必手动去修改 dist/project.config.json 文件
     * @see https://taro-docs.jd.com/docs/next/env-mode-config#特殊环境变量-taro_app_id
     */
    TARO_APP_ID: string;
    TARO_APP_API_HOST: string;
    TARO_APP_PUBLIC_HOST: string;
    TARO_APP_MODE: string;
  }
}

type LabelValueList = {
  value: number | string;
  label: string;
  children?: {
    value: number | string;
    label: string;
  }[];
}[];

type LabelValue = Omit<LabelValueList[number], 'children'>;

declare namespace NodeJS {
  interface ProcessEnv {
    /** NODE 内置环境变量, 会影响到最终构建生成产物 */
    NODE_ENV: 'development' | 'production';
    // .shushuqiuzhi.com
    BASE_DOMAIN: string;
    // /static
    STATIC_HOST: string;
  }
}

type ListResponse<T> = {
  page: number;
  size: number;
  list: T;
  hasMore: boolean;
  total?: number;
};
