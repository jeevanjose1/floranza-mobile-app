import Header from '@/components/layout/header'
import { useListOrder } from '@/services/queries/account'
import { Feather } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import {
    ActivityIndicator,
    Image,
    Linking,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

// --- Utility Functions ---
// Grouped helper functions for better organization

const OrderUtils = {
  getStatusColor: (status: number) => {
    switch (status) {
      case 1: return { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' }
      case 2: return { bg: '#FFEDD5', text: '#9A3412', border: '#FED7AA' }
      case 3:
      case 33: return { bg: '#DBEAFE', text: '#1E40AF', border: '#BFDBFE' }
      case 4: return { bg: '#D1FAE5', text: '#065F46', border: '#A7F3D0' }
      case 5: return { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA' }
      case 6: return { bg: '#F3E8FF', text: '#6B21A8', border: '#E9D5FF' }
      case 7: return { bg: '#F3F4F6', text: '#374151', border: '#E5E7EB' }
      default: return { bg: '#F3F4F6', text: '#374151', border: '#E5E7EB' }
    }
  },

  getStatusText: (status: number) => {
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
  },

  getStatusIcon: (status: number) => {
    const color = OrderUtils.getStatusColor(status).text
    const size = 16
    switch (status) {
      case 1: return <Feather name="clock" color={color} size={size} />
      case 2: return <Feather name="package" color={color} size={size} />
      case 3:
      case 33: return <Feather name="truck" color={color} size={size} />
      case 4: return <Feather name="check-circle" color={color} size={size} />
      case 5: return <Feather name="alert-circle" color={color} size={size} />
      case 6: return <Feather name="alert-circle" color={color} size={size} />
      case 7: return <Feather name="alert-circle" color={color} size={size} />
      default: return <Feather name="alert-circle" color={color} size={size} />
    }
  },
}

// --- Reusable Sub-Components ---

/**
 * A small, stateful button for copying text to the clipboard.
 */
const CopyToClipboardButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = React.useState(false)

  const copyToClipboard = async () => {
    if (!text) return
    await Clipboard.setStringAsync(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <TouchableOpacity onPress={copyToClipboard} className="p-1">
      {copied ? (
        <Feather name="check-circle" color="#10B981" size={16} />
      ) : (
        <Feather name="copy" color="#6B7280" size={16} />
      )}
    </TouchableOpacity>
  )
}

/**
 * A generic card wrapper for sections.
 */
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

/**
 * A consistent row for displaying key-value pairs.
 */
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
    <Text className="text-sm text-gray-600">{label}</Text>
    {value && (
      <Text className="text-sm text-gray-900 font-medium text-right">
        {value}
      </Text>
    )}
    {/* Pass children for custom content like buttons or badges */}
    {children && <View className="flex-shrink items-end">{children}</View>}
  </View>
)

/**
 * Redesigned card for a single order item.
 */
const OrderItemCard = ({ item }: { item: any }) => (
  <View className="flex-row space-x-4 gap-5 p-4 border border-gray-200 rounded-lg">
    <Image
      source={{ uri: item.product_image }}
      className="w-24 h-full rounded-md bg-gray-100"
      resizeMode="cover"
    />
    <View className="flex-1">
      <Text className="font-medium text-gray-900 mb-2" numberOfLines={2}>
        {item.product_name}
      </Text>
      <InfoRow label="SKU:" value={item.sku} />
      <InfoRow label="Size:" value={item.product_variation} />
      <InfoRow label="Qty:" value={item.qty.toString()} />
      <InfoRow
        label="Price:"
        value={`₹${parseFloat(item.price).toLocaleString()}`}
      />
    </View>
  </View>
)

/**
 * Component for the Order Summary, including the total calculation fix.
 */
const OrderSummary = ({
  order,
  subtotal,
  totalGst,
}: {
  order: any
  subtotal: number
  totalGst: number
}) => {
  // --- BUG FIX: Correctly calculate the total ---
  const total = subtotal + totalGst + parseFloat(order.shipping_charge)

  return (
    <InfoCard title="Order Summary" iconName="file-text">
      <View className="space-y-3">
        <InfoRow label="Subtotal:" value={`₹${subtotal.toLocaleString()}`} />
        <InfoRow label="GST:" value={`₹${totalGst.toLocaleString()}`} />
        <InfoRow
          label="Shipping:"
          value={
            order.shipping_charge === 0
              ? 'Free'
              : `₹${order.shipping_charge.toLocaleString()}`
          }
        />
        <View className="border-t border-gray-200 pt-3 mt-2" />
        <View className="flex-row justify-between">
          <Text className="text-lg font-semibold text-gray-900">Total:</Text>
          <Text className="text-lg font-semibold text-gray-900">
            ₹{total.toLocaleString()}
          </Text>
        </View>
      </View>
    </InfoCard>
  )
}

/**
 * Component for displaying the shipping address.
 */
const ShippingAddressCard = ({ address }: { address: any }) => (
  <InfoCard title="Shipping Address" iconName="map-pin">
    <View className="space-y-2">
      <View className="flex-row items-center gap-2">
        <Feather name="user" color="#6B7280" size={16} />
        <Text className="font-medium text-gray-900">{address.fname}</Text>
      </View>
      <Text className="text-gray-900 pl-6">{address.address_1}</Text>
      {address.address_2 && (
        <Text className="text-gray-900 pl-6">{address.address_2}</Text>
      )}
      <Text className="text-gray-900 pl-6">
        {address.city}, {address.state} {address.postcode}
      </Text>
      <Text className="text-gray-900 pl-6">{address.country}</Text>

      <View className="border-t border-gray-200 mt-3 pt-3" />

      <View className="flex-row mb-2 items-center gap-2 pt-1">
        <Feather name="phone" color="#6B7280" size={16} />
        <Text className="text-gray-900">{address.phone}</Text>
      </View>
      <View className="flex-row items-center gap-2">
        <Feather name="mail" color="#6B7280" size={16} />
        <Text className="text-gray-900">{address.email}</Text>
      </View>
    </View>
  </InfoCard>
)

// --- Main Component ---

const OrderDetailsContent = () => {
  const { order_id } = useLocalSearchParams()
  const { data: order_list, isLoading } = useListOrder()

  // Memoize order lookup
  const order = React.useMemo(
    () => order_list?.data?.data?.find((item: any) => item?.id === order_id),
    [order_list, order_id]
  )

  // Memoize calculations
  const { subtotal, totalGst } = React.useMemo(() => {
    if (!order) return { subtotal: 0, totalGst: 0 }

    const sub =
      order.order_items?.reduce(
        (sum: number, item: any) => sum + parseFloat(item.price) * item.qty,
        0
      ) || 0

    const gst =
      order.order_items?.reduce(
        (sum: number, item: any) => sum + parseFloat(item.gst) * item.qty,
        0
      ) || 0

    return { subtotal: sub, totalGst: gst }
  }, [order])

  // --- Loading State ---
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <Header type="cart" title="Order Details" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      </SafeAreaView>
    )
  }

  // --- Not Found State ---
  if (!order) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <Header type="cart" title="Order Not Found" />
        <View className="flex-1 items-center justify-center p-6 text-center">
          <Feather name="package" color="#9CA3AF" size={48} />
          <Text className="text-lg font-medium text-gray-900 mt-4 mb-2">
            Order not found
          </Text>
          <Text className="text-gray-500 text-center">
            The order you're looking for doesn't exist or has been removed.
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  // --- Main Content ---
  const statusColor = OrderUtils.getStatusColor(order.order_status)

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      {/* BUG FIX: Corrected Header Title */}
      <Header type="cart" title="Order Details" />
      <ScrollView className="flex-1">
        <View className="p-4">
          {/* Header */}
          <View className="mb-6">
            <View className="mb-3">
              <Text className="text-2xl font-bold text-gray-900">
                Order #{order.order_no}
              </Text>
              <Text className="text-gray-600 mt-1">
                Placed on {order.date_normal_format}
              </Text>
            </View>
            <View
              className="flex-row items-center gap-2 px-4 py-2 rounded-lg self-start"
              style={{
                backgroundColor: statusColor.bg,
                borderWidth: 1,
                borderColor: statusColor.border,
              }}
            >
              {OrderUtils.getStatusIcon(order.order_status)}
              <Text className="font-medium" style={{ color: statusColor.text }}>
                {OrderUtils.getStatusText(order.order_status)}
              </Text>
            </View>
          </View>

          {/* Order Information */}
          <InfoCard title="Order Information" iconName="package">
            <InfoRow label="Order Number:">
              <View className="flex-row items-center gap-2">
                <Text className="text-base font-mono text-gray-900">
                  #{order.order_no}
                </Text>
                <CopyToClipboardButton text={order.order_no} />
              </View>
            </InfoRow>

            <InfoRow
              label="Order Date:"
              value={order.date_normal_format}
            />
            <InfoRow
              label="Payment Method:"
              value={order.payment_gateway}
            />

            <InfoRow label="Payment Status:">
              <View
                className="px-2 py-1 rounded self-start"
                style={{
                  backgroundColor:
                    order.paid_status === 1 ? '#D1FAE5' : '#FEE2E2',
                }}
              >
                <Text
                  className="text-xs font-medium"
                  style={{
                    color: order.paid_status === 1 ? '#065F46' : '#991B1B',
                  }}
                >
                  {order.paid_status === 1 ? 'Paid' : 'Unpaid'}
                </Text>
              </View>
            </InfoRow>

            <InfoRow label="Courier:" value={order.courier} />

            {order.track_id && (
              <InfoRow label="Tracking ID:">
                <View className="flex-row items-center gap-2">
                  <Text className="text-blue-600 font-mono">
                    {order.track_id}
                  </Text>
                  <CopyToClipboardButton text={order.track_id} />
                </View>
              </InfoRow>
            )}
          </InfoCard>

          {/* Order Items */}
          <InfoCard
            title={`Items Ordered (${order.order_items.length})`}
            iconName="shopping-bag"
          >
            <View className="space-y-4">
              {order.order_items.map((item: any) => (
                <OrderItemCard key={item.item_id} item={item} />
              ))}
            </View>
          </InfoCard>

          {/* Order Summary */}
          <OrderSummary
            order={order}
            subtotal={subtotal}
            totalGst={totalGst}
          />

          {/* Shipping Address */}
          <ShippingAddressCard address={order.address} />

          {/* Track Order Button */}
          {order?.order_status === 4 && order?.tracking_url !== '' && (
            <View className="mt-2 mb-4">
              <TouchableOpacity
                className="bg-blue-600 px-6 py-3 rounded-lg flex-row items-center justify-center space-x-2"
                onPress={() => Linking.openURL(order.tracking_url)}
              >
                <Feather name="truck" size={16} color="white" />
                <Text className="text-white font-medium text-center">
                  Track Order
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default OrderDetailsContent