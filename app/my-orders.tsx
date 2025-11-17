import Header from '@/components/layout/header';
import { useListOrder } from '@/services/queries/account';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MyOrderList = () => {
  const { data: order_list, isLoading, error } = useListOrder()
  const router = useRouter()
  
  const getStatusColor = (status: number) => {
    switch (status) {
      case 1: return { bg: '#FEF3C7', text: '#92400E' }
      case 2: return { bg: '#FFEDD5', text: '#9A3412' }
      case 3:
      case 33: return { bg: '#DBEAFE', text: '#1E40AF' }
      case 4: return { bg: '#D1FAE5', text: '#065F46' }
      case 5: return { bg: '#FEE2E2', text: '#991B1B' }
      case 6: return { bg: '#F3E8FF', text: '#6B21A8' }
      case 7: return { bg: '#F3F4F6', text: '#374151' }
      default: return { bg: '#F3F4F6', text: '#374151' }
    }
  }

  const getStatusText = (status: number) => {
    switch (status) {
      case 1: return 'Processing'
      case 2: return 'Packing'
      case 3:
      case 33: return 'Shipping'
      case 4: return 'Shipping Completed'
      case 5: return 'Under Production'
      case 6: return 'Refund'
      case 7: return 'Canceled'
      default: return 'Unknown'
    }
  }

  const handleViewDetails = (orderId: string) => {
    router.push({ pathname: '/order-details', params: { order_id: orderId } })
  }

  const handleStartShopping = () => {
    router.push('/(tabs)')
  }

  // Loading State
  if (isLoading) {
    return (
      <SafeAreaView className='flex-1 bg-gray-50' edges={['top']}>
        <Header title='My Orders' type="account" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#ED2353" />
          <Text className="mt-4 text-gray-600 text-base">Loading orders...</Text>
        </View>
      </SafeAreaView>
    )
  }

  // Error State
  if (error) {
    return (
      <SafeAreaView className='flex-1 bg-gray-50' edges={['top']}>
        <Header title='My Orders' type="account" />
        <View className="flex-1 items-center justify-center px-8">
          <MaterialCommunityIcons name="alert-circle-outline" size={80} color="#D1D5DB" />
          <Text className="mt-6 text-xl font-semibold text-gray-800">Failed to Load Orders</Text>
          <Text className="mt-2 text-center text-gray-500 text-base">
            Something went wrong while loading your orders. Please try again.
          </Text>
          <TouchableOpacity 
            onPress={() => window.location.reload()}
            className="mt-6 bg-primary rounded-lg py-3 px-8"
          >
            <Text className="text-white text-base font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  // Empty State
  if (!order_list?.data?.data || order_list?.data?.data?.length === 0) {
    return (
      <SafeAreaView className='flex-1 bg-gray-50' edges={['top']}>
        <Header title='My Orders' type="account" />
        <View className="flex-1 items-center justify-center px-8">
          <MaterialCommunityIcons name="package-variant-closed" size={80} color="#D1D5DB" />
          <Text className="mt-6 text-xl font-semibold text-gray-800">No Orders Yet</Text>
          <Text className="mt-2 text-center text-gray-500 text-base">
            You haven't placed any orders yet. Start shopping to see your orders here!
          </Text>
          <TouchableOpacity 
            onPress={handleStartShopping}
            className="mt-6 bg-primary rounded-lg py-3 px-8"
          >
            <Text className="text-white text-base font-semibold">Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  // Orders List
  return (
    <SafeAreaView className='flex-1 bg-gray-50' edges={['top']}>
      <Header title='My Orders' type="account" />

      <ScrollView className="flex-1">
        <View className="p-4">
          <View className="mb-6">
            <Text className="text-gray-600">
              {order_list?.data?.data?.length} {order_list?.data?.data?.length === 1 ? 'order' : 'orders'} found
            </Text>
          </View>

          <View className="space-y-4">
            {order_list?.data?.data?.map((order: any) => {
              const statusColor = getStatusColor(order.order_status)
              
              return (
                <View 
                  key={order.id} 
                  className="bg-white rounded-lg border border-gray-300 p-6 mb-4"
                >
                  <View className="flex-col gap-4">
                    <View className="flex-row items-start gap-4">
                      <Feather name='package' color="#6B7280" size={20} className="mt-1" />
                      
                      <View className="flex-1">
                        <View className="flex-row items-center gap-3 mb-2 flex-wrap">
                          <Text className="font-semibold text-gray-700">
                            #{order.order_no}
                          </Text>
                          <View 
                            className="px-2 py-1 rounded-full"
                            style={{ backgroundColor: statusColor.bg }}
                          >
                            <Text 
                              className="text-xs font-medium"
                              style={{ color: statusColor.text }}
                            >
                              {getStatusText(order.order_status)}
                            </Text>
                          </View>
                        </View>

                        <View className="flex-row items-center gap-2 mb-3">
                          <AntDesign name='calendar' color="#6B7280" size={16} />
                          <Text className="text-sm text-gray-600">{order.date}</Text>
                          <Text className="text-gray-600">•</Text>
                          <Text className="text-sm text-gray-600">
                            {order.order_items.length} item{order.order_items.length > 1 ? 's' : ''}
                          </Text>
                        </View>

                        <View className="mb-4">
                          <Text 
                            className="text-sm text-gray-700 mb-1"
                            numberOfLines={2}
                          >
                            {order.order_items[0].product_name}
                          </Text>
                          <Text className="text-xs text-gray-500">
                            Size: {order.order_items[0].product_variation}
                            {order.order_items.length > 1 && (
                              <Text> +{order.order_items.length - 1} more</Text>
                            )}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View className="flex-row items-center justify-between border-t border-gray-200 pt-4">
                      <View>
                        <Text className="text-lg font-semibold text-gray-700">
                          ₹{order.price.toLocaleString()}
                        </Text>
                        <Text className="text-xs text-gray-500">
                          {order.paid_status === 1 ? 'Paid' : 'Unpaid'}
                        </Text>
                      </View>
                      
                      <TouchableOpacity 
                        className="bg-primary px-6 py-3 rounded-lg"
                        onPress={() => handleViewDetails(order.id)}
                      >
                        <Text className="text-white font-medium">
                          View Details
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default MyOrderList