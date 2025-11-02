import { media } from '@/constants/medias'
import { useRouter } from 'expo-router'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

type Props = {
  name?: string
  category?: string
  price?: number
  oldPrice?: number
  discount?: number
  image?: any
  onPress?: any
}

const ProductCard = ({
  name = 'Florista Kurti in Fox Georgette - Off-White',
  category = 'Kurti',
  price = 899,
  oldPrice = 1099,
  discount = 20,
  image = media.kurti,
  onPress,
}: Props) => {

  const router = useRouter()
  const handlePress = ()=>{
    router.push('/product-details')
    onPress
  }
  
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.9}
      className="w-full aspect-[4/7] bg-white  overflow-hidden"
    >
      {/* Image Section */}
      <View className="relative h-[79%]">
        <Image
          source={image}
          className="w-full h-full object-top "
          resizeMode="cover"
        />

        {/* Discount Badge */}
        {discount > 0 && (
          <View className="absolute top-2 left-2 bg-success px-2 py-0.5 rounded-md">
            <Text className="text-white text-[10px] font-sam-bold">
              {discount}% OFF
            </Text>
          </View>
        )}
      </View>

      {/* Content Section */}
      <View className="flex-1 p-2">
        <Text
          numberOfLines={1}
          className="font-sam-medium text-[13px] text-gray-900"
        >
          {name}
        </Text>

        <Text className="font-sam-regular text-gray-500 text-[11px] mb-1">
          {category}
        </Text>

        <View className="flex-row items-center">
          <Text className="font-sam-bold text-primary text-[13px] mr-2">
            ₹{price}
          </Text>

          {oldPrice && (
            <Text className="font-sam-medium text-gray-400 text-[11px] line-through mr-1">
              ₹{oldPrice}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default ProductCard
