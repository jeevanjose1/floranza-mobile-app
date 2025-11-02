import ProductCard from '@/components/common/product-card';
import Header from '@/components/layout/header';
import { media } from '@/constants/medias';
import useBreakPoints from '@/hooks/useBreajpoints';
import { FlashList } from '@shopify/flash-list';
import React, { useCallback, useState } from 'react';
import { RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Wishlist() {
  const [refreshing, setRefreshing] = useState(false);
  const { isWidth } = useBreakPoints({ breakPoint: 475 });

  // Mock wishlist data
  const wishlistItems = [
    {
      id: '1',
      name: 'Florista Kurti in Fox Georgette - Off-White',
      category: 'Kurti',
      price: 899,
      oldPrice: 1099,
      discount: 20,
      image: media.kurti,
    },
    {
      id: '2',
      name: 'Elegant Silk Saree with Zari Border',
      category: 'Saree',
      price: 1499,
      oldPrice: 1999,
      discount: 25,
      image: media.saree,
    },
    {
      id: '3',
      name: 'Cotton Anarkali Suit Set',
      category: 'Suit',
      price: 1299,
      oldPrice: 1699,
      discount: 23,
      image: media.dupattas,
    },
    {
      id: '4',
      name: 'Printed Rayon Kurta with Dupatta',
      category: 'Kurta Set',
      price: 999,
      oldPrice: 1299,
      discount: 18,
      image: media.home_were,
    },
    {
      id: '5',
      name: 'Designer Lehenga Choli with Embroidery',
      category: 'Lehenga',
      price: 2999,
      oldPrice: 3999,
      discount: 25,
      image: media.pree_book,
    },
  ];

  const numColumns = isWidth ? 2 : 3;

  // Pull-to-refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Reloading wishlist...');
      setRefreshing(false);
    }, 1500);
  }, []);

  if (wishlistItems.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
        <Header />
        <View className="flex-1 justify-center items-center px-6">
          <Text className="font-sam-bold text-xl text-dark-blue mb-2">
            Your Wishlist is Empty
          </Text>
          <Text className="font-sam-regular text-gray-600 text-center">
            Start adding items to your wishlist to save them for later
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <Header type='account' title='Wishlist'/>
      
      <FlashList
        data={wishlistItems}
        numColumns={numColumns}
        key={numColumns}
        className="px-4"
        renderItem={({ item }) => (
          <View className="flex-1 p-1">
            <ProductCard
              name={item.name}
              category={item.category}
              price={item.price}
              oldPrice={item.oldPrice}
              discount={item.discount}
              image={item.image}
            />
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#ED2353']}
            tintColor="#ED2353"
            title="Pull to refresh"
            titleColor="#ED2353"
          />
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20">
            <Text className="font-sam-regular text-gray-500">
              No items in wishlist
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}