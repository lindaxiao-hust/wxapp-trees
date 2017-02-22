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

    // 测试的信道服务地址
    tunnelUrl: `https://${host}/tunnel`,
  }
};

module.exports = config;
