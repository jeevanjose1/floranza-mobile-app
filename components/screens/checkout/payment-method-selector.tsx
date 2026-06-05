import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PaymentMethod } from "./types";

interface PaymentSelectorProps {
  selectedMethod: PaymentMethod | null;
  onSelectMethod: (method: PaymentMethod) => void;
}

const PaymentMethodSelector = ({ selectedMethod, onSelectMethod }: PaymentSelectorProps) => (
  <View className="bg-white rounded-lg p-6 shadow-sm mb-4">
    <Text className="text-xl font-bold mb-4">Payment Method</Text>
    <PaymentOption
      method="RAZORPAY"
      label="Razorpay"
      description="Pay using UPI, Card, Net Banking & more"
      icon="card"
      iconColor="#6366F1"
      bgColor="bg-indigo-100"
      isSelected={selectedMethod === "RAZORPAY"}
      onPress={() => onSelectMethod("RAZORPAY")}
    />
    <PaymentOption
      method="PHONEPE"
      label="PhonePe"
      description="Pay using PhonePe, GPay, Paytm & more"
      icon="phone-portrait"
      iconColor="#16A34A"
      bgColor="bg-green-100"
      isSelected={selectedMethod === "PHONEPE"}
      onPress={() => onSelectMethod("PHONEPE")}
    />
  </View>
);

const PaymentOption = ({
  label,
  description,
  icon,
  iconColor,
  bgColor,
  isSelected,
  onPress,
}: {
  method: PaymentMethod;
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  bgColor: string;
  isSelected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={`flex-row items-center p-4 rounded-lg border-2 mb-3 ${
      isSelected ? "border-primary bg-blue-50" : "border-gray-200 bg-white"
    }`}
  >
    <View className={`w-12 h-12 ${bgColor} rounded-lg items-center justify-center mr-3`}>
      <Ionicons name={icon} size={24} color={iconColor} />
    </View>
    <View className="flex-1">
      <Text className="font-semibold text-base">{label}</Text>
      <Text className="text-gray-600 text-sm">{description}</Text>
    </View>
    {isSelected && <Ionicons name="checkmark-circle" size={24} color="#3B82F6" />}
  </TouchableOpacity>
);

export default PaymentMethodSelector;
