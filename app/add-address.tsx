import Header from "@/components/layout/header";
import { useAuthenticated } from "@/hooks/useAutheticated";
import { useAccountDetails, useAddAddress, useListAdderss } from "@/services/queries/account";
import { country, indianStates } from "@/shared/others/others";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker, PickerProps } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import * as Yup from "yup";

// --- VALIDATION & CONSTANTS ---

const addressSchema = Yup.object().shape({
    fullName: Yup.string()
        .required("Full name is required")
        .min(2, "Full name must be at least 2 characters"),
    country: Yup.string().required("Country is required"),
    streetAddress: Yup.string()
        .required("Street address is required")
        .min(5, "Street address must be at least 5 characters"),
    addressLine2: Yup.string(),
    city: Yup.string()
        .required("City is required")
        .min(2, "City must be at least 2 characters"),
    state: Yup.string().required("State is required"),
    postcode: Yup.string()
        .required("Postcode is required")
        .matches(/^[0-9]{6}$/, "Postcode must be 6 digits"),
    phone: Yup.string()
        .required("Phone number is required")
        .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
    email: Yup.string()
        .required("Email is required")
        .email("Please enter a valid email address"),

});


const PLACEHOLDER_TEXT_COLOR = "#9CA3AF";
const STORAGE_KEY = "@user_address";

// --- REUSABLE FORM COMPONENTS ---

interface FormInputProps extends TextInputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    onBlur: (e: any) => void;
    error?: any;
    touched?: any;
    isOptional?: any;
}

export const FormInput: React.FC<FormInputProps> = ({
    label,
    value,
    onChangeText,
    onBlur,
    error,
    touched,
    isOptional = false,
    ...rest
}) => {
    const hasError = !!(error && touched);
    const isMultiline = rest.multiline;

    return (
        <View className="mb-4">
            <Text className="text-[13px] font-medium text-gray-700 mb-2 font-sam-medium">
                {label} {isOptional && <Text className="text-gray-400 font-normal">(Optional)</Text>}
            </Text>
            <View className={`bg-white rounded-lg shadow-sm ${hasError ? 'border border-red-400' : 'border border-gray-200'
                }`}>
                <TextInput
                    className={`px-4 text-[15px] text-gray-900 font-sam-regular ${isMultiline ? "py-3 h-24" : "h-12"
                        }`}
                    placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                    value={value}
                    onChangeText={onChangeText}
                    onBlur={onBlur}
                    textAlignVertical={isMultiline ? "top" : "center"}
                    {...rest}
                />
            </View>
            {hasError && (
                <Text className="text-red-500 text-xs mt-1.5 ml-1 font-sam-regular">
                    {error}
                </Text>
            )}
        </View>
    );
};

//@ts-ignore

interface FormPickerProps extends PickerProps {
    label: string;
    selectedValue: string;
    onValueChange: (value: string) => void;
    items: { label: string; value: string | number }[];
    error?: any;
    touched?: any;
    prompt?: string;
}

export const FormPicker: React.FC<FormPickerProps> = ({
    label,
    selectedValue,
    onValueChange,
    items,
    error,
    touched,
    prompt,
    ...rest
}) => {
    const hasError = !!(error && touched);
    const isDisabled = rest.enabled === false;
    const bgColor = isDisabled ? "bg-gray-50" : "bg-white";

    return (
        <View className="mb-4">
            <Text className="text-[13px] font-medium text-gray-700 mb-2 font-sam-medium">
                {label}
            </Text>
            <View className={`${bgColor} px-1 rounded-lg shadow-sm ${hasError ? 'border border-red-400' : 'border border-gray-200'
                }`}>
                <Picker
                    selectedValue={selectedValue}
                    onValueChange={onValueChange}
                    style={{
                        height: 50,

                        color: selectedValue ? '#111827' : PLACEHOLDER_TEXT_COLOR,
                        fontSize: 10
                    }}
                    {...rest}
                >
                    {prompt && <Picker.Item label={prompt} value="" color={PLACEHOLDER_TEXT_COLOR} />}
                    {items.map((item) => (
                        <Picker.Item
                            key={item.value}
                            label={item.label}
                            value={item.value}
                            color="#111827"
                        />
                    ))}
                </Picker>
            </View>
            {hasError && (
                <Text className="text-red-500 text-xs mt-1.5 ml-1 font-sam-regular">
                    {error}
                </Text>
            )}
        </View>
    );
};

// --- MAIN FORM COMPONENT ---
type AddressFormValues = {
    fullName: string;
    country: string;
    streetAddress: string;
    addressLine2: string;
    city: string;
    state: string;
    postcode: string;
    phone: string;
    email: string;
};
export default function AddAddressForm() {
    const [isSaving, setIsSaving] = useState(false);
    const [address, setAddress] = useState<AddressFormValues>();
    const { isAuthenticated } = useAuthenticated()
    const { data: addresses } = useListAdderss(isAuthenticated);
    const { data: user_data } = useAccountDetails(isAuthenticated)
    const { mutateAsync: add, isPending } = useAddAddress();
    const router = useRouter()
    const { isEdit } = useLocalSearchParams()




    const getLocalAddress = async () => {
        try {
            const address = await AsyncStorage.getItem('@user_address') || ''
            setAddress(JSON.parse(address))
        } catch (error) {

        }
    }

    useEffect(() => {

        if (isEdit === '1') {
            getLocalAddress()
        }


    }, [])


    const saveAddress = async (values: any) => {

        if (isAuthenticated) {
            const form_data = new FormData();
            form_data.append("fname", values.fullName);
            form_data.append("country", values.country);
            form_data.append("address_1", values.streetAddress);
            form_data.append("address_2", values.addressLine2 as string);
            form_data.append("postcode", values.postcode);
            form_data.append("phone", values.phone);
            form_data.append("state", values.state);
            form_data.append("city", values.city);
            form_data.append("email", values.email);

            add(form_data, {
                onSuccess: () => {

                },
                onError: (error: any) => {
                },
            });
        } else {
            try {
                setIsSaving(true);

                // Save the address data to AsyncStorage
                const haveAddress = await AsyncStorage.getItem(STORAGE_KEY)
                if (haveAddress) {
                    await AsyncStorage.removeItem(STORAGE_KEY)
                    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(values));

                }
                router.back()
                Toast.show({
                    type: 'success',
                    text1: 'Address added'
                })



            } catch (error) {
                console.error("Error saving address:", error);
                Alert.alert(
                    "Error",
                    "Failed to save address. Please try again.",
                    [{ text: "OK" }]
                );
            } finally {
                setIsSaving(false);
            }
        }




    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
            <Header type="cart" title="Add Address" />

            <Formik
                initialValues={{
                    fullName: addresses?.data?.fname || address?.fullName || "",
                    country: addresses?.data?.country || address?.country || "IN",
                    streetAddress: addresses?.data?.address_1 || address?.streetAddress || "",
                    addressLine2: addresses?.data?.address_2 || address?.addressLine2 || "",
                    city: addresses?.data?.city || address?.city || "",
                    state: addresses?.data?.state || address?.state || "",
                    postcode: addresses?.data?.postcode || address?.postcode || "",
                    phone: addresses?.data?.phone || address?.phone || "",
                    email: addresses?.data?.email || user_data?.data?.email || address?.email || "",

                }}
                validationSchema={addressSchema}
                enableReinitialize
                onSubmit={saveAddress}
            >
                {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                    setFieldValue,
                }) => (
                    <View className="flex-1">

                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : 'padding'}
                            className="flex-1"
                            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
                        >
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps="handled"
                                className="flex-1"
                                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100 }}
                            >
                                {/* Contact Information Section */}
                                <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                                    <Text className="text-base font-bold text-gray-900 mb-4 font-sam-bold">
                                        Contact Information
                                    </Text>

                                    <FormInput
                                        label="Full Name"
                                        value={values.fullName}
                                        onChangeText={handleChange("fullName")}
                                        onBlur={handleBlur("fullName")}
                                        error={errors?.fullName}
                                        touched={touched?.fullName}
                                        placeholder="Enter your full name"
                                        autoCapitalize="words"
                                    />

                                    <FormInput
                                        label="Phone Number"
                                        value={values.phone}
                                        onChangeText={handleChange("phone")}
                                        onBlur={handleBlur("phone")}
                                        error={errors.phone}
                                        touched={touched.phone}
                                        placeholder="10 digit mobile number"
                                        keyboardType="phone-pad"
                                        maxLength={10}
                                    />

                                    <FormInput
                                        label="Email Address"
                                        value={values.email}
                                        onChangeText={handleChange("email")}
                                        onBlur={handleBlur("email")}
                                        error={errors.email}
                                        touched={touched.email}
                                        placeholder="Enter your email"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                </View>

                                {/* Address Details Section */}
                                <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                                    <Text className="text-base font-bold text-gray-900 mb-4 font-sam-bold">
                                        Address Details
                                    </Text>

                                    <FormInput
                                        label="Pincode"
                                        value={values.postcode}
                                        onChangeText={handleChange("postcode")}
                                        onBlur={handleBlur("postcode")}
                                        error={errors.postcode}
                                        touched={touched.postcode}
                                        placeholder="6 digit pincode"
                                        keyboardType="numeric"
                                        maxLength={6}
                                    />

                                    <FormInput
                                        label="House No., Building Name"
                                        value={values.streetAddress}
                                        onChangeText={handleChange("streetAddress")}
                                        onBlur={handleBlur("streetAddress")}
                                        error={errors.streetAddress}
                                        touched={touched.streetAddress}
                                        placeholder="House No., Building Name"
                                    />

                                    <FormInput
                                        label="Road Name, Area, Colony"
                                        isOptional
                                        value={values.addressLine2}
                                        onChangeText={handleChange("addressLine2")}
                                        onBlur={handleBlur("addressLine2")}
                                        error={errors.addressLine2}
                                        touched={touched.addressLine2}
                                        placeholder="Road Name, Area, Colony"
                                    />

                                    <View className="flex-1">
                                        <FormInput
                                            label="City"
                                            value={values.city}
                                            onChangeText={handleChange("city")}
                                            onBlur={handleBlur("city")}
                                            error={errors.city}
                                            touched={touched.city}
                                            placeholder="City"
                                        />
                                    </View>
                                    <View className="flex-1">
                                        <FormPicker
                                            label="State"
                                            selectedValue={values.state}
                                            onValueChange={(value) => setFieldValue("state", value)}
                                            error={errors.state}
                                            touched={touched.state}
                                            items={indianStates.map((s) => ({
                                                label: s.name,
                                                value: s.code,
                                            }))}
                                            prompt="Select"
                                        />
                                    </View>

                                    <FormPicker
                                        label="Country"
                                        selectedValue={values.country}
                                        onValueChange={(value) => setFieldValue("country", value)}
                                        error={errors.country}
                                        touched={touched.country}
                                        items={country}
                                        enabled={false}
                                    />
                                </View>


                            </ScrollView>

                            {/* Fixed Bottom Button */}
                            <View className="  h-24 right-0 bg-white px-4 py-3 shadow-lg">
                                <TouchableOpacity
                                    onPress={() => handleSubmit()}
                                    disabled={isSaving}
                                    className={`rounded-lg py-3.5 ${isSaving ? 'bg-gray-400' : 'bg-primary'
                                        }`}
                                    activeOpacity={0.8}
                                >
                                    <Text className="text-white font-bold text-center text-[15px] font-sam-bold tracking-wide">
                                        {isSaving ? "SAVING..." : "SAVE ADDRESS"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                )}
            </Formik>
        </SafeAreaView>
    );
}