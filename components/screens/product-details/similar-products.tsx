import ProductCard from '@/components/common/product-card'
import { media } from '@/constants/medias'
import React from 'react'
import { FlatList, Text, View } from 'react-native'

type Props = {}

const SimilarProducts = (props: Props) => {
  const products = [
    { id: '1', name: 'Florista Kurti in Fox Georgette - Off-White', category: 'Kurti', price: 899, oldPrice: 1099, discount: 20, image: media.kurti },
    { id: '2', name: 'Elegant Silk Saree with Zari Border', category: 'Saree', price: 1499, oldPrice: 1999, discount: 25, image: media.saree },
    { id: '3', name: 'Cotton Anarkali Suit Set', category: 'Suit', price: 1299, oldPrice: 1699, discount: 23, image: media.dupattas },
    { id: '4', name: 'Printed Rayon Kurta with Dupatta', category: 'Kurta Set', price: 999, oldPrice: 1299, discount: 18, image: media.home_were },
    { id: '5', name: 'Designer Lehenga Choli with Embroidery', category: 'Lehenga', price: 2999, oldPrice: 3999, discount: 25, image: media.pree_book },
    { id: '6', name: 'Casual Cotton Dress - Pink Floral', category: 'Dress', price: 799, oldPrice: 999, discount: 20, image: media.saree }
  ]

  return (
    <View >
      <Text className='font-sam-bold   mb-4'>
        Similar Products
      </Text>
      <FlatList
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className='mr-3 w-60' >
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
      />
    </View>
  )
}

export default SimilarProducts