import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {},
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
  corePlugins: {
    // 小程序不需要 preflight，因为这主要是给 h5 的，如果你要同时开发多端，你应该使用 process.env.TARO_ENV 环境变量来控制它
    preflight: false,
  },
} satisfies Config;
