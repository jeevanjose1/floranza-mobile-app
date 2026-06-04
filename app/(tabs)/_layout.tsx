import TabButton from '@/components/common/tab-button';
import { useAuthenticated } from '@/hooks/useAutheticated';
import useBreakPoints from '@/hooks/useBreajpoints';
import { RelativePathString, Tabs, useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabLayout() {
  const router = useRouter()
  const { isWidth } = useBreakPoints({ breakPoint: 375 });
  const {isAuthenticated} = useAuthenticated()
  const handlePressNavigation = (path:RelativePathString) => {
    if(isAuthenticated)router.push(path)
    else router.push('/login')
    
  }

  return (
    <SafeAreaView className='flex-1 bg-white' edges={['bottom']}>
      <Tabs
        screenOptions={{
          headerShown: false,
          animation: 'shift'
        }}

        tabBar={({ state }) => {

          return (
            <View
              className={`h-[80px] flex-row  justify-around ${isWidth ? 'px-2' : 'px-8'}  items-center`}
            >

              <TabButton
                path={'/(tabs)'}
                icon={'home'}
                isActive={state.index === 0}
                title='Home'
              />

              <TabButton
                onPress={()=>handlePressNavigation('/wishlist' as RelativePathString)}
                icon={'heart'}
                title='Wishlist'
              />


              <TabButton
                path={'/cart'}
                icon={'shopping-cart'}
                title='Cart'
              />
              <TabButton
                onPress={()=>handlePressNavigation('/account' as RelativePathString)}
                icon={'user'}
                title='Account'
              />

            </View>
          )
        }}
      >
        <Tabs.Screen name="index" />

      </Tabs>
    </SafeAreaView>
  );
}