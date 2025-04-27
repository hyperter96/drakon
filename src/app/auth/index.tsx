import React, { useState, useEffect } from 'react';
import {
  ImageBackground,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  Alert,
  ActivityIndicator,
  Animated,
  Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import DragonLogo from '@/assets/images/dragon-symbol.svg';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { isWeChatInstalled } from '@/services/wechat';
import { userAgreement, childPrivacyPolicy, privacyPolicy } from '@/constants/agreements';
import { ENV } from '@/config/env';
// 协议弹窗组件
interface AgreementModalProps {
  visible: boolean;
  title: string;
  content: string;
  onClose: () => void;
}

const AgreementModal = ({ visible, title, content, onClose }: AgreementModalProps) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/70">
        <View className="bg-zinc-800 w-[90%] max-h-[80%] rounded-xl border border-primary/30 overflow-hidden">
          <View className="flex-row justify-between items-center p-4 border-b border-primary/30 bg-zinc-700">
            <Text className="text-white text-lg font-bold">{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
          
          <ScrollView className="p-4">
            <Text className="text-white leading-6">{content}</Text>
          </ScrollView>
          
          <View className="p-4 border-t border-primary/30 bg-zinc-700">
            <TouchableOpacity 
              className="bg-primary rounded-xl py-3 items-center"
              onPress={onClose}
            >
              <Text className="text-white font-bold">我已阅读</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// 手机验证码登录组件
const PhoneLogin = () => {
  const { sendSmsCode, phoneLogin } = useAuth();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  // 发送验证码
  const handleSendCode = async () => {
    if (!phone || phone.length !== 11) {
      Alert.alert('提示', '请输入有效的手机号码');
      return;
    }

    try {
      const success = await sendSmsCode(phone);
      if (success) {
        // 倒计时60秒
        setCountdown(60);
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error) {
      Alert.alert('发送失败', '验证码发送失败，请稍后重试');
    }
  };

  // 登录
  const handleLogin = async () => {
    if (!phone || phone.length !== 11) {
      Alert.alert('提示', '请输入有效的手机号码');
      return;
    }
    if (!code || code.length !== 6) {
      Alert.alert('提示', '请输入6位验证码');
      return;
    }
    if (!agreed) {
      Alert.alert('提示', '请阅读并同意用户协议和隐私政策');
      return;
    }

    try {
      setLoading(true);
      await phoneLogin(phone, code);
    } catch (error) {
      Alert.alert('登录失败', '验证码错误或已过期');
    } finally {
      setLoading(false);
    }
  };

  // 显示协议内容
  const showAgreement = (title: string) => {
    let content = '';
    
    if (title === '用户协议') {
      content = userAgreement;
    } else if (title === '隐私政策') {
      content = privacyPolicy;
    } else if (title === '未成年人个人信息保护规则') {
      content = childPrivacyPolicy;
    }
    
    setModalTitle(title);
    setModalContent(content);
    setModalVisible(true);
  };

  return (
    <Animated.View 
      className="w-full"
      style={{ opacity: fadeAnim }}
    >
      <View className="mb-5">
        <TextInput
          className="bg-zinc-600/60 border border-primary/60 rounded-xl px-4 py-3 text-white text-base h-[52px]"
          placeholder="请输入手机号码"
          placeholderTextColor="rgba(255,255,255,0.7)"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          maxLength={11}
        />
      </View>
      <View className="mb-5">
        <View className="flex-row h-[52px]">
          <TextInput
            className="flex-1 bg-zinc-600/60 border border-primary/60 rounded-xl px-4 py-3 text-white text-base mr-2.5 h-[52px]"
            placeholder="请输入验证码"
            placeholderTextColor="rgba(255,255,255,0.7)"
            keyboardType="number-pad"
            value={code}
            onChangeText={setCode}
            maxLength={6}
          />
          <TouchableOpacity
            className={`rounded-xl flex justify-center items-center min-w-[110px] h-[52px] ${
              countdown > 0 ? 'bg-gray-600' : 'bg-primary'
            } shadow-md shadow-black/30`}
            onPress={handleSendCode}
            disabled={countdown > 0}
          >
            <Text className="text-white text-base font-bold leading-none">
              {countdown > 0 ? `${countdown}秒` : '获取验证码'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        className="bg-primary rounded-xl flex items-center justify-center h-[52px] shadow-lg shadow-black/40"
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text className="text-white text-base font-bold leading-none">登录</Text>
        )}
      </TouchableOpacity>
      
      <View className="flex-row items-start mt-5">
        <TouchableOpacity 
          className="w-5 h-5 mt-0.5 rounded border border-primary/50 mr-2 justify-center items-center"
          onPress={() => setAgreed(!agreed)}
          activeOpacity={0.7}
        >
          {agreed && (
            <View className="w-3 h-3 bg-primary rounded-sm" />
          )}
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-white/70 text-xs leading-5">
            我已阅读并同意
            <Text className="text-primary" onPress={() => showAgreement('用户协议')}> 《用户协议》</Text>
            <Text className="text-primary" onPress={() => showAgreement('隐私政策')}> 《隐私政策》</Text>
            <Text className="text-primary" onPress={() => showAgreement('未成年人个人信息保护规则')}> 《未成年人个人信息保护规则》</Text>
          </Text>
        </View>
      </View>
      
      <AgreementModal 
        visible={modalVisible}
        title={modalTitle}
        content={modalContent}
        onClose={() => setModalVisible(false)}
      />
    </Animated.View>
  );
};

export default function AuthScreen() {
  const { wechatLogin } = useAuth();
  const [wechatLoading, setWechatLoading] = useState(false);
  const [wechatInstalled, setWechatInstalled] = useState(false);
  const [sdkAvailable, setSdkAvailable] = useState(false);
  const scaleAnim = useState(new Animated.Value(0.9))[0];
  const rotateAnim = useState(new Animated.Value(0))[0];
  
  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();

    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    
    // 检查微信是否已安装
    const checkWechatInstalled = async () => {
      try {
        if (ENV.debugWechat) {
          setWechatInstalled(false);
          setSdkAvailable(false);
          return;
        }
        // 检查微信是否已安装会隐式检查SDK是否可用
        const installed = await isWeChatInstalled();
        setWechatInstalled(installed);
        // 如果能正常执行isWeChatInstalled，说明SDK可用
        setSdkAvailable(true);
      } catch (error) {
        console.error('检查微信安装状态失败，SDK可能不可用', error);
        setSdkAvailable(false);
        setWechatInstalled(false);
      }
    };
    
    checkWechatInstalled();
  }, []);

  const handleWechatLogin = async () => {
    if (!sdkAvailable) {
      Alert.alert('提示', '微信SDK未正确加载，请使用手机号登录');
      return;
    }
    
    if (!wechatInstalled) {
      Alert.alert('提示', '请先安装微信客户端后再使用微信登录');
      return;
    }
    
    try {
      setWechatLoading(true);
      await wechatLogin();
    } catch (error) {
      console.error('微信登录失败', error);
    } finally {
      setWechatLoading(false);
    }
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });
  
  return (
    <View className="flex-1 bg-zinc-650 overflow-hidden relative">
      <StatusBar style="dark" />
      
      <ImageBackground
        source={require('@/assets/images/sign_in_bg.png')}
        className="absolute top-0 left-0 right-0 bottom-0 opacity-70"
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'rgba(24,24,27,0.8)', 'rgba(24,24,27,0.9)']}
          className="absolute top-0 left-0 right-0 bottom-0"
        />
      </ImageBackground>
      
      <View className="flex-1 absolute top-20 left-0 right-0 bottom-0 z-10 mt-10">
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ 
            flexGrow: 1,
            justifyContent: 'center',
            paddingTop: 20,
          }}
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            className="items-center mb-10"
            style={{ transform: [{scale: scaleAnim}] }}
          >
            <Animated.View 
              className="mb-6"
              style={{ transform: [{ rotate: rotation }] }}
            >
              <View className="w-[120px] h-[120px] rounded-full bg-zinc-600/60 justify-center items-center border-2 border-primary/70 shadow-2xl shadow-primary/40">
                <DragonLogo width={90} height={90} />
              </View>
            </Animated.View>
          </Animated.View>

          <View className="px-6 mb-5">
            <BlurView intensity={20} tint="dark" className="rounded-2xl overflow-hidden">
              <View className="bg-zinc-500/50 rounded-2xl p-6 border border-primary/30 w-full max-w-[400px] self-center shadow-xl shadow-black/50">
                <PhoneLogin />
                
                <View className="flex-row items-center my-6 py-2">
                  <View className="flex-1 h-0.5 bg-primary/40 border-t border-b border-primary/20" />
                  <Text className="mx-4 text-white text-base font-medium">或</Text>
                  <View className="flex-1 h-0.5 bg-primary/40 border-t border-b border-primary/20" />
                </View>

                <TouchableOpacity 
                  className={`rounded-xl flex flex-row items-center justify-center h-[52px] shadow-lg shadow-black/40 ${!sdkAvailable ? 'bg-gray-600' : 'bg-secondary'}`}
                  onPress={handleWechatLogin}
                  disabled={wechatLoading || !sdkAvailable}
                  activeOpacity={0.8}
                >
                  {wechatLoading ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <>
                      <Ionicons name="logo-wechat" size={24} color="white" />
                      <Text className="text-white text-base font-bold leading-none ml-2">微信登录</Text>
                    </>
                  )}
                </TouchableOpacity>
                
                {!sdkAvailable ? (
                  <Text className="text-yellow-300/80 text-xs mt-2 text-center">
                    微信登录不可用，请使用手机号登录
                  </Text>
                ) : !wechatInstalled && (
                  <Text className="text-yellow-300/80 text-xs mt-2 text-center">
                    未检测到微信客户端，请先安装微信
                  </Text>
                )}
              </View>
            </BlurView>
          </View>

          <View className="items-center mt-auto mb-4">
            <Text className="text-primary text-xs font-medium">© 2025 龙影幻境 版权所有</Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
} 