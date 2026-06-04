import Header from "@/components/layout/header";
import { useGetPaymentDetails } from "@/services/queries/payment";
import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- Utility Components ---

const CopyToClipboardButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async () => {
    if (!text) return;
    await Clipboard.setStringAsync(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <TouchableOpacity onPress={copyToClipboard} className="p-1">
      {copied ? (
        <Feather name="check-circle" color="#10B981" size={16} />
      ) : (
        <Feather name="copy" color="#6B7280" size={16} />
      )}
    </TouchableOpacity>
  );
};

const InfoCard = ({
  title,
  iconName,
  children,
}: {
  title: string;
  iconName: React.ComponentProps<typeof Feather>["name"];
  children: React.ReactNode;
}) => (
  <View className="bg-white rounded-lg border border-gray-200 mb-4 overflow-hidden">
    <View className="flex-row items-center gap-2 bg-gray-50 px-4 py-3 border-b border-gray-200">
      <Feather name={iconName} color="#374151" size={16} />
      <Text className="text-base font-semibold text-gray-900">{title}</Text>
    </View>
    <View className="p-4">{children}</View>
  </View>
);

const InfoRow = ({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) => (
  <View className="flex-row justify-between items-start mb-3">
    <Text className="text-sm text-gray-600">{label}</Text>
    {value && (
      <Text className="text-sm text-gray-900 font-medium text-right flex-1 ml-2">
        {value}
      </Text>
    )}
    {children && <View className="flex-shrink items-end">{children}</View>}
  </View>
);

const OrderItemCard = ({ item }: { item: any }) => (
  <View className="p-4 bg-gray-50 rounded-lg mb-3">
    <View className="flex-1">
      <Text className="font-medium text-gray-900 mb-2" numberOfLines={2}>
        {item.name}
      </Text>
      <View className="flex-row justify-between items-center">
        <Text className="text-sm text-gray-600">Quantity: {item.quantity}</Text>
        <Text className="font-semibold text-gray-900">
          ₹{(item.price * item.quantity).toLocaleString()}
        </Text>
      </View>
    </View>
  </View>
);

// --- Main Component ---

const PaymentSuccess = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const {
    data: details,
    isLoading,
    error,
  } = useGetPaymentDetails(params.order_id as string);

  const orderData = React.useMemo(() => {
    if (!details?.data) return null;

    return {
      orderNumber: details.data.order_no,
      orderDate: details.data.date_normal_format,
      email: details.data.address?.email,
      courier: details.data.courier,
      is_preorder: Boolean(details.data.is_pre_order),
      preorder_data: details.data.pre_order_date,
      customerName: details.data.address?.fname,
      shippingAddress: {
        name: details.data.address?.fname,
        addr_1: details.data.address?.address_1,
        addr_2: details.data.address?.address_2,
        city: details.data.address?.city,
        state: details.data.address?.state,
        zipCode: details.data.address?.postcode,
        country: details.data.address?.country,
      },
      items:
        details.data.order_items?.map((item: any) => ({
          id: item.id,
          name: item.product_name,
          quantity: item.qty,
          price: Number(item.price),
        })) || [],
      shipping: details.data.shipping_charge,
      amount: details.data.price,
      discount: details.data.promo_discount,
      total: details.data.promo_discount
        ? Number(details.data.price) - Number(details.data.promo_discount)
        : details.data.price,
      paymentMethod: details.data.payment_gateway,
    };
  }, [details]);

  // --- Loading State ---
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
        <Header type="cart" title="Order Completed" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      </SafeAreaView>
    );
  }

  // --- Error State ---
  if (error || !orderData) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
        <Header type="cart" title="Order Completed" />
        <View className="flex-1 items-center justify-center p-6">
          <Feather name="alert-circle" color="#EF4444" size={48} />
          <Text className="text-lg font-medium text-gray-900 mt-4 mb-2">
            Order Not Found
          </Text>
          <Text className="text-gray-500 text-center">
            Unable to load order details. Please try again.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // --- Success Content ---
  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <Header type="cart" title="Order Completed" />
      <ScrollView className="flex-1">
        <View className="p-4">
          {/* Success Animation Placeholder */}
          <View className="items-center justify-center py-8">
            <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center mb-4">
              <Feather name="check" color="#10B981" size={48} />
            </View>
            <Text className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </Text>
            <Text className="text-gray-600 text-center px-4">
              Thank you for your order. We've received your payment and are
              processing your order.
            </Text>
          </View>

          {/* Order Confirmation Header */}
          <InfoCard title="Order Confirmation" iconName="check-circle">
            <View className="mb-2 flex-row flex-wrap items-center gap-2">
              {orderData.is_preorder && (
                <View className="flex-row items-center gap-1.5 bg-violet-50 px-2 py-1 rounded">
                  <View className="w-2 h-2 bg-violet-500 rounded-full" />
                  <Text className="text-xs font-medium text-violet-600 uppercase">
                    Pre-order
                  </Text>
                </View>
              )}
            </View>

            <InfoRow label="Order Number:">
              <View className="flex-row items-center gap-2">
                <Text className="text-sm font-mono font-semibold text-blue-600">
                  {orderData.orderNumber}
                </Text>
                <CopyToClipboardButton text={orderData.orderNumber} />
              </View>
            </InfoRow>

            <InfoRow label="Order Date:" value={orderData.orderDate} />
            <InfoRow label="Email:" value={orderData.email} />
            <InfoRow label="Courier:" value={orderData.courier} />
            {orderData.is_preorder && (
              <InfoRow
                label="Pre-order Date:"
                value={orderData.preorder_data}
              />
            )}
          </InfoCard>

          {/* Shipping Address */}
          <InfoCard title="Shipping Address" iconName="map-pin">
            <View className="space-y-2">
              <Text className="font-medium text-gray-900 mb-1">
                {orderData.shippingAddress.name}
              </Text>
              <Text className="text-gray-900">
                {orderData.shippingAddress.addr_1}
              </Text>
              {orderData.shippingAddress.addr_2 && (
                <Text className="text-gray-900">
                  {orderData.shippingAddress.addr_2}
                </Text>
              )}
              <Text className="text-gray-900">
                {orderData.shippingAddress.city},{" "}
                {orderData.shippingAddress.state}{" "}
                {orderData.shippingAddress.zipCode}
              </Text>
              <Text className="text-gray-900">
                {orderData.shippingAddress.country}
              </Text>
            </View>
          </InfoCard>

          {/* Order Items */}
          <InfoCard
            title={`Order Items (${orderData.items.length})`}
            iconName="shopping-bag"
          >
            {orderData.items.map((item: any) => (
              <OrderItemCard key={item.id} item={item} />
            ))}
          </InfoCard>

          {/* Order Summary */}
          <InfoCard title="Order Summary" iconName="file-text">
            <InfoRow
              label="Shipping:"
              value={
                orderData.shipping === 0
                  ? "Free"
                  : `₹${orderData.shipping.toLocaleString()}`
              }
            />
            <InfoRow
              label="Amount:"
              value={`₹${orderData.amount.toLocaleString()}`}
            />
            {orderData.discount > 0 && (
              <InfoRow label="Discount:">
                <Text className="text-sm text-green-600 font-medium">
                  -₹{orderData.discount.toLocaleString()}
                </Text>
              </InfoRow>
            )}

            <View className="border-t border-gray-200 pt-3 mt-2" />
            <View className="flex-row justify-between items-center">
              <Text className="text-lg font-semibold text-gray-900">
                Total Paid:
              </Text>
              <Text className="text-lg font-semibold text-primary">
                ₹{(orderData.total < 0 ? 0 : orderData.total).toLocaleString()}
              </Text>
            </View>
          </InfoCard>

          {/* Payment Method */}
          <InfoCard title="Payment Information" iconName="credit-card">
            <InfoRow label="Payment Method:" value={orderData.paymentMethod} />
          </InfoCard>

          {/* Action Buttons */}
          <View className="space-y-3 mt-4 mb-6">
            <TouchableOpacity
              className="bg-primary px-6 py-4 rounded-lg"
              onPress={() => router.replace("/")}
            >
              <Text className="text-white font-semibold text-center text-base">
                Continue Shopping
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-white border border-gray-300 px-6 py-4 rounded-lg"
              onPress={() => router.replace("/my-orders")}
            >
              <Text className="text-gray-700 font-semibold text-center text-base">
                View My Orders
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaymentSuccess;
