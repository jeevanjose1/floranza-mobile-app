import ProductCard from '@/components/common/product-card'
import { calculate_discount } from '@/lib/utils'
import React from 'react'
import { FlatList, Text, View } from 'react-native'

type Props = {data:any[]}

const SimilarProducts = ({data}: Props) => {
  

  return (
    <View >
      <Text className='font-sam-bold   mb-4'>
        Similar Products
      </Text>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className='mr-3 w-60' >
            <ProductCard
              name={item?.title}
              price={item.price?.min as any}
              oldPrice={item.price?.max !== 0 && String(item.price?.max) as any}
              discount={item.price?.max ? calculate_discount(item?.price?.min, item?.price?.max) as number : 0}
              image={item.image}
              slug={item.slug}
            />
          </View>
        )}
      />
    </View>
  )
}

export default SimilarProducts