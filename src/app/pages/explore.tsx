import { Image, Platform, View, Text, ScrollView, StyleSheet } from 'react-native';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function ExploreScreen() {
  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      <View className="bg-gray-200 dark:bg-gray-700 h-40 relative">
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerIcon}
        />
      </View>
      
      <View className="p-4">
        <View className="flex-row gap-2 mb-4">
          <Text className="text-2xl font-bold text-gray-800 dark:text-white">探索</Text>
        </View>
        
        <Text className="text-gray-700 dark:text-gray-300 mb-4">
          此应用包含示例代码，帮助您开始使用。
        </Text>
        
        <Collapsible title="基于文件的路由">
          <Text className="text-gray-700 dark:text-gray-300">
            此应用有两个主要屏幕：{' '}
            <Text className="font-semibold">app/pages/index.tsx</Text> 和{' '}
            <Text className="font-semibold">app/pages/explore.tsx</Text>
          </Text>
          <Text className="text-gray-700 dark:text-gray-300 mt-2">
            布局文件 <Text className="font-semibold">app/pages/_layout.tsx</Text>{' '}
            设置了标签导航器。
          </Text>
          <ExternalLink href="https://docs.expo.dev/router/introduction">
            <Text className="text-blue-500 mt-2">了解更多</Text>
          </ExternalLink>
        </Collapsible>
        
        <Collapsible title="Android, iOS 和 Web 支持">
          <Text className="text-gray-700 dark:text-gray-300">
            您可以在 Android、iOS 和 Web 上打开此项目。要打开 Web 版本，在运行此项目的终端中按{' '}
            <Text className="font-semibold">w</Text>。
          </Text>
        </Collapsible>
        
        <Collapsible title="图片">
          <Text className="text-gray-700 dark:text-gray-300 mb-2">
            对于静态图像，您可以使用 <Text className="font-semibold">@2x</Text> 和{' '}
            <Text className="font-semibold">@3x</Text> 后缀为不同屏幕密度提供文件。
          </Text>
          <View className="items-center">
            <Image 
              source={require('@/assets/images/react-logo.png')} 
              className="self-center" 
            />
          </View>
          <ExternalLink href="https://reactnative.dev/docs/images">
            <Text className="text-blue-500 mt-2">了解更多</Text>
          </ExternalLink>
        </Collapsible>
        
        <Collapsible title="自定义字体">
          <Text className="text-gray-700 dark:text-gray-300">
            打开 <Text className="font-semibold">app/_layout.tsx</Text> 查看如何加载{' '}
            <Text style={{ fontFamily: 'SpaceMono' }}>
              自定义字体，例如这个。
            </Text>
          </Text>
          <ExternalLink href="https://docs.expo.dev/versions/latest/sdk/font">
            <Text className="text-blue-500 mt-2">了解更多</Text>
          </ExternalLink>
        </Collapsible>
        
        <Collapsible title="明暗模式组件">
          <Text className="text-gray-700 dark:text-gray-300">
            此模板支持明暗模式。<Text className="font-semibold">useColorScheme()</Text> 钩子让您可以检查
            用户当前的颜色方案，从而相应地调整 UI 颜色。
          </Text>
          <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
            <Text className="text-blue-500 mt-2">了解更多</Text>
          </ExternalLink>
        </Collapsible>
        
        <Collapsible title="动画">
          <Text className="text-gray-700 dark:text-gray-300">
            此模板包含一个动画组件示例。{' '}
            <Text className="font-semibold">components/HelloWave.tsx</Text> 组件使用
            强大的 <Text className="font-semibold">react-native-reanimated</Text>{' '}
            库创建一个挥手动画。
          </Text>
          {Platform.select({
            ios: (
              <Text className="text-gray-700 dark:text-gray-300 mt-2">
                <Text className="font-semibold">components/ParallaxScrollView.tsx</Text>{' '}
                组件为头部图像提供视差效果。
              </Text>
            ),
          })}
        </Collapsible>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerIcon: {
    position: 'absolute',
    bottom: -90,
    left: -35,
  },
});
