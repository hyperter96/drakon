import { NativeModules, Platform } from 'react-native';
import { WeChatConfig } from '@/constants/Config';

// 获取WeChat原生模块
const WeChat = NativeModules.RNWechat || {};
console.log('WeChat SDK 状态:', WeChat ? '已加载' : '未加载');

// 检查WeChat对象是否正确加载
const isWeChatAvailable = () => {
  return WeChat && typeof WeChat.registerApp === 'function';
};

// 初始化微信SDK
export const initWeChat = async (): Promise<boolean> => {
  try {
    // 检查微信SDK是否可用
    if (!isWeChatAvailable()) {
      console.error('微信SDK未正确加载');
      return false;
    }
    
    // 确保AppID不是默认值
    if (WeChatConfig.appId === 'wx_app_id_here') {
      console.warn('请设置真实的微信AppID，当前使用的是示例值');
    }
    
    await WeChat.registerApp(
      WeChatConfig.appId,
      Platform.OS === 'ios' ? WeChatConfig.universalLink : ''
    );
    console.log('微信SDK初始化成功');
    return true;
  } catch (error) {
    console.error('微信SDK初始化失败', error);
    return false;
  }
};

// 检查微信是否已安装
export const isWeChatInstalled = async (): Promise<boolean> => {
  try {
    if (!isWeChatAvailable()) {
      console.log('微信SDK未正确加载，无法检查微信是否安装');
      return false;
    }
    return await WeChat.isWXAppInstalled();
  } catch (error) {
    console.error('检查微信安装状态失败', error);
    return false;
  }
};

// 拉起微信授权登录
export const sendAuthRequest = async (): Promise<{ code: string } | null> => {
  try {
    if (!isWeChatAvailable()) {
      console.error('微信SDK未正确加载');
      return null;
    }
    
    const scope = 'snsapi_userinfo';
    const state = 'wechat_auth';
    const result = await WeChat.sendAuthRequest(scope, state);
    console.log('微信授权成功', result);
    
    // 确保返回了code
    if (result && result.code) {
      return { code: result.code };
    }
    
    return null;
  } catch (error) {
    console.error('微信授权失败', error);
    return null;
  }
};

// 使用授权码获取用户信息（通常在服务器端进行）
export const getUserInfoWithCode = async (code: string): Promise<any> => {
  try {
    // 这里应该是服务端的接口，用授权码换取用户信息
    // 为了演示，这里模拟一个成功的响应
    // 实际项目中应该调用真实的后端API
    console.log('使用授权码获取用户信息', code);
    
    // 模拟网络请求
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `wx_${Date.now()}`,
          name: '微信用户',
          avatarUrl: 'https://example.com/avatar.png',
        });
      }, 300);
    });
  } catch (error) {
    console.error('获取用户信息失败', error);
    throw error;
  }
}; 