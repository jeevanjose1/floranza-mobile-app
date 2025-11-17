import Header from "@/components/layout/header";
import { useAuthenticated } from "@/hooks/useAutheticated";
import { useListAdderss } from "@/services/queries/account";
import { useApplyCoupon, useCheckoutCart, useViewCart } from "@/services/queries/cart";
import { usePhonePeStatus, useRazorpayStatus } from "@/services/queries/payment";
import { indianStates } from "@/shared/others/others";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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
import RazorpayCheckout from 'react-native-razorpay';
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
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

type PaymentMethod = "PHONEPE" | "RAZORPAY";

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

// Order Summary
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
                        className="w-20 h-full rounded-md"
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

// Coupon Manager
interface CouponManagerProps {
    token: string;
    onCouponChange: (discount: number) => void;
}

const CouponManager = ({ token, onCouponChange }: CouponManagerProps) => {
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

    const { mutateAsync: applyCoupon, isPending: isApplyingCoupon } = useApplyCoupon();

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
                className={`bg-primary rounded-lg px-4 py-2 ${isApplyingCoupon || !couponCode.trim() ? "opacity-50" : ""}`}
            >
                <Text className="text-white font-semibold">
                    {isApplyingCoupon ? "Applying..." : "Apply"}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

// Price Details
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

            <View className="mb-3 pt-3 border-t border-gray-200">
                <CouponManager token={token} onCouponChange={onCouponChange} />
            </View>

            <View className="border-t border-gray-200 pt-3 flex-row justify-between">
                <Text className="text-lg font-bold">Total</Text>
                <Text className="text-lg font-bold text-primary">
                    ₹{total.toFixed(2)}
                </Text>
            </View>
        </View>
    </View>
);

// Address Manager
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
    const { data: addressData, isLoading } = useListAdderss()

    const convertApiToAddress = (apiData: any): Address | null => {
        if (!apiData?.data) return null;

        return {
            id: 'api-address',
            fullName: apiData.data.fname || "",
            country: apiData.data.country || "IN",
            streetAddress: apiData.data.address_1 || "",
            addressLine2: apiData.data.address_2 || "",
            city: apiData.data.city || "",
            state: apiData.data.state || "",
            postcode: apiData.data.postcode || "",
            phone: apiData.data.phone || "",
            email: apiData.data.email || "",
            shippingOption: 'standard'
        };
    };

    const getLocalAddress = async () => {
        try {
            const address = await AsyncStorage.getItem('@user_address') || ''
            const localAddress = address ? JSON.parse(address) : null;

            const combinedAddresses: Address[] = [];

            if (addressData?.success && addressData?.data) {
                const apiAddress = convertApiToAddress(addressData);
                if (apiAddress) {
                    combinedAddresses.push(apiAddress);
                }
            }

            if (localAddress) {
                const isDuplicate = combinedAddresses.some(addr =>
                    addr.streetAddress === localAddress.streetAddress &&
                    addr.postcode === localAddress.postcode
                );

                if (!isDuplicate) {
                    combinedAddresses.push({
                        ...localAddress,
                        id: localAddress.id || 'local-address'
                    });
                }
            }

            setAddresses(combinedAddresses);
        } catch (error) {
            console.error('Error loading addresses:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            getLocalAddress()
        }, [addressData])
    );

    const handleGoToAddAddress = () => {
        router.push('/add-address')
    }

    return (
        <View className="bg-white rounded-lg p-6 shadow-sm mb-4">
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold">Delivery Address</Text>
                {!addresses.length && (
                    <TouchableOpacity
                        onPress={handleGoToAddAddress}
                        className="flex-row items-center"
                    >
                        <Text className="text-primary font-semibold ml-1">
                            Add Address
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {isLoading ? (
                <View className="items-center py-8">
                    <ActivityIndicator size="small" color="#ED2353" />
                    <Text className="text-gray-600 mt-2">Loading addresses...</Text>
                </View>
            ) : addresses.length === 0 ? (
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
                            key={address.id || index}
                            address={address}
                            isSelected={selectedAddress?.id === address.id}
                            onPress={() => onSelectAddress(address)}
                        />
                    ))}
                </ScrollView>
            )}
        </View>
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
            pathname: '/add-address',
            params: { isEdit: 1 }
        })
    }

    return (
        <TouchableOpacity
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
            <Text className="text-gray-600 text-sm mb-1">{address.streetAddress}</Text>
            {address.addressLine2 && (
                <Text className="text-gray-600 text-sm mb-1">{address.addressLine2}</Text>
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
    )
}

// Delivery Preferences Manager
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
        { value: "DTDC", label: "DTDC" },
        { value: "INDIA_POST", label: "India Post" },
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

// Payment Selector
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
                method="PHONEPE"
                label="PhonePe"
                description="Pay using PhonePe"
                icon="phone-portrait"
                iconColor="#FF6B35"
                bgColor="bg-orange-100"
                isSelected={selectedMethod === "PHONEPE"}
                onPress={() => onSelectMethod("PHONEPE")}
            />
            <PaymentOption
                method="RAZORPAY"
                label="Razorpay"
                description="Pay using Razorpay"
                icon="card"
                iconColor="#6366F1"
                bgColor="bg-indigo-100"
                isSelected={selectedMethod === "RAZORPAY"}
                onPress={() => onSelectMethod("RAZORPAY")}
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

// Place Order Footer
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
            className={`rounded-lg py-3 items-center ${disabled ? "bg-gray-400" : "bg-primary"}`}
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
    const router = useRouter();

    const [state] = useState<string>(() => getInitialState(cData));
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
    const [couponDiscount, setCouponDiscount] = useState(0);
    const { mutateAsync: checkout } = useCheckoutCart();
    const { mutateAsync: get_status } =
        useRazorpayStatus();
    const { mutateAsync: get_status_phone_pe } =
        usePhonePeStatus();
    const [deliveryPreferences, setDeliveryPreferences] = useState<DeliveryPreferences>({
        courier: "",
        instructions: "",
    });

    const [deliveryErrors, setDeliveryErrors] = useState<DeliveryErrors>({});
    const [deliveryTouched, setDeliveryTouched] = useState({
        courier: false,
        instructions: false,
    });

    const { data: cart_items, isLoading, error } = useViewCart({
        token: token,
        filter: { state: state },
    });

    const cart = cart_items?.data;
    const cartItems: CartItem[] = cart?.cart || [];
    const subtotal = Number(cart?.sub_total || 0);
    const shipping = Number(cart?.shipping_charge || 0);
    const total = Number(cart?.total || 0) - couponDiscount;

    const validateDeliveryPreferences = (): boolean => {
        const errors: DeliveryErrors = {};
        let isValid = true;

        if (!deliveryPreferences.courier) {
            errors.courier = "Please select a preferred courier";
            isValid = false;
        }

        setDeliveryErrors(errors);
        return isValid;
    };

    const handleRazorpaySubmit = (response: any) => {
        const razorpay_data = response?.pg?.RAZORPAY;
        const razopay_data = {
            description: razorpay_data?.description,
            currency: 'INR',
            key: razorpay_data?.key, // Your api key
            amount: response?.total,
            name: razorpay_data?.name,
            prefill: {
                email: razorpay_data?.email,
                contact: razorpay_data?.contact,
                name: 'Razorpay Software'
            },
            theme: { color: "#F37254" }
        }
        RazorpayCheckout?.open(razopay_data as any).then((data) => {
                console.log(data,'asdasd')
            // handle success
            get_status(data?.razorpay_payment_id, {
                onSuccess: (res) => {
                    router.replace({
                        pathname: `/payment-success`,
                        params: { order_id: res?.data?.order_id }
                    });
                },
                onError: () => {
                    router.replace("/payment-faild");
                },
            });
        }).catch((error) => {
            console.log(error, 'error')
        });


    };



    const handlePlaceOrder = () => {
        setDeliveryTouched({
            courier: true,
            instructions: true,
        });

        const isDeliveryValid = validateDeliveryPreferences();

        if (!selectedAddress) return;
        if (!selectedPaymentMethod) return;
        if (!isDeliveryValid) return;
        const dataObject = {
            fname: selectedAddress?.fullName,
            country: selectedAddress?.country,
            address_1: `${selectedAddress?.streetAddress}, ${selectedAddress?.addressLine2}`,
            city: selectedAddress?.city,
            state: selectedAddress?.state,
            postcode: selectedAddress?.postcode,
            phone: selectedAddress?.phone,
            email: selectedAddress?.email,
            courier: deliveryPreferences?.courier,
            notes: deliveryPreferences?.instructions,
            order_via: "MOBILE",
            pg: cart_items?.data?.total === 0 ? "WALLET" : selectedPaymentMethod,
            ...(couponDiscount && { coupon_code: String(couponDiscount) }),
        };


        checkout(
            {
                data: dataObject,
                token: token,
            },
            {
                onSuccess: (response) => {

                    const payment_type = response?.data?.pg ? Object.keys(response?.data?.pg)?.[0] : false;

                    if (payment_type === "RAZORPAY") {
                        handleRazorpaySubmit(response?.data);
                    } else if (payment_type === "PHONEPE") {
                        // handlePhonepaySubmit(response?.data);
                    }

                    else {
                        router.replace(`/payment-success?order_id=${response?.data?.order_id}`);
                    }
                },
                onError: (error: any) => {
                    console.log(error, 'asdasdcc')
                    Toast.show({
                        type: 'error',
                        text1: error?.data?.message
                    })

                },
            }
        );
    };


    const handleCourierChange = (value: string) => {
        setDeliveryPreferences(prev => ({ ...prev, courier: value }));
        if (value && deliveryErrors.courier) {
            setDeliveryErrors(prev => ({ ...prev, courier: undefined }));
        }
    };

    const handleInstructionsChange = (value: string) => {
        setDeliveryPreferences(prev => ({ ...prev, instructions: value }));
    };

    const handleInstructionsBlur = () => {
        setDeliveryTouched(prev => ({ ...prev, instructions: true }));
    };

    // Loading State
    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
                <Header type="cart" title="Checkout" />
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#ED2353" />
                    <Text className="mt-4 text-gray-600 text-base">Loading checkout...</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Error State
    if (error) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
                <Header type="cart" title="Checkout" />
                <View className="flex-1 items-center justify-center px-8">
                    <MaterialCommunityIcons name="alert-circle-outline" size={80} color="#D1D5DB" />
                    <Text className="mt-6 text-xl font-semibold text-gray-800">Failed to Load Checkout</Text>
                    <Text className="mt-2 text-center text-gray-500 text-base">
                        Something went wrong while loading checkout. Please try again.
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="mt-6 bg-primary rounded-lg py-3 px-8"
                    >
                        <Text className="text-white text-base font-semibold">Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    // Empty Cart
    if (cartItems.length === 0) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
                <Header type="cart" title="Checkout" />
                <View className="flex-1 items-center justify-center px-8">
                    <MaterialCommunityIcons name="cart-outline" size={80} color="#D1D5DB" />
                    <Text className="mt-6 text-xl font-semibold text-gray-800">Your Cart is Empty</Text>
                    <Text className="mt-2 text-center text-gray-500 text-base">
                        Add some items to your cart before checking out
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.push('/(tabs)')}
                        className="mt-6 bg-primary rounded-lg py-3 px-8"
                    >
                        <Text className="text-white text-base font-semibold">Start Shopping</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const isPlaceOrderDisabled = !selectedAddress || !selectedPaymentMethod;

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
            <Header type="cart" title="Checkout" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="p-4">
                        <OrderSummary items={cartItems} />
                        <AddressManager
                            selectedAddress={selectedAddress}
                            onSelectAddress={setSelectedAddress}
                        />
                        <DeliveryPreferencesManager
                            preferences={deliveryPreferences}
                            errors={deliveryErrors}
                            touched={deliveryTouched}
                            onCourierChange={handleCourierChange}
                            onInstructionsChange={handleInstructionsChange}
                            onInstructionsBlur={handleInstructionsBlur}
                        />
                        <PaymentSelector
                            selectedMethod={selectedPaymentMethod}
                            onSelectMethod={setSelectedPaymentMethod}
                        />
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