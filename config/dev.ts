import type { UserConfigExport } from '@tarojs/cli';
export default {
  copy: {
    patterns: [{ from: 'public', to: `dist/${process.env.TARO_ENV}` }],
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
