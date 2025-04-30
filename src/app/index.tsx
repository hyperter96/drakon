import React, { useEffect, useState, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { Redirect, router } from 'expo-router';
import DragonLogo from '@/assets/images/dragon-symbol.svg';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

export default function Index() {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const hasStartedRedirect = useRef(false);
  const scaleAnim = useState(new Animated.Value(0.5))[0];
  const opacityAnim = useState(new Animated.Value(0))[0];
  const rotateAnim = useState(new Animated.Value(0))[0];
  const fadeOutAnim = useState(new Animated.Value(1))[0];

  // 启动重定向过程函数
  const startRedirect = () => {
    if (hasStartedRedirect.current) return;
    hasStartedRedirect.current = true;
    
    // 先启动淡出动画
    Animated.timing(fadeOutAnim, {
      toValue: 0,
      duration: 300, // 更短的淡出时间
      useNativeDriver: true,
    }).start(() => {
      // 动画完成后才设置重定向状态
      setIsRedirecting(true);
    });
  };

  useEffect(() => {
    // 动画序列
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000, // 更短的旋转时间
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 等待较短时间后启动重定向
      // 减少等待时间以缩短过渡
      setTimeout(startRedirect, 500);
    });
    
    // 提前创建新页面，减少延迟
    setTimeout(() => {
      // 这里不执行任何操作，但React会提前准备下一个路由
      // 利用React的预渲染机制
      const prepareNextScreen = () => {
        if (!hasStartedRedirect.current) {
          requestAnimationFrame(prepareNextScreen);
        }
      };
      prepareNextScreen();
    }, 300);
  }, []);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  // 只有在动画完成并且触发重定向状态后才实际重定向
  if (isRedirecting) {
    return <Redirect href="/auth" />;
  }

  return (
    // 使用View作为外层容器，确保背景色始终存在
    <View className="flex-1 bg-zinc-800">
      <Animated.View 
        className="flex-1 justify-center items-center"
        style={{ opacity: fadeOutAnim }}
      >
        <StatusBar style="light" />
        
        <LinearGradient
          colors={['rgba(24,24,27,0.9)', 'rgba(24,24,27,0.7)', 'rgba(0,0,0,0.8)']}
          className="absolute top-0 left-0 right-0 bottom-0"
        />
        
        <Animated.View 
          className="items-center justify-center"
          style={{ 
            opacity: opacityAnim,
            transform: [
              { scale: scaleAnim },
              { rotate: rotation }
            ]
          }}
        >
          <View className="w-[180px] h-[180px] rounded-full bg-zinc-700/80 justify-center items-center border-4 border-primary/60 shadow-2xl shadow-primary/40">
            <DragonLogo width={130} height={130} />
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
} 