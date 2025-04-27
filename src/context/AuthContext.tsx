import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { initWeChat, isWeChatInstalled, sendWXAuthRequest, getUserInfoWithCode } from '@/services/wechat';
import { ENV } from '@/config/env';

// 定义用户类型
type User = {
  id: string;
  name: string;
  phone?: string;
  avatarUrl?: string;
};

// 定义认证上下文类型
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (userData: User) => Promise<void>;
  signOut: () => Promise<void>;
  wechatLogin: () => Promise<void>;
  phoneLogin: (phone: string, code: string) => Promise<void>;
  sendSmsCode: (phone: string) => Promise<boolean>;
};

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 认证提供者组件
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [wechatInitialized, setWechatInitialized] = useState(false);
  const [wechatLoading, setWechatLoading] = useState(false);

  // 在组件挂载时检查用户是否已经登录并初始化微信SDK
  useEffect(() => {
    const setupAuth = async () => {
      try {
        // 加载用户信息
        const userJson = await AsyncStorage.getItem('user');
        if (userJson) {
          const userData = JSON.parse(userJson);
          setUser(userData);
          // 移除自动导航逻辑，让应用始终先显示登录页面
        }
        
        // 调试模式下，自动将微信SDK视为已初始化
        if (ENV.debugWechat) {
          console.log('调试模式 - 微信SDK自动标记为已初始化');
          setWechatInitialized(true);
        } else {
          // 仅在非调试模式下尝试初始化微信SDK
          try {
            const initialized = await initWeChat();
            setWechatInitialized(initialized);
          } catch (sdkError) {
            console.warn('微信SDK初始化失败，但不影响其他认证功能', sdkError);
          }
        }
      } catch (error) {
        console.error('Failed to setup auth', error);
      } finally {
        setIsLoading(false);
      }
    };

    setupAuth();
  }, []);

  // 登录方法 - 使用router.replace导航到主页
  const signIn = async (userData: User) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      // 登录成功后导航到主页
      router.replace('/pages');
    } catch (error) {
      console.error('Failed to save user data', error);
      throw error;
    }
  };

  // 退出登录方法 - 使用router.replace导航到登录页
  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
      // 退出登录后导航到登录页
      router.replace('/auth');
    } catch (error) {
      console.error('Failed to sign out', error);
      throw error;
    }
  };

  // 微信登录方法
  const wechatLogin = async () => {
    try {
      // 调试模式特殊处理
      if (ENV.debugWechat) {
        console.log('调试模式 - 模拟微信登录流程');
        try {
          setWechatLoading(true);
          // 调用sendWXAuthRequest会返回模拟的授权码
          const authResponse = await sendWXAuthRequest();
          
          if (!authResponse || !authResponse.code) {
            Alert.alert('提示', '模拟微信授权失败');
            return;
          }
          
          // 使用模拟授权码获取用户信息
          const userInfo = await getUserInfoWithCode(authResponse.code);
          if (userInfo) {
            await signIn(userInfo);
          } else {
            Alert.alert('提示', '获取用户信息失败，请重试');
          }
        } catch (error) {
          console.error('调试模式 - 模拟微信登录失败', error);
          Alert.alert('提示', '调试模式下模拟登录失败');
        } finally {
          setWechatLoading(false);
        }
        return;
      }
      
      // 非调试模式 - 真实微信登录流程
      // 检查微信是否已初始化
      if (!wechatInitialized) {
        const initialized = await initWeChat();
        if (!initialized) {
          Alert.alert('提示', '微信SDK初始化失败，请重试');
          return;
        }
        setWechatInitialized(initialized);
      }
      
      // 检查是否安装了微信
      const isInstalled = await isWeChatInstalled();
      if (!isInstalled) {
        Alert.alert('提示', '请先安装微信客户端后再使用微信登录');
        return;
      }
      
      // 发起微信授权请求
      try {
        setWechatLoading(true);
        const authResponse = await sendWXAuthRequest();
        
        if (!authResponse || !authResponse.code) {
          Alert.alert('提示', '微信授权失败，请重试');
          setWechatLoading(false);
          return;
        }
        
        // 使用授权码获取用户信息
        const userInfo = await getUserInfoWithCode(authResponse.code);
        if (userInfo) {
          await signIn(userInfo);
        } else {
          Alert.alert('提示', '获取用户信息失败，请重试');
        }
      } catch (authError: any) {
        console.error('微信授权过程出错', authError);
        const errorMessage = authError?.message || '未知错误';
        
        // 用户取消不提示错误
        if (errorMessage.includes('用户取消') || errorMessage.includes('user cancelled')) {
          console.log('用户取消了微信授权');
        } else {
          Alert.alert('微信登录失败', `授权失败: ${errorMessage}`);
        }
      } finally {
        setWechatLoading(false);
      }
    } catch (error) {
      console.error('微信登录过程出错', error);
      Alert.alert('登录失败', '微信登录出错，请稍后重试');
      setWechatLoading(false);
    }
  };

  // 发送短信验证码方法
  const sendSmsCode = async (phone: string): Promise<boolean> => {
    try {
      // 模拟发送短信验证码
      console.log('Sending SMS code to', phone);
      Alert.alert('提示', `已向 ${phone} 发送验证码（模拟）`);
      
      // 模拟成功
      return true;
    } catch (error) {
      console.error('Failed to send SMS code', error);
      Alert.alert('发送失败', '短信验证码发送失败，请稍后重试');
      return false;
    }
  };

  // 手机号码登录方法
  const phoneLogin = async (phone: string, code: string) => {
    try {
      // 模拟验证码验证
      console.log('Phone login', phone, code);
      
      // 模拟验证成功
      if (code === '123456') {
        const mockUser = {
          id: `phone_${Date.now()}`,
          name: '手机用户',
          phone,
        };
        
        await signIn(mockUser);
      } else {
        Alert.alert('提示', '验证码错误，请输入123456（模拟）');
        throw new Error('Invalid code');
      }
    } catch (error) {
      console.error('Failed to login with phone', error);
      throw error;
    }
  };

  const value = {
    user,
    isLoading,
    signIn,
    signOut,
    wechatLogin,
    phoneLogin,
    sendSmsCode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 使用认证上下文的自定义Hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 