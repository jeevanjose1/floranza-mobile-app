import Header from "@/components/layout/header";
import { useAuthenticated } from "@/hooks/useAutheticated";
import { useApplyCoupon, useViewCart } from "@/services/queries/cart";
import { indianStates } from "@/shared/others/others";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FormInput, FormPicker } from "./add-address";

// --- TYPES & CONSTANTS ---

type Address = {
    id: string;
    fullName: string;
    country: string;
    streetAddress: string;
    addressLine2: string;
    city: string;
    state: string;
    postcode: string;
    phone: string;
    email: string;
    shippingOption: string;
    orderNote: string;
};

type CartItem = {
    id: string | number;
    cart_id: string | number;
    slug: string;
    cart_qty: number;
    name: string;
    attributeOption?: string;
    price: number;
    image?: {
        mini: string;
    };
};

type PaymentMethod = "phonepay" | "razorpay";

type DeliveryPreferences = {
    courier: string;
    instructions: string;
};

type DeliveryErrors = {
    courier?: string;
    instructions?: string;
};

// --- UTILITY FUNCTIONS ---

const getInitialState = (cData: string | null | undefined): string => {
    const DEFAULT_STATE = "KL";
    if (!cData) return DEFAULT_STATE;
    try {
        const parsedData = JSON.parse(cData as string);
        return parsedData?.state || DEFAULT_STATE;
    } catch (error) {
        return DEFAULT_STATE;
    }
};

const getStateName = (stateCode: string) => {
    return indianStates.find((s) => s.code === stateCode)?.name || stateCode;
};

const getShippingLabel = (option: string) => {
    return option === "dtdc" ? "DTDC" : "India Post";
};

// --- REUSABLE CHILD COMPONENTS ---

// 1. Order Summary
const OrderSummary = React.memo(({ items }: { items: CartItem[] }) => (
    <View className="bg-white rounded-lg p-6 shadow-sm mb-4">
        <Text className="text-xl font-bold mb-4">Order Summary</Text>
        <View>
            {items.map((item: CartItem, index: number) => (
                <View
                    key={item.id || index}
                    className="flex-row mb-3 pb-3 border-b border-gray-200"
                >
                    <Image
                        source={{ uri: item?.image?.mini }}
                        className="w-16 h-16 rounded-md"
                        resizeMode="cover"
                    />
                    <View className="flex-1 ml-3">
                        <Text className="text-base font-semibold mb-1" numberOfLines={2}>
                            {item.name}
                        </Text>
                        {item?.attributeOption && (
                            <Text className="text-gray-600 text-sm mb-1">
                                {item.attributeOption}
                            </Text>
                        )}
                        <View className="flex-row justify-between items-center">
                            <Text className="text-gray-600 text-sm">Qty: {item.cart_qty}</Text>
                            <Text className="text-base font-bold text-primary">
                                ₹{(item.price * item.cart_qty).toFixed(2)}
                            </Text>
                        </View>
                    </View>
                </View>
            ))}
        </View>
    </View>
));

// 2. Coupon Manager
interface CouponManagerProps {
    token: string;
    onCouponChange: (discount: number) => void;
}

const CouponManager = ({ token, onCouponChange }: CouponManagerProps) => {
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

    const { mutateAsync: applyCoupon, isPending: isApplyingCoupon } =
        useApplyCoupon();

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        try {
            const response = await applyCoupon({
                coupon_code: couponCode.trim(),
                data: { token },
            });
            if (response?.data) {
                const discount = Number(response.data.discount || 0);
                setAppliedCoupon(couponCode.trim());
                onCouponChange(discount);
            }
        } catch (error) {
            console.error("Failed to apply coupon:", error);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode("");
        onCouponChange(0);
    };

    if (appliedCoupon) {
        return (
            <View className="flex-row items-center justify-between bg-green-50 p-3 rounded-lg mb-2">
                <View className="flex-1">
                    <Text className="text-sm text-gray-600">Coupon Applied</Text>
                    <Text className="text-base font-semibold text-green-700">
                        {appliedCoupon}
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
                onChangeText={setCouponCode}
            />
            <TouchableOpacity
                onPress={handleApplyCoupon}
                disabled={isApplyingCoupon || !couponCode.trim()}
                className={`bg-primary rounded-lg px-4 py-2 ${isApplyingCoupon || !couponCode.trim() ? "opacity-50" : ""
                    }`}
            >
                <Text className="text-white font-semibold">
                    {isApplyingCoupon ? "Applying..." : "Apply"}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

// 3. Price Details
interface PriceDetailsProps {
    subtotal: number;
    shipping: number;
    couponDiscount: number;
    total: number;
    token: string;
    onCouponChange: (discount: number) => void;
}

const PriceDetails = ({
    subtotal,
    shipping,
    couponDiscount,
    total,
    token,
    onCouponChange,
}: PriceDetailsProps) => (
    <View className="bg-white rounded-lg p-6 shadow-sm mb-4">
        <Text className="text-xl font-bold mb-4">Price Details</Text>
        <View className="border-t border-gray-200 pt-4">
            <View className="flex-row justify-between mb-3">
                <Text className="text-gray-600">Subtotal</Text>
                <Text className="font-semibold">₹{subtotal.toFixed(2)}</Text>
            </View>
            <View className="flex-row justify-between mb-3">
                <Text className="text-gray-600">Shipping</Text>
                <Text className="font-semibold">₹{shipping.toFixed(2)}</Text>
            </View>
            {couponDiscount > 0 && (
                <View className="flex-row justify-between mb-3">
                    <Text className="text-green-600">Coupon Discount</Text>
                    <Text className="font-semibold text-green-600">
                        - ₹{couponDiscount.toFixed(2)}
                    </Text>
                </View>
            )}

            {/* Coupon Section */}
            <View className="mb-3 pt-3 border-t border-gray-200">
                <CouponManager token={token} onCouponChange={onCouponChange} />
            </View>

            {/* Total */}
            <View className="border-t border-gray-200 pt-3 flex-row justify-between">
                <Text className="text-lg font-bold">Total</Text>
                <Text className="text-lg font-bold text-primary">
                    ₹{total.toFixed(2)}
                </Text>
            </View>
        </View>
    </View>
);

// 4. Address Manager
interface AddressManagerProps {
    selectedAddress: Address | null;
    onSelectAddress: (address: Address) => void;
}

const AddressManager = ({
    selectedAddress,
    onSelectAddress,
}: AddressManagerProps) => {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const router = useRouter()

    const getLocalAddress = async () => {
        try {
            const address = await AsyncStorage.getItem('@user_address') || ''
            setAddresses([JSON.parse(address)])
        } catch (error) {

        }
    }

    useFocusEffect(
        useCallback(() => {
            getLocalAddress()
        }, [])
    )

    const handleGoToAddAddress = () => {
        router.push('/add-address')
    }

    return (
        <>
            <View className="bg-white rounded-lg p-6 shadow-sm mb-4">
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-xl font-bold">Delivery Address</Text>
                   {!addresses.length && <TouchableOpacity
                        onPress={handleGoToAddAddress}
                        className="flex-row items-center"
                    >
                        <Text className="text-primary font-semibold ml-1">
                            Add Address
                        </Text>
                    </TouchableOpacity>}
                </View>

                {addresses.length === 0 ? (
                    <View className="items-center py-8">
                        <Ionicons name="location-outline" size={48} color="#9CA3AF" />
                        <Text className="text-gray-600 mt-2">No address added yet</Text>
                        <Text className="text-gray-500 text-sm mt-1">
                            Add an address to continue
                        </Text>
                    </View>
                ) : (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {addresses.map((address, index) => (
                            <AddressCard
                                key={index}
                                address={address}
                                isSelected={selectedAddress?.id === address.id}
                                onPress={() => onSelectAddress(address)}
                            />
                        ))}
                    </ScrollView>
                )}
            </View>
        </>
    );
};

const AddressCard = ({
    address,
    isSelected,
    onPress,
}: {
    address: Address;
    isSelected: boolean;
    onPress: () => void;
}) => {

    const router = useRouter()
    const handleEditAddress = () => {
        router.push({
            pathname:'/add-address',
            params:{
                isEdit:1
            }
        })
    }
    return <TouchableOpacity
        onPress={onPress}
        className={`mr-3 p-4 rounded-lg border min-w-[280] ${isSelected ? "border-primary bg-blue-50" : "border-gray-200 bg-white"
            }`}
    >
        <View className="flex-row items-start justify-between mb-2">
            <Text className="font-bold text-base flex-1">{address.fullName}</Text>
            <View className="flex-row items-center gap-3">
                <TouchableOpacity onPress={handleEditAddress}>
                    <FontAwesome name="edit" size={20} color="black" />
                </TouchableOpacity>
            </View>
        </View>
        <Text className="text-gray-600 text-sm mb-1">
            {address.streetAddress}
        </Text>
        {address.addressLine2 && (
            <Text className="text-gray-600 text-sm mb-1">
                {address.addressLine2}
            </Text>
        )}
        <Text className="text-gray-600 text-sm mb-1">
            {address.city}, {getStateName(address.state)} - {address.postcode}
        </Text>
        <Text className="text-gray-600 text-sm mb-1">Phone: {address.phone}</Text>
        <Text className="text-gray-600 text-sm mb-2">Email: {address.email}</Text>
        <View className="flex-row items-center mt-2">
            <Ionicons name="car-outline" size={16} color="#6B7280" />
            <Text className="text-gray-600 text-sm ml-1">
                {getShippingLabel(address.shippingOption)}
            </Text>
        </View>
    </TouchableOpacity>
}

// 5. Delivery Preferences Manager
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
}: DeliveryPreferencesManagerProps) => {
    const shippingOptions = [
        { value: "dtdc", label: "DTDC" },
        { value: "india_post", label: "India Post" },
    ];

    return (
        <View className="bg-white rounded-lg p-6 shadow-sm mb-4">
            <Text className="text-xl font-bold mb-4">Delivery Preferences</Text>

            <FormPicker
                label="Preferred Courier"
                selectedValue={preferences.courier}
                onValueChange={onCourierChange}
                items={shippingOptions}
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
};

// 6. Payment Selector
interface PaymentSelectorProps {
    selectedMethod: PaymentMethod | null;
    onSelectMethod: (method: PaymentMethod) => void;
}

const PaymentSelector = ({
    selectedMethod,
    onSelectMethod,
}: PaymentSelectorProps) => (
    <View className="bg-white rounded-lg p-6 shadow-sm mb-4">
        <Text className="text-xl font-bold mb-4">Payment Method</Text>
        <View>
            <PaymentOption
                method="phonepay"
                label="PhonePe"
                description="Pay using PhonePe"
                icon="phone-portrait"
                iconColor="#FF6B35"
                bgColor="bg-orange-100"
                isSelected={selectedMethod === "phonepay"}
                onPress={() => onSelectMethod("phonepay")}
            />
            <PaymentOption
                method="razorpay"
                label="Razorpay"
                description="Pay using Razorpay"
                icon="card"
                iconColor="#6366F1"
                bgColor="bg-indigo-100"
                isSelected={selectedMethod === "razorpay"}
                onPress={() => onSelectMethod("razorpay")}
            />
        </View>
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
        className={`flex-row items-center p-4 rounded-lg border-2 mb-3 ${isSelected ? "border-primary bg-blue-50" : "border-gray-200 bg-white"
            }`}
    >
        <View
            className={`w-12 h-12 ${bgColor} rounded-lg items-center justify-center mr-3`}
        >
            <Ionicons name={icon} size={24} color={iconColor} />
        </View>
        <View className="flex-1">
            <Text className="font-semibold text-base">{label}</Text>
            <Text className="text-gray-600 text-sm">{description}</Text>
        </View>
        {isSelected && (
            <Ionicons name="checkmark-circle" size={24} color="#3B82F6" />
        )}
    </TouchableOpacity>
);

// 7. Place Order Footer
interface PlaceOrderFooterProps {
    total: number;
    onPress: () => void;
    disabled: boolean;
}

const PlaceOrderFooter = ({
    total,
    onPress,
    disabled,
}: PlaceOrderFooterProps) => (
    <View className="h-24 px-4 pt-4 bg-white border-t border-gray-200">
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            className={`rounded-lg py-3 items-center ${disabled ? "bg-gray-400" : "bg-primary"
                }`}
        >
            <Text className="text-white text-lg font-bold">
                Place Order - ₹{total.toFixed(2)}
            </Text>
        </TouchableOpacity>
    </View>
);

// --- MAIN CHECKOUT COMPONENT ---

const Checkout = () => {
    const { cData, gToken } = useAuthenticated();
    const token = gToken;

    const [state] = useState<string>(() => getInitialState(cData));
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] =
        useState<PaymentMethod | null>(null);
    const [couponDiscount, setCouponDiscount] = useState(0);

    // Delivery preferences state
    const [deliveryPreferences, setDeliveryPreferences] = useState<DeliveryPreferences>({
        courier: "",
        instructions: "",
    });

    const [deliveryErrors, setDeliveryErrors] = useState<DeliveryErrors>({});
    const [deliveryTouched, setDeliveryTouched] = useState({
        courier: false,
        instructions: false,
    });

    // Fetch cart data
    const { data: cart_items, isLoading } = useViewCart({
        token: token,
        filter: { state: state },
    });

    // Cart data
    const cart = cart_items?.data;
    const cartItems: CartItem[] = cart?.cart || [];
    const subtotal = Number(cart?.sub_total || 0);
    const shipping = Number(cart?.shipping_charge || 0);
    const total = Number(cart?.total || 0) - couponDiscount;

    // Validation function
    const validateDeliveryPreferences = (): boolean => {
        const errors: DeliveryErrors = {};
        let isValid = true;

        if (!deliveryPreferences.courier) {
            errors.courier = "Please select a preferred courier";
            isValid = false;
        }

        // Instructions are optional, so no validation needed

        setDeliveryErrors(errors);
        return isValid;
    };

    // Handle place order
    const handlePlaceOrder = () => {
        // Mark all fields as touched
        setDeliveryTouched({
            courier: true,
            instructions: true,
        });

        // Validate all required fields
        const isDeliveryValid = validateDeliveryPreferences();

        if (!selectedAddress) {
            return;
        }

        if (!selectedPaymentMethod) {
            return;
        }

        if (!isDeliveryValid) {
            return;
        }

     

        // TODO: Implement order placement logic
    };

    const handleCourierChange = (value: string) => {
        setDeliveryPreferences(prev => ({ ...prev, courier: value }));
        // Clear error when user selects a value
        if (value && deliveryErrors.courier) {
            setDeliveryErrors(prev => ({ ...prev, courier: undefined }));
        }
    };

    const handleInstructionsChange = (value: string) => {
        setDeliveryPreferences(prev => ({ ...prev, instructions: value }));
    };

    const handleCourierBlur = () => {
        setDeliveryTouched(prev => ({ ...prev, courier: true }));
        if (!deliveryPreferences.courier) {
            setDeliveryErrors(prev => ({ 
                ...prev, 
                courier: "Please select a preferred courier" 
            }));
        }
    };

    const handleInstructionsBlur = () => {
        setDeliveryTouched(prev => ({ ...prev, instructions: true }));
    };

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1" edges={["top"]}>
                <Header type="cart" title="Checkout" />
                <View className="flex-1 items-center justify-center bg-gray-50">
                    <ActivityIndicator size="large" />
                    <Text className="mt-4 text-gray-600">Loading checkout...</Text>
                </View>
            </SafeAreaView>
        );
    }

    const isPlaceOrderDisabled = !selectedAddress || !selectedPaymentMethod;

    return (
        <SafeAreaView className="flex-1" edges={["top"]}>
            <Header type="cart" title="Checkout" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1 bg-gray-50"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="p-4">
                        {/* Order Summary */}
                        <OrderSummary items={cartItems} />

                        {/* Address Section */}
                        <AddressManager
                            selectedAddress={selectedAddress}
                            onSelectAddress={setSelectedAddress}
                        />

                        {/* Delivery Preferences Section */}
                        <DeliveryPreferencesManager
                            preferences={deliveryPreferences}
                            errors={deliveryErrors}
                            touched={deliveryTouched}
                            onCourierChange={handleCourierChange}
                            onInstructionsChange={handleInstructionsChange}
                            onInstructionsBlur={handleInstructionsBlur}
                        />

                        {/* Payment Method Section */}
                        <PaymentSelector
                            selectedMethod={selectedPaymentMethod}
                            onSelectMethod={setSelectedPaymentMethod}
                        />

                        {/* Price Breakdown & Coupon */}
                        <PriceDetails
                            subtotal={subtotal}
                            shipping={shipping}
                            couponDiscount={couponDiscount}
                            total={total}
                            token={token as string}
                            onCouponChange={setCouponDiscount}
                        />
                    </View>
                </ScrollView>

                {/* Place Order Button */}
                <PlaceOrderFooter
                    total={total}
                    onPress={handlePlaceOrder}
                    disabled={isPlaceOrderDisabled}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Checkout;