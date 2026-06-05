import React from "react";
import { View, Text } from "react-native";
import { FormInput, FormPicker } from "@/app/add-address";
import { DeliveryPreferences, DeliveryErrors } from "./types";

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
  <View className="bg-white rounded-lg p-6 shadow-sm mb-4">
    <Text className="text-xl font-bold mb-4">Delivery Preferences</Text>
    <FormPicker
      label="Preferred Courier"
      selectedValue={preferences.courier}
      onValueChange={onCourierChange}
      items={[
        { value: "DTDC", label: "DTDC" },
        { value: "INDIA_POST", label: "India Post" },
      ]}
      prompt="Select Courier"
      error={errors.courier}
      touched={touched.courier}
    />
    <FormInput
      label="Delivery Instructions"
      isOptional
      value={preferences.instructions}
      onChangeText={onInstructionsChange}
      onBlur={onInstructionsBlur}
      placeholder="Any special instructions for delivery"
      multiline
      numberOfLines={4}
      error={errors.instructions}
      touched={touched.instructions}
    />
  </View>
);

export default DeliveryPreferencesManager;
