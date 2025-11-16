// src/components/forms/ChangeStateForm.tsx
import { country, indianStates } from "@/shared/others/others"
import { Picker } from "@react-native-picker/picker"
import { Formik } from "formik"
import React from "react"
import { Text, TouchableOpacity, View } from "react-native"
import * as Yup from "yup"

// Validation Schema
const ChangeStateSchema = Yup.object().shape({
  country: Yup.string().required("Country is required"),
  state: Yup.string().required("State is required"),
})

// Form Props
interface ChangeStateFormProps {
  currentState: string
  onSubmit: (state: string) => void
  onClose: () => void
}

export default function ChangeStateForm({
  currentState,
  onSubmit,
  onClose,
}: ChangeStateFormProps) {
  return (
    <Formik
      initialValues={{
        country: "IN", // Hardcoded to India
        state: currentState || "", // Pre-fill with the current state
      }}
      validationSchema={ChangeStateSchema}
      onSubmit={(values) => {
        onSubmit(values.state)
      }}
    >
      {({
        handleChange,
        handleSubmit,
        values,
        errors,
        touched,
        setFieldValue,
      }) => (
        <View className="w-full">
          <Text className="text-xl font-bold mb-6">Change Location</Text>

          {/* Country Picker */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-600 mb-1">
              Country
            </Text>
            <View className="border border-gray-300 rounded-lg bg-gray-100">
              <Picker
                selectedValue={values.country}
                onValueChange={handleChange("country")}
                enabled={false} // Disabled as "India" is the only option
                style={{ color: "#333" }}
              >
                {country.map((country) => (
                  <Picker.Item
                    key={country.value}
                    label={country.label}
                    value={country.value}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* State Picker */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-600 mb-1">
              State
            </Text>
            <View className="border border-gray-300 rounded-lg bg-white">
              <Picker
                selectedValue={values.state}
                // Use setFieldValue for pickers
                onValueChange={(itemValue) => setFieldValue("state", itemValue)}
                style={{ color: "#000" }}
              >
                {indianStates.map((state) => (
                  <Picker.Item
                    key={state.code}
                    label={state.name}
                    value={state.code}
                  />
                ))}
              </Picker>
            </View>
            {errors.state && touched.state && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.state}
              </Text>
            )}
          </View>

          {/* Action Buttons */}
          <View className="flex-row justify-end mt-6">
            <TouchableOpacity
              onPress={onClose}
              className="py-2 px-5 mr-3"
            >
              <Text className="font-semibold text-gray-600">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleSubmit()} // Use handleSubmit from Formik
              className="bg-primary rounded-lg py-2 px-6"
            >
              <Text className="text-white font-bold">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Formik>
  )
}