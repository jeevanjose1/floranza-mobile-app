import Header from '@/components/layout/header'
import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const PaymentFailed = () => {
  const router = useRouter()

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <Header type="cart" title="Order Failed" />
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="flex-1 justify-center items-center px-4 py-8">
          {/* Error Animation/Icon */}
          <View className="items-center justify-center mb-8">
            <View className="w-32 h-32 bg-red-100 rounded-full items-center justify-center mb-6">
              <Feather name="x-circle" color="#EF4444" size={64} />
            </View>
            
            {/* Error Message */}
            <Text className="text-2xl font-bold text-gray-900 mb-3 text-center">
              Payment Failed!
            </Text>
            <Text className="text-gray-600 text-center px-4 mb-2">
              We're sorry, but your payment could not be processed.
            </Text>
            <Text className="text-gray-600 text-center px-4">
              Please check your payment details and try again.
            </Text>
          </View>

          

          {/* Help Card */}
          <View className="bg-blue-50 rounded-lg border border-blue-200 p-4 mb-8 w-full max-w-md">
            <View className="flex-row gap-3">
              <Feather name="help-circle" color="#3B82F6" size={20} className="mt-0.5" />
              <View className="flex-1">
                <Text className="text-sm font-medium text-blue-900 mb-1">
                  Need Help?
                </Text>
                <Text className="text-sm text-blue-800">
                  Contact your bank or try a different payment method. Our support team is also here to help.
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="space-y-3 w-full max-w-md px-4">
            <TouchableOpacity
              className="bg-primary px-6 mb-4 py-4 rounded-lg"
              onPress={() => router.replace('/cart')}
            >
              <Text className="text-white font-semibold text-center text-base">
                Return to Cart
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-white border border-gray-300 px-6 py-4 rounded-lg"
              onPress={() => router.replace('/')}
            >
              <Text className="text-gray-700 font-semibold text-center text-base">
                Continue Shopping
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="px-6 py-3"
              onPress={() => router.push('/contact')}
            >
              <Text className="text-blue-600 font-medium text-center text-sm">
                Contact Support
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default PaymentFailed