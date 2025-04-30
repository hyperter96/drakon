import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Redirect, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { View, Text } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/context/AuthContext';
import { initWeChat } from '@/services/wechat';
import { ENV } from '@/config/env';

// 防止启动屏幕在资源加载完成前自动隐藏
SplashScreen.preventAutoHideAsync();

// 内容组件
function RootLayoutContent() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // 安全初始化微信SDK - 不阻塞应用启动
  useEffect(() => {
    // 延迟初始化微信SDK
    const timer = setTimeout(() => {
      if (ENV.debugWechat) {
        return;
      }
      const setupSDKs = async () => {
        try {
          // 尝试初始化微信SDK，但不阻塞应用启动
          const wechatInitialized = await initWeChat();
          console.log('微信SDK初始化结果:', wechatInitialized ? '成功' : '失败');
        } catch (error) {
          // 捕获但不阻止应用继续运行
          console.error('初始化SDK失败，但应用将继续运行', error);
        }
      };
  
      // 静默执行，不影响应用启动
      setupSDKs().catch(error => {
        console.warn('SDK初始化过程遇到问题', error);
      });
    }, 2000); // 延迟2秒再初始化微信SDK

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);


  // 如果加载字体时出错，显示错误信息
  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-900">
        <Text className="text-white text-base">加载资源时出错</Text>
      </View>
    );
  }

  return (
    // 添加全局背景色包装器，确保所有页面过渡期间背景一致
    <View className="flex-1 bg-zinc-800">
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack 
          screenOptions={{ 
            headerShown: false,
            // 添加过渡动画配置，使页面过渡更平滑
            animation: 'fade',
            contentStyle: { backgroundColor: 'transparent' } // 保持内容背景透明，以便使用外层背景色
          }}
        >
          {/* 登录页面放在根Stack中，默认显示登录页 */}
          <Stack.Screen name="auth" />
          {/* 主应用页面作为另一个路由 */}
          <Stack.Screen name="pages" />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </View>
  );
}

// 根布局组件
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}

// 重定向首页到登录页面
export function Index() {
  return <Redirect href="/auth" />;
}
