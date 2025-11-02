import QuantitySelector from "@/components/common/quandity-selector"
import Header from "@/components/layout/header"
import { media } from "@/constants/medias"
import { Ionicons } from "@expo/vector-icons"
import { useState } from "react"
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function Cart() {
  const [cartItems, setCartItems] = useState([
      { id: '1', name: 'Florista Kurti in Fox Georgette - Off-White', category: 'Kurti', price: 899, oldPrice: 1099, discount: 20, image: media.kurti },
      { id: '2', name: 'Elegant Silk Saree with Zari Border', category: 'Saree', price: 1499, oldPrice: 1999, discount: 25, image: media.saree },
      { id: '3', name: 'Cotton Anarkali Suit Set', category: 'Suit', price: 1299, oldPrice: 1699, discount: 23, image: media.dupattas },
      { id: '4', name: 'Printed Rayon Kurta with Dupatta', category: 'Kurta Set', price: 999, oldPrice: 1299, discount: 18, image: media.home_were },
      { id: '5', name: 'Designer Lehenga Choli with Embroidery', category: 'Lehenga', price: 2999, oldPrice: 3999, discount: 25, image: media.pree_book },
      { id: '6', name: 'Casual Cotton Dress - Pink Floral', category: 'Dress', price: 799, oldPrice: 999, discount: 20, image: media.saree }
    ])

  
  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id))
  }
  const [quantity, setQuantity] = useState<number>(1)
  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity)
  }
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.price, 0)
  const shipping = 30
  const total = subtotal + shipping

  return (
    <SafeAreaView className='flex-1 ' edges={['top']}>
      <Header type="cart" title='Cart' />
      <ScrollView className="flex-1 bg-gray-50">
        <View className="p-4">

          {/* Cart Items */}
          <View className="mb-6">
            {cartItems.map(item => (
              <View key={item.id} className="bg-white rounded-md p-4 shadow-sm mb-4">
                <View className="flex-row">
                  <Image
                    source={item.image }
                    className="w-24 h-24 rounded-md"
                    resizeMode="cover"
                  />
                  <View className="flex-1 ml-4">
                    <Text className="text-lg font-semibold mb-1">{item.name}</Text>
                    <Text className="text-gray-600 text-sm mb-2">Size: XL</Text>
                    <Text className="text-lg font-bold text-primary">₹{item.price.toFixed(2)}</Text>
                  </View>
                </View>

                <View className="flex-row justify-between items-center mt-4 pt-4 border-t border-gray-200">
                  {/* Quantity Selector */}
                  <QuantitySelector quantity={quantity}
                    onQuantityChange={handleQuantityChange}
                    minQuantity={1}
                    maxQuantity={99}
                    showLabel={false} />

                  {/* Remove Button */}
                  <TouchableOpacity
                    onPress={() => removeItem(item.id)}
                    className="px-4 py-2  "
                  >
                    <Ionicons name="trash" size={24} color={'gray'} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {/* Order Summary */}
          <View className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <Text className="text-xl font-bold mb-4">Order Summary</Text>

            <View className="mb-4">
              <View className="flex-row justify-between mb-3">
                <Text className="text-gray-600">Subtotal</Text>
                <Text className="font-semibold">₹{subtotal.toFixed(2)}</Text>
              </View>

              <View className="flex-row justify-between mb-3">
                <Text className="text-gray-600">Shipping</Text>
                <Text className="font-semibold">₹{shipping.toFixed(2)}</Text>
              </View>

              <View className="border-t border-gray-200 pt-3 flex-row justify-between">
                <Text className="text-lg font-bold">Total</Text>
                <Text className="text-lg font-bold text-primary">₹{total.toFixed(2)}</Text>
              </View>
            </View>

            <View className="border-t border-gray-200 pt-4 mb-4">
              <View className="flex-row justify-between items-start">
                <View>
                  <Text className="text-gray-600 text-sm mb-1">Ship to</Text>
                  <Text className="font-semibold">Kerala</Text>
                </View>
                <TouchableOpacity>
                  <Text className="underline  text-black/70 font-semibold">Change</Text>
                </TouchableOpacity>
              </View>
            </View>


          </View>
        </View>

      </ScrollView>
      <View className=" h-24 px-4 pt-4 bg-white"><TouchableOpacity className="bg-primary rounded-lg py-3 items-center">
        <Text className="text-white text-lg font-bold">Place order</Text>
      </TouchableOpacity></View>
    </SafeAreaView>
  )
}