import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useApplyCoupon } from "@/services/queries/cart";

interface CouponManagerProps {
  token: string;
  subtotal: number;
  onCouponChange: (discount: number) => void;
  appliedCoupon: any | null;
  setAppliedCoupon: (coupon: any | null) => void;
  onInputFocus?: () => void;
}

const CouponManager = ({
  token,
  subtotal,
  onCouponChange,
  appliedCoupon,
  setAppliedCoupon,
  onInputFocus,
}: CouponManagerProps) => {
  const [couponCode, setCouponCode] = useState("");
  const { mutate: apply, isPending: isApplyingCoupon } = useApplyCoupon();

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    apply(
      { coupon_code: couponCode.trim(), data: { token } },
      {
        onSuccess: (response: any) => {
          if (response?.data) {
            const order_min_amount = Number(response.data.order_min_amount || 0);
            if (subtotal >= order_min_amount) {
              const discount = Number(response.data.discount || 0);
              setAppliedCoupon(response.data);
              onCouponChange(discount);
              Toast.show({ type: "success", text1: "Coupon applied" });
            } else {
              Toast.show({
                type: "error",
                text1: `Minimum order ₹${order_min_amount} required for this coupon.`,
              });
            }
          }
        },
        onError: (error: any) => {
          Toast.show({
            type: "error",
            text1: error?.data?.message || "Failed to apply coupon",
          });
        },
      }
    );
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    onCouponChange(0);
    setAppliedCoupon(null);
  };

  if (appliedCoupon) {
    return (
      <View className="flex-row items-center justify-between bg-green-50 p-3 rounded-lg mb-2">
        <View className="flex-1">
          <Text className="text-sm text-gray-600">Coupon Applied</Text>
          <Text className="text-base font-semibold text-green-700">
            {appliedCoupon?.coupon_code}{" "}
            {appliedCoupon?.discount_type === "flat" && "₹"}
            {appliedCoupon?.coupon_value}
            {appliedCoupon?.discount_type === "percent" && "%"} off
          </Text>
        </View>
        <TouchableOpacity onPress={handleRemoveCoupon}>
          <Ionicons name="close-circle" size={24} color="#059669" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-row">
      <TextInput
        className="flex-1 border border-gray-200 rounded-lg px-4 py-2 mr-2 bg-white"
        placeholder="Enter coupon code"
        placeholderTextColor="#9CA3AF"
        value={couponCode}
        onChangeText={(text) => setCouponCode(text.toUpperCase())}
        onFocus={onInputFocus}
        autoCapitalize="characters"
        returnKeyType="done"
      />
      <TouchableOpacity
        onPress={handleApplyCoupon}
        disabled={isApplyingCoupon || !couponCode.trim()}
        className={`bg-primary rounded-lg px-4 py-2 ${
          isApplyingCoupon || !couponCode.trim() ? "opacity-50" : ""
        }`}
      >
        <Text className="text-white font-semibold">
          {isApplyingCoupon ? "Applying..." : "Apply"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CouponManager;
