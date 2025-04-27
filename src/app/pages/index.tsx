import { Image, Platform, TouchableOpacity, View, Text } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import { useAuth } from '@/context/AuthContext';

export default function HomeScreen() {
  const { signOut } = useAuth();

  return (
    <View className="flex-1 p-4 bg-white dark:bg-gray-900">
      <View className="flex-row items-center gap-2 mb-6">
        <Text className="text-2xl font-bold text-gray-800 dark:text-white">欢迎!</Text>
        <HelloWave />
      </View>
      
      <View className="gap-2 mb-6">
        <Text className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Step 1: 尝试一下
        </Text>
        <Text className="text-gray-700 dark:text-gray-300">
          编辑 <Text className="font-semibold">app/pages/index.tsx</Text> 查看变化。
          按下{' '}
          <Text className="font-semibold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12'
            })}
          </Text>{' '}
          打开开发者工具。
        </Text>
      </View>
      
      <View className="gap-2 mb-6">
        <Text className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Step 2: 探索
        </Text>
        <Text className="text-gray-700 dark:text-gray-300">
          点击探索标签页了解此启动应用中包含的更多内容。
        </Text>
      </View>
      
      <View className="gap-2 mb-6">
        <Text className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Step 3: 重新开始
        </Text>
        <Text className="text-gray-700 dark:text-gray-300">
          当您准备好时，运行{' '}
          <Text className="font-semibold">npm run reset-project</Text> 获取一个全新的{' '}
          <Text className="font-semibold">app</Text> 目录。这将把当前的{' '}
          <Text className="font-semibold">app</Text> 移动到{' '}
          <Text className="font-semibold">app-example</Text>。
        </Text>
      </View>
      
      <TouchableOpacity 
        className="bg-red-500 p-3 rounded-lg items-center mt-5"
        onPress={signOut}
      >
        <Text className="text-white font-bold">退出登录</Text>
      </TouchableOpacity>
      
      <Image
        source={require('@/assets/images/partial-react-logo.png')}
        className="absolute bottom-0 left-0 w-72 h-44 opacity-50"
      />
    </View>
  );
}
