import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";

interface PlaceOrderFooterProps {
  total: number;
  onPress: () => void;
  disabled: boolean;
  loading: boolean;
}

const PlaceOrderFooter = ({
  total,
  onPress,
  disabled,
  loading,
}: PlaceOrderFooterProps) => (
  <View className="h-24 px-4 pt-4 bg-white border-t border-gray-200">
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`rounded-lg py-3 items-center ${disabled ? "bg-gray-400" : "bg-primary"}`}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="text-white text-lg font-bold">
          Place Order - ₹
          {total.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>
      )}
    </TouchableOpacity>
  </View>
);

export default PlaceOrderFooter;
