import { media } from '@/constants/medias';
import { useAuthenticated } from '@/hooks/useAutheticated';
import { useViewCart } from '@/services/queries/cart';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

type HeaderProps = {
  type?: 'default' | 'product_list' | 'account' | 'product_details' | 'cart';
  title?: string | boolean
  onBackPress?: () => void;
  onCartPress?: () => void;
  gradiant?: boolean
};

const Header = ({
  type = 'default',
  title,
  onBackPress,
  onCartPress,
  gradiant = false
}: HeaderProps) => {
  const router = useRouter();
  const { gToken } = useAuthenticated();

  const { data: cart_items } = useViewCart({
    token: gToken,
    filter: { state: null },
  });
  const cart = cart_items?.data;

  const handlePressSearch = () => {
    router.push('/search');
  };

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const handleCartPress = () => {
    if (onCartPress) {
      onCartPress();
    } else {
      router.push('/cart');
    }
  };

  const showSearchIcon = type !== 'account';

  return (
    <View className="px-4 min-h-[64px] bg-white z-10 flex-row justify-between items-center">
      {gradiant ? <LinearGradient
        colors={['#ED23534a', '#ED23532a', '#ED23531a', '#0000',]}
        style={{
          position: 'absolute',
          backgroundColor: 'white',
          left: 0,
          right: 0,
          top: '-100%',
          height: 100,
          zIndex: -1,
        }}
      /> : <View className='absolute  h-24 -top-[100%] -z-1 right-0 left-0 bg-white' />}

      {/* Left Section */}
      {type === 'default' ? (
        <Image
          source={media.logo}
          resizeMode="contain"
          className="max-w-36 h-20"
        />
      ) : (
        <View className="flex-row gap-4 items-center">
          <TouchableOpacity onPress={handleBackPress} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity>
          {title && <Text className="text-lg font-semibold">{title}</Text>}
        </View>
      )}

      {/* Right Section */}
      {type !== 'cart' && <View className="flex-row items-center gap-4">
        {showSearchIcon && (
          <TouchableOpacity onPress={handlePressSearch} activeOpacity={0.7}>
            <Ionicons name="search-outline" size={24} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleCartPress} activeOpacity={0.7} className="relative p-2">
  <Ionicons name="bag-outline" size={24} color="#333" />
  {cart?.cart?.length > 0 && (
    <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[18px] h-[18px] justify-center items-center px-1 border-2 border-white">
      <Text className="text-white text-[10px] font-bold leading-3">
        {cart.cart.length > 9 ? "9+" : cart.cart.length}
      </Text>
    </View>
  )}
</TouchableOpacity>
      </View>}
    </View>
  );
};

export default Header;