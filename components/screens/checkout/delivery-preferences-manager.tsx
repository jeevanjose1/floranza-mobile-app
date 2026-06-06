import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { DeliveryErrors, DeliveryPreferences } from "./types";

const dtdcLogo = require("@/assets/images/dtdc.png");
const indiaPostLogo = require("@/assets/images/indian-post.png");

const COURIERS = [
  {
    value: "DTDC",
    label: "DTDC",
    description: "Fast & reliable delivery",
    logo: dtdcLogo,
  },
  {
    value: "INDIA_POST",
    label: "India Post",
    description: "Government postal service",
    logo: indiaPostLogo,
  },
];

interface DeliveryPreferencesManagerProps {
  preferences: DeliveryPreferences;
  errors: DeliveryErrors;
  touched: { courier: boolean; instructions: boolean };
  onCourierChange: (value: string) => void;
  onInstructionsChange: (value: string) => void;
  onInstructionsBlur: () => void;
}

const DeliveryPreferencesManager = ({
  preferences,
  errors,
  touched,
  onCourierChange,
  onInstructionsChange,
  onInstructionsBlur,
}: DeliveryPreferencesManagerProps) => (
  <View className="bg-white rounded-2xl p-5 shadow-sm mb-4">
    {/* Header */}
    <View className="flex-row items-center gap-2 mb-5">
      <Text className="text-xl font-bold text-gray-900">Delivery Preferences</Text>
    </View>

    {/* Courier selector */}
    <Text className="text-sm font-semibold text-gray-700 mb-3">
      Preferred Courier <Text className="text-primary">*</Text>
    </Text>

    <View className="flex-row gap-3 mb-1">
      {COURIERS.map((courier) => {
        const isSelected = preferences.courier === courier.value;
        return (
          <TouchableOpacity
            key={courier.value}
            onPress={() => onCourierChange(courier.value)}
            activeOpacity={0.8}
            style={{ flex: 1 }}
            className={`rounded-xl border-2 p-4 items-center ${
              isSelected
                ? "border-primary/60 bg-primary/5"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            {/* Logo */}
            <Image
              source={courier.logo}
              style={{ width: 64, height: 32, resizeMode: "contain" }}
              className="mb-3"
            />

            {/* Name */}
            <Text
              className={`text-sm font-bold mb-0.5 ${
                isSelected ? "text-primary" : "text-gray-800"
              }`}
            >
              {courier.label}
            </Text>

            {/* Description */}
            <Text className="text-xs text-gray-500 text-center">
              {courier.description}
            </Text>

            {/* Selected tick */}
            {isSelected && (
              <View className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary items-center justify-center">
                <Ionicons name="checkmark" size={12} color="white" />
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>


    {/* Delivery Instructions */}
    <View className="mt-5">
      <Text className="text-sm font-semibold text-gray-700 mb-2">
        Delivery Instructions{" "}
        <Text className="text-gray-400 font-normal">(Optional)</Text>
      </Text>
      <TextInput
        value={preferences.instructions}
        onChangeText={onInstructionsChange}
        onBlur={onInstructionsBlur}
        placeholder="Any special instructions for delivery..."
        placeholderTextColor="#9CA3AF"
        multiline
        numberOfLines={3}
        textAlignVertical="top"
        className="border border-gray-200 rounded-xl px-4 py-3 text-gray-800 bg-gray-50"
        style={{ minHeight: 80 }}
      />
    </View>
  </View>
);

export default DeliveryPreferencesManager;
