const Url = {
  staticHost: `${process.env.TARO_APP_PUBLIC_HOST}/static`,
  wwwDomain: process.env.TARO_APP_API_HOST?.replace('api', 'www'),
  userInfo: `/user/my-info`, // 获取用户信息
};
export default Url;
