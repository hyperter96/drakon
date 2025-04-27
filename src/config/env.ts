// src/config/env.ts
export const ENV = {
    dev: __DEV__,
    // 可以添加额外的环境变量
    debugWechat: true, // 微信相关功能是否处于调试状态
    apiUrl: __DEV__ ? 'http://localhost:8081/api' : 'https://api.production.com',
  };