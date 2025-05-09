import { defineConfig, type UserConfigExport } from '@tarojs/cli';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import devConfig from './dev';
import prodConfig from './prod';
import * as path from 'node:path';
import { UnifiedWebpackPluginV5 } from 'weapp-tailwindcss/webpack';

const package_name = process.env.npm_package_name;

// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
export default defineConfig<'webpack5'>(async (merge) => {
  const baseConfig: UserConfigExport<'webpack5'> = {
    projectName: package_name,
    date: '2024-11-26',
    designWidth: 750,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2,
    },
    sourceRoot: 'src',
    outputRoot: `dist/${process.env.TARO_ENV}/${process.env.NODE_ENV}`,
    plugins: [
      '@tarojs/plugin-html',
      '@tarojs/plugin-http',
      ...(process.env.TARO_ENV === 'mini' ? ['taro-plugin-compiler-optimization'] : []),
    ],
    alias: {
      '@': path.resolve(__dirname, '..', 'src'),
      '~': path.resolve(__dirname, '..', 'node_modules'),
    },
    defineConstants: {},
    framework: 'react',
    compiler: {
      type: 'webpack5',
      prebundle: {
        enable: false,
      },
    },
    cache: {
      enable: true, // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
      name: `${process.env.NODE_ENV}-${process.env.TARO_ENV}-${process.env.TARO_APP_MODE}`,
    },
    mini: {
      miniCssExtractPluginOption: {
        ignoreOrder: true,
      },
      output: {
        publicPath: `${process.env.TARO_APP_PUBLIC_HOST}/`,
      },
      postcss: {
        pxtransform: {
          enable: true,
          config: {
            onePxTransform: false, // 禁用1px转换
          },
        },
        cssModules: {
          enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]',
          },
        },
      },
      optimizeMainPackage: {
        enable: true,
      },
      webpackChain(chain) {
        chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin);
        chain.merge({
          plugin: {
            install: {
              plugin: UnifiedWebpackPluginV5,
              args: [
                {
                  appType: 'taro',
                  // 下面个配置，会开启 rem -> rpx 的转化
                  rem2rpx: true,
                },
              ],
            },
          },
          resolve: {
            alias: {
              '@tarojs/runtime': require.resolve('@tarojs/runtime'),
            },
          },
        });
      },
    },
    h5: {
      router: {
        mode: 'browser', // 或者是 'browser'
      },
      publicPath: `${process.env.TARO_APP_PUBLIC_HOST}/`,
      staticDirectory: 'static',
      output: {
        filename: 'js/[name].[hash:8].js',
        chunkFilename: 'js/[name].[chunkhash:8].js',
      },
      imageUrlLoaderOption: {
        limit: 10240,
      },
      esnextModules: ['@taroify'],
      miniCssExtractPluginOption: {
        ignoreOrder: true,
        filename: 'css/[name].[hash].css',
        chunkFilename: 'css/[name].[chunkhash].css',
      },
      postcss: {
        autoprefixer: {
          enable: true,
          config: {},
        },
        cssModules: {
          enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]',
          },
        },
      },
      webpackChain(chain) {
        chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin);
      },
    },
    rn: {
      appName: 'taroDemo',
      postcss: {
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        },
      },
    },
  };
  if (process.env.NODE_ENV === 'development') {
    // 本地开发构建配置（不混淆压缩）
    return merge({}, baseConfig, devConfig);
  }
  // 生产构建配置（默认开启压缩混淆等）
  return merge({}, baseConfig, prodConfig);
});
