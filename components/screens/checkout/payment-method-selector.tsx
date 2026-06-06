import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { PaymentMethod } from "./types";

const phonePeLogo = require("@/assets/images/phone-pay.png");
const razorpayLogo = require("@/assets/images/razor-pay.png");

interface PaymentSelectorProps {
  selectedMethod: PaymentMethod | null;
  onSelectMethod: (method: PaymentMethod) => void;
}

const PaymentMethodSelector = ({ selectedMethod, onSelectMethod }: PaymentSelectorProps) => (
  <View className="bg-white rounded-2xl p-5 shadow-sm mb-4">
    <View className="flex-row items-center gap-2 mb-5">
      <Ionicons name="card-outline" size={22} color="#ED2353" />
      <Text className="text-xl font-bold text-gray-900">Payment Method</Text>
    </View>

    <PaymentOption
      method="PHONEPE"
      label="PhonePe"
      description="Pay using PhonePe, GPay, Paytm & more"
      logo={phonePeLogo}
      logoBg="bg-purple-50"
      isSelected={selectedMethod === "PHONEPE"}
      onPress={() => onSelectMethod("PHONEPE")}
    />
    <PaymentOption
      method="RAZORPAY"
      label="Razorpay"
      description="Pay using UPI, Card, Net Banking & more"
      logo={razorpayLogo}
      logoBg="bg-indigo-50"
      isSelected={selectedMethod === "RAZORPAY"}
      onPress={() => onSelectMethod("RAZORPAY")}
    />
  </View>
);

const PaymentOption = ({
  label,
  description,
  logo,
  logoBg,
  isSelected,
  onPress,
}: {
  method: PaymentMethod;
  label: string;
  description: string;
  logo: any;
  logoBg: string;
  isSelected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    className={`flex-row items-center p-4 rounded-xl border-2 mb-3 ${
      isSelected ? "border-primary/60 bg-primary/5" : "border-gray-200 bg-gray-50"
    }`}
  >
    <View className={`w-12 h-12 ${logoBg} rounded-xl items-center justify-center mr-3`}>
      <Image
        source={logo}
        style={{ width: 36, height: 36, resizeMode: "contain" }}
      />
    </View>
    <View className="flex-1">
      <Text className={`font-bold text-base ${isSelected ? "text-primary" : "text-gray-800"}`}>
        {label}
      </Text>
      <Text className="text-gray-500 text-xs mt-0.5">{description}</Text>
    </View>
    {isSelected && (
      <View className="w-5 h-5 rounded-full bg-primary items-center justify-center">
        <Ionicons name="checkmark" size={12} color="white" />
      </View>
    )}
  </TouchableOpacity>
);

export default PaymentMethodSelector;
