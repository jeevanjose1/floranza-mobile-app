import Header from '@/components/layout/header';
import Hero from '@/components/screens/home/hero';
import LatestProducts from '@/components/screens/home/latest-products';
import MostSellingProducts from '@/components/screens/home/most-selling-products';
import ShopByCategory from '@/components/screens/home/shop-by-category';
import { useGetCatogeries, useGetLatestProducts, useGetMostSelleingProducts } from '@/services/queries/home';
import React, { useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);

  // You'll need to expose these from your child components
  const { isLoading: categoriesLoading } = useGetCatogeries?.() || { isLoading: false };
  const { isLoading: latestLoading } = useGetLatestProducts?.() || { isLoading: false };
  const { isLoading: sellingLoading } = useGetMostSelleingProducts?.() || { isLoading: false };

  // Check if any component is loading
  const isInitialLoading = categoriesLoading || latestLoading || sellingLoading;

  const onRefresh = async () => {
    setRefreshing(true);
    // Child components will refetch with their own refetch functions
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Show single loader while initial data loads
  if (isInitialLoading && !refreshing) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
        <Header gradiant />
        <View className='flex-1 justify-center items-center'>
          <ActivityIndicator size='large' color='#ED2353' />
          <Text className='mt-4 text-gray-600 text-base'>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <Header gradiant />
      
      <ScrollView
        className="flex-1"
        removeClippedSubviews={true}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#ED2353']}
            tintColor='#ED2353'
            title='Pull to refresh'
            titleColor='#ED2353'
          />
        }
      >
        <Hero />
        <ShopByCategory />
        <LatestProducts />
        <MostSellingProducts />
      </ScrollView>
    </SafeAreaView>
  );
}