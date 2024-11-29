export default defineAppConfig({
  lazyCodeLoading: 'requiredComponents',
  pages: ['pages/home/index', 'pages/mine/index'],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
  tabBar: {
    color: '#000',
    selectedColor: '#6190E8',
    backgroundColor: '#fff',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页',
        iconPath: './assets/tab-bar/home.png',
        selectedIconPath: './assets/tab-bar/home-active.png',
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的',
        iconPath: './assets/tab-bar/mine.png',
        selectedIconPath: './assets/tab-bar/mine-active.png',
      },
    ],
  },
});
