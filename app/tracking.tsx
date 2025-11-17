import Header from '@/components/layout/header'
import { useTrackOrder } from '@/services/queries/common'
import { Feather } from '@expo/vector-icons'
import React, { useState } from 'react'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

// --- Reusable Components ---

const InfoCard = ({
  title,
  iconName,
  children,
}: {
  title: string
  iconName: React.ComponentProps<typeof Feather>['name']
  children: React.ReactNode
}) => (
  <View className="bg-white rounded-lg border border-gray-200 mb-4 overflow-hidden">
    <View className="flex-row items-center gap-2 bg-gray-50 px-4 py-3 border-b border-gray-200">
      <Feather name={iconName} color="#374151" size={16} />
      <Text className="text-base font-semibold text-gray-900">{title}</Text>
    </View>
    <View className="p-4">{children}</View>
  </View>
)

const InfoRow = ({
  label,
  value,
  children,
}: {
  label: string
  value?: string
  children?: React.ReactNode
}) => (
  <View className="flex-row justify-between items-start mb-3">
    <Text className="text-sm text-gray-600 flex-shrink-0 mr-4">{label}</Text>
    {value && (
      <Text className="text-sm text-gray-900 font-medium text-right flex-1">
        {value}
      </Text>
    )}
    {children && <View className="flex-shrink-0 items-end">{children}</View>}
  </View>
)

const Tracking = () => {
  const { mutateAsync: track, isPending, error, data } = useTrackOrder() as any
  const [orderNumber, setOrderNumber] = useState<string>('')

  const handleSubmit = () => {
    if (orderNumber.trim()) {
      track(orderNumber.trim())
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <Header type="cart" title="Track your order" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
          <View className="p-4">
            {/* Search Card */}
            <InfoCard title="Enter Order Details" iconName="search">
              <Text className="text-sm text-gray-600 mb-4">
                Enter your order number to get the latest updates
              </Text>
              
              <View className="space-y-3">
                <TextInput
                  placeholder="Order Number"
                  value={orderNumber}
                  onChangeText={setOrderNumber}
                  onSubmitEditing={handleSubmit}
                  returnKeyType="search"
                  className="border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900"
                  placeholderTextColor="#9CA3AF"
                  editable={!isPending}
                />
                
                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={orderNumber.trim() === '' || isPending}
                  className={`rounded-lg px-6 py-3 mt-3 flex-row items-center justify-center ${
                    orderNumber.trim() === '' || isPending
                      ? 'bg-gray-300'
                      : 'bg-primary'
                  }`}
                >
                  {isPending ? (
                    <>
                      <ActivityIndicator color="white" size="small" />
                      <Text className="text-white font-medium ml-2">
                        Tracking...
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text className="text-white font-medium ml-2">Track</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </InfoCard>

            {/* Error Display */}
            {error && (
              <View className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <View className="flex-row items-start gap-2">
                  <Feather name="alert-circle" color="#991B1B" size={20} />
                  <Text className="text-red-700 flex-1">
                    {error?.data?.message || 'Failed to track order. Please try again.'}
                  </Text>
                </View>
              </View>
            )}

            {/* Order Details Display */}
            {data?.success && data?.data && (
              <View className="space-y-4">
                {/* Order Status Card */}
                <InfoCard title="Order Status" iconName="package">
                  <InfoRow label="Order Number:">
                    <Text className="text-sm font-mono text-gray-900">
                      {data.data.order_no}
                    </Text>
                  </InfoRow>

                  <InfoRow label="Order Date:" value={data.data.order_date} />

                  {data.data.courier && (
                    <InfoRow label="Courier:">
                      <View className="flex-row items-center gap-2">
                        <Feather name="truck" color="#6B7280" size={16} />
                        <Text className="text-sm text-gray-900">
                          {data.data.courier}
                        </Text>
                      </View>
                    </InfoRow>
                  )}

                  {data.data.track_id && (
                    <InfoRow label="Tracking ID:">
                      <Text className="text-sm font-mono text-gray-900">
                        {data.data.track_id}
                      </Text>
                    </InfoRow>
                  )}

                  {data.data.track_url && (
                    <View className="mt-2 pt-3 border-t border-gray-200">
                      <TouchableOpacity
                        onPress={() => {
                          // Use Linking.openURL(data.data.track_url) in real implementation
                          console.log('Open URL:', data.data.track_url)
                        }}
                        className="bg-primary px-4 py-3 rounded-lg flex-row items-center justify-center"
                      >
                        <Feather name="external-link" size={16} color="white" />
                        <Text className="text-white font-medium ml-2">
                          Track on Courier Website
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </InfoCard>

                {/* Shipping Address Card */}
                <InfoCard title="Shipping Address" iconName="map-pin">
                  <View className="space-y-2">
                    <View className="flex-row items-center gap-2 mb-2">
                      <Feather name="user" color="#6B7280" size={16} />
                      <Text className="font-medium text-gray-900">
                        {data.data.address.fname}
                      </Text>
                    </View>

                    <Text className="text-gray-900 pl-6">
                      {data.data.address.address_1}
                    </Text>
                    
                    {data.data.address.address_2 && (
                      <Text className="text-gray-900 pl-6">
                        {data.data.address.address_2}
                      </Text>
                    )}

                    <Text className="text-gray-900 pl-6">
                      {data.data.address.city}, {data.data.address.state} -{' '}
                      {data.data.address.postcode}
                    </Text>

                    <Text className="text-gray-900 pl-6">
                      {data.data.address.country}
                    </Text>

                    <View className="border-t border-gray-200 mt-3 pt-3" />

                    <View className="flex-row items-center gap-2">
                      <Feather name="phone" color="#6B7280" size={16} />
                      <Text className="text-gray-900">
                        {data.data.address.phone}
                      </Text>
                    </View>

                    <View className="flex-row items-center gap-2">
                      <Feather name="mail" color="#6B7280" size={16} />
                      <Text className="text-gray-900">
                        {data.data.address.email}
                      </Text>
                    </View>
                  </View>
                </InfoCard>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Tracking