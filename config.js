/**
 * 小程序配置文件
 */

var host = '81370915.rockclimbingo.club';

var config = {

  service: {
    host,

    httpsHost: `https://${host}`,

    // 登录地址，用于建立会话
    loginUrl: `https://${host}/user/wxlogin`,

    // 植物相关请求地址
    plantRequestUrl: `https://${host}/plant/`,

    // 点赞相关请求地址
    likesRequestUrl: `https://${host}/likes/`,

    // 活动相关请求地址
    activityRequestUrl: `https://${host}/activity/`,

    // 评论相关请求地址
    messageRequestUrl: `https://${host}/message/`,

    // 用户相关请求地址
    userRequestUrl: `https://${host}/user/`,

    // 推文相关请求地址
    tweetRequestUrl: `https://${host}/tweet/`
  },
  likesType: {
    likePlantPoint: 0,
    likeActivity: 1,
    likePlant: 2
  },
  commentType: {
    commentPlantPoint: 0,
    commentActivity: 1,
    commentPlant: 2
  },
  pageSize: 3//页面每次加载的条数
};

module.exports = config;
