import 'react'; // 如果你主要在 React 上下文中使用

declare module 'react' {
  interface CSSProperties {
    // 添加一个索引签名，允许任何以 '--' 开头的属性
    [key: `--${string}`]: string | number | undefined;
  }
  // 小程序中不支持object-cover 只支持 mode 属性， 复写 img 类型定义
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ImgHTMLAttributes<T> {
    /**
     * 缩放模式
     * @see https://developers.weixin.qq.com/miniprogram/dev/component/image.html
     */
    mode?: 'scaleToFill' | 'aspectFit' | 'aspectFill' | 'widthFix' | 'heightFix';
  }
}
