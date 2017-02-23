/**
 * 小程序配置文件
 */

var host = '81370915.rockclimbingo.club';

var config = {

  service: {
    host,

    // 登录地址，用于建立会话
    loginUrl: `https://${host}/user/wxlogin`,

    // 植物相关请求地址
    plantRequestUrl: `https://${host}/plant/`,

    // 点赞相关请求地址
    likesRequestUrl: `https://${host}/likes/`,

    // 活动相关请求地址
    activityRequestUrl: `https://${host}/activity/`,
  },
  likesType: {
    likePlantPoint: 0,
    likeActivity: 1,
    likePlant: 2
  },
  requestHeader: 'application/json'
};

module.exports = config;
