/*
 * @Author: leroy
 * @Date: 2024-11-26 10:15:03
 * @LastEditTime: 2025-05-08 14:58:20
 * @Description:
 */
import type { UserConfigExport } from '@tarojs/cli';
export default {
  copy: {
    patterns: [{ from: 'public', to: `dist/${process.env.TARO_ENV}/${process.env.NODE_ENV}` }],
    options: {},
  },
  logger: {
    quiet: false,
    stats: true,
  },
  mini: {},
  h5: {
    devServer: {
      host: 'localhost',
      port: 3000,
      open: false,
    },
  },
} satisfies UserConfigExport<'webpack5'>;
