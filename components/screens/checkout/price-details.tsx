import React from "react";
import { View, Text } from "react-native";
import CouponManager from "./coupon-manager";

interface PriceDetailsProps {
  subtotal: number;
  shipping: number;
  couponDiscount: number;
  total: number;
  token: string;
  appliedCoupon: any | null;
  setAppliedCoupon: (coupon: any | null) => void;
  onCouponChange: (discount: number) => void;
  onCouponFocus?: () => void;
}

const PriceDetails = ({
  subtotal,
  shipping,
  couponDiscount,
  total,
  token,
  onCouponChange,
  appliedCoupon,
  setAppliedCoupon,
  onCouponFocus,
}: PriceDetailsProps) => (
  <View className="bg-white rounded-lg p-6 shadow-sm mb-4">
    <Text className="text-xl font-bold mb-4">Price Details</Text>
    <View className="border-t border-gray-200 pt-4">
      <View className="flex-row justify-between mb-3">
        <Text className="text-gray-600">Subtotal</Text>
        <Text className="font-semibold">
          ₹{subtotal.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>
      </View>
      <View className="flex-row justify-between mb-3">
        <Text className="text-gray-600">Shipping</Text>
        {shipping === 0 ? (
          <Text className="font-semibold text-green-600">Free</Text>
        ) : (
          <Text className="font-semibold">₹{shipping.toFixed(2)}</Text>
        )}
      </View>
      {couponDiscount > 0 && (
        <View className="flex-row justify-between mb-3">
          <Text className="text-green-600">Coupon Discount</Text>
          <Text className="font-semibold text-green-600">
            - ₹{couponDiscount.toFixed(2)}
          </Text>
        </View>
      )}
      <View className="mb-3 pt-3 border-t border-gray-200">
        <CouponManager
          token={token}
          subtotal={subtotal}
          onCouponChange={onCouponChange}
          appliedCoupon={appliedCoupon}
          setAppliedCoupon={setAppliedCoupon}
          onInputFocus={onCouponFocus}
        />
      </View>
      <View className="border-t border-gray-200 pt-3 flex-row justify-between">
        <Text className="text-lg font-bold">Total</Text>
        <Text className="text-lg font-bold text-primary">
          ₹{total.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>
      </View>
    </View>
  </View>
);

export default PriceDetails;
