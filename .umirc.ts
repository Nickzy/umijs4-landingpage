import { defineConfig } from 'umi';
import routes from './config/router';
import defaultSettings from './config/defaultSettings'
import theme from './config/theme';
import WebPack from './config/WebPack'

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes,
  targets: {
    ie: 11,
  },
  hash: true,
  dva: {
    immer: { enableES5: true },
    hmr: false,
  },
  // base: "/one/", // 基础路由添加
  // layout: {
  //   // https://umijs.org/zh-CN/plugins/plugin-layout
  //   locale: false,
  //   name: 'XiaoZhouzi',
  //   siderWidth: 208,
  //   ...defaultSettings,
  // },
  locale: {
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  theme,
  sass: {}, // 安装 @umijs/plugin-sass 添加配置
  fastRefresh: {},
  mfsu: {},
  webpack5: {},
  exportStatic: {},
  ignoreMomentLocale: true, // 忽略 moment 的 locale 文件，用于减少尺寸。
  chainWebpack(config, { env }) {
    WebPack(config, env)
  },
});
