import { Platform, NativeModules, DeviceEventEmitter } from 'react-native';
import { WeChatConfig } from '@/constants/Config';
// import * as WeChat from 'react-native-wechat-lib';
import { Alert } from 'react-native';
import { ENV } from '@/config/env';
import { isWXAppInstalled, sendAuthRequest } from 'react-native-wechat-lib';

// 初始化微信SDK
export const initWeChat = async (): Promise<boolean> => {
  try {
    console.log('正在初始化微信SDK...');

    const WeChat = NativeModules.WeChat;
    // 仅在非调试模式下调用registerApp
    const result = await WeChat.registerApp(
      WeChatConfig.appId,
      Platform.OS === 'ios' ? WeChatConfig.universalLink : ''
    );
    console.log('微信SDK初始化结果:', result);
    return result;
  } catch (error) {
    console.error('微信SDK初始化失败:', error);
    return false;
  }
};

// 检查微信是否已安装
export const isWeChatInstalled = async (): Promise<boolean> => {
  try {
    const WeChat = NativeModules.WeChat;
    // 真实环境检查微信是否安装
    const isInstalled = await WeChat.isWXAppInstalled();
    console.log('微信是否安装:', isInstalled);
    return isInstalled;
  } catch (error) {
    console.error('检查微信安装状态失败:', error);
    return false;
  }
};

// 拉起微信授权登录 - 修复RN 0.76兼容性问题
export const sendWXAuthRequest = async (): Promise<{ code?: string } | null> => {
  try {
    // 真实环境发起微信授权
    console.log('发起微信授权请求...');
    const scope = 'snsapi_userinfo';
    const state = 'wechat_sdk_demo';
    const WeChat = NativeModules.WeChat;
    const authResponse = await WeChat.sendAuthRequest(scope, state);
    console.log('微信授权响应:', authResponse);
    
    return authResponse;
  } catch (error: any) {
    console.error('微信授权请求失败:', error);
    
    // 用户取消授权不是错误
    if (error.message && (error.message.includes('用户取消') || error.message.includes('user cancelled'))) {
      console.log('用户取消了微信授权');
      return null;
    }
    
    throw error;
  }
};

// 使用授权码获取用户信息（通常在服务器端进行）
export const getUserInfoWithCode = async (code: string): Promise<any | null> => {
  try {
    // 在调试模式下，如果使用调试授权码，返回模拟用户数据
    if (code.startsWith('DEBUG_AUTH_CODE_')) {
      console.log('调试模式 - 返回模拟用户数据');
      return {
        id: `wechat_debug_${Date.now()}`,
        name: '模拟微信用户',
        avatarUrl: 'https://placeholder.com/150',
      };
    }
    
    // 真实环境调用后端API获取用户信息
    console.log('使用授权码获取用户信息:', code);
    
    // 这里应该调用您的后端API，使用授权码换取用户信息
    // 以下为模拟实现
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `wechat_${Date.now()}`,
          name: '微信用户',
          avatarUrl: 'https://placeholder.com/150',
        });
      }, 1000);
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return null;
  }
}; 