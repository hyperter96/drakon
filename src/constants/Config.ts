/**
 * 应用配置信息
 */

// 微信登录配置
export const WeChatConfig = {
  // 微信开放平台申请的应用ID
  appId: 'wx_app_id_here',
  // iOS通用链接（Universal Link）
  universalLink: 'https://your-domain.com/app/',
  // 微信开放平台申请的应用密钥
  appSecret: 'wx_app_secret_here',
};

// API配置
export const ApiConfig = {
  // API基础URL
  baseUrl: 'https://api.your-domain.com',
  // 超时时间（毫秒）
  timeout: 10000,
  // 版本
  version: 'v1',
};

// 应用配置
export const AppConfig = {
  // 应用名称
  appName: '龙应用',
  // 版本号
  version: '1.0.0',
  // 构建号
  buildNumber: '1',
};

// 存储键
export const StorageKeys = {
  // 用户信息
  USER: 'user',
  // 认证令牌
  AUTH_TOKEN: 'auth_token',
  // 设置
  SETTINGS: 'settings',
}; 