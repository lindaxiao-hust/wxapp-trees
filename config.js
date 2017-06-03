/**
 * 小程序配置文件
 */

var host = '32604953.epname.com';
var httpsHost = `https://${host}`;

var config = {

  service: {
    host,

    httpsHost,

    // 登录地址，用于建立会话
    loginUrl: `${httpsHost}/user/wxlogin`,

    // 首页推荐请求地址
    recommendRequestUrl: `${httpsHost}/recommend/`,

    // 植物相关请求地址
    plantRequestUrl: `${httpsHost}/plant/`,

    // 点赞相关请求地址
    likesRequestUrl: `${httpsHost}/likes/`,

    // 活动相关请求地址
    activityRequestUrl: `${httpsHost}/activity/`,

    // 评论相关请求地址
    messageRequestUrl: `${httpsHost}/message/`,

    // 用户相关请求地址
    userRequestUrl: `${httpsHost}/user/`,

    // 推文相关请求地址
    tweetRequestUrl: `${httpsHost}/tweet/`
  },
  likesType: {
    likePlantPoint: 0,
    likeActivity: 1,
    likePlant: 2,
    likeTweet: 3
  },
  commentType: {
    commentPlantPoint: 0,
    commentActivity: 1,
    commentPlant: 2,
    commentTweet: 3
  },
  pageSize: 10,//页面每次加载的条数
  defaultImg: '../../images/ashin2.jpg',
  // mie: http://7xsmkb.com1.z0.glb.clouddn.com/mie.mp3
  // ding: http://7xsmkb.com1.z0.glb.clouddn.com/ding.mp3
  // cool: http://7xsmkb.com1.z0.glb.clouddn.com/cool.mp3
  defaultDing: 'http://7xsmkb.com1.z0.glb.clouddn.com/cool.mp3',
  defaultAudioPoster: 'http://7xsmkb.com1.z0.glb.clouddn.com/ashin'
};

module.exports = config;
