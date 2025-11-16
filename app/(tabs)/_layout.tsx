import TabButton from '@/components/common/tab-button';
import { useAuthenticated } from '@/hooks/useAutheticated';
import useBreakPoints from '@/hooks/useBreajpoints';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabLayout() {
  const router = useRouter()
  const { isWidth } = useBreakPoints({ breakPoint: 375 });
  const {isAuthenticated} = useAuthenticated()
  const handlePressNavigation = () => {
    if(isAuthenticated)router.push('/account')
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
                path={'/(tabs)/wishlist'}
                isActive={state.index === 1}
                icon={'heart'}
                title='Wishlist'
              />


              <TabButton
                path={'/cart'}
                icon={'shopping-cart'}
                title='Cart'
              />
              <TabButton
                onPress={handlePressNavigation}
                icon={'user'}
                title='Account'
              />

            </View>
          )
        }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="wishlist" />
      </Tabs>
    </SafeAreaView>
  );
}