import Header from "@/components/layout/header";
import { useAuthenticated } from "@/hooks/useAutheticated";
import { useListAdderss } from "@/services/queries/account";
import {
  useApplyCoupon,
  useCheckoutCart,
  useViewCart,
} from "@/services/queries/cart";
import {
  usePhonePeStatus,
  useRazorpayStatus,
} from "@/services/queries/payment";
import { indianStates } from "@/shared/others/others";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  AppState,
  AppStateStatus,
  Image,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import RazorpayCheckout from "react-native-razorpay";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { WebView } from "react-native-webview";
import { FormInput, FormPicker } from "./add-address";




// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

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
  image?: { mini: string };
};

type PaymentMethod = "RAZORPAY" | "PHONEPE";

type DeliveryPreferences = {
  courier: string;
  instructions: string;
};

type DeliveryErrors = {
  courier?: string;
  instructions?: string;
};

// ---------------------------------------------------------------------------
// UTILITY FUNCTIONS
// ---------------------------------------------------------------------------
const getInitialState = (cData: string | null | undefined): string => {
  const DEFAULT_STATE = "KL";
  if (!cData) return DEFAULT_STATE;
  try {
    return JSON.parse(cData as string)?.state || DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
};

const getStateName = (stateCode: string) =>
  indianStates.find((s) => s.code === stateCode)?.name || stateCode;

const getShippingLabel = (option: string) =>
  option === "dtdc" ? "DTDC" : "India Post";

const sanitizeContact = (contact: string | undefined | null): string => {
  if (!contact) return "";
  const digits = contact.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  return digits.slice(-10);
};

/**
 * Parses an Android intent:// URL into a direct deep-link.
 * e.g. intent://pay?...#Intent;scheme=upi;package=...;end → upi://pay?...
 */
const parseIntentUrl = (intentUrl: string): string | null => {
  try {
    const schemeMatch = intentUrl.match(/[;#]scheme=([^;]+)/i);
    if (!schemeMatch) return null;
    const scheme = schemeMatch[1];
    const pathAndQuery = intentUrl
      .replace(/^intent:\/\//, "")
      .replace(/#Intent;.*$/i, "");
    return `${scheme}://${pathAndQuery}`;
  } catch {
    return null;
  }
};

/**
 * Opens a UPI URL natively.
 * - Handles intent:// by parsing into a direct scheme URL
 * - Calls Linking.openURL() directly (skip canOpenURL — unreliable on Android 11+)
 */
const openUpiUrl = async (url: string): Promise<void> => {
  let targetUrl = url;

  if (url.startsWith("intent://")) {
    const parsed = parseIntentUrl(url);
    if (parsed) {
      targetUrl = parsed;
    } else {
      const fallbackMatch = url.match(/S\.browser_fallback_url=([^;]+)/i);
      if (fallbackMatch) {
        targetUrl = decodeURIComponent(fallbackMatch[1]);
      } else {
        Alert.alert("Error", "Could not parse the UPI intent.");
        return;
      }
    }
  }

  // Directly call openURL — skip canOpenURL() since it's unreliable on
  // Android 11+ even with <queries> declared (returns false for some schemes)
  await Linking.openURL(targetUrl).catch(() => {
    Alert.alert("UPI app not installed", "Please install PhonePe, GPay, or Paytm and try again.");
  });
};

// ---------------------------------------------------------------------------
// ORDER SUMMARY
// ---------------------------------------------------------------------------
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
                ₹{(item.price * item.cart_qty).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  </View>
));

// ---------------------------------------------------------------------------
// COUPON MANAGER
// ---------------------------------------------------------------------------
interface CouponManagerProps {
  token: string;
  subtotal: number;
  onCouponChange: (discount: number) => void;
  appliedCoupon: any | null;
  setAppliedCoupon: (coupon: any | null) => void;
}

const CouponManager = ({
  token,
  subtotal,
  onCouponChange,
  appliedCoupon,
  setAppliedCoupon,
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
        onChangeText={setCouponCode}
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

// ---------------------------------------------------------------------------
// PRICE DETAILS
// ---------------------------------------------------------------------------
interface PriceDetailsProps {
  subtotal: number;
  shipping: number;
  couponDiscount: number;
  total: number;
  token: string;
  appliedCoupon: any | null;
  setAppliedCoupon: (coupon: any | null) => void;
  onCouponChange: (discount: number) => void;
}

const PriceDetails = ({
  subtotal,
  shipping,
  couponDiscount,
  total,
  token,
  onCouponChange,
  appliedCoupon,
  setAppliedCoupon,
}: PriceDetailsProps) => (
  <View className="bg-white rounded-lg p-6 shadow-sm mb-4">
    <Text className="text-xl font-bold mb-4">Price Details</Text>
    <View className="border-t border-gray-200 pt-4">
      <View className="flex-row justify-between mb-3">
        <Text className="text-gray-600">Subtotal</Text>
        <Text className="font-semibold">
          ₹{subtotal.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>
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
        <CouponManager
          token={token}
          subtotal={subtotal}
          onCouponChange={onCouponChange}
          appliedCoupon={appliedCoupon}
          setAppliedCoupon={setAppliedCoupon}
        />
      </View>
      <View className="border-t border-gray-200 pt-3 flex-row justify-between">
        <Text className="text-lg font-bold">Total</Text>
        <Text className="text-lg font-bold text-primary">
          ₹{total.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>
      </View>
    </View>
  </View>
);

// ---------------------------------------------------------------------------
// ADDRESS MANAGER
// ---------------------------------------------------------------------------
interface AddressManagerProps {
  selectedAddress: Address | null;
  onSelectAddress: (address: Address) => void;
}

const AddressManager = ({
  selectedAddress,
  onSelectAddress,
}: AddressManagerProps) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const router = useRouter();
  const { isAuthenticated } = useAuthenticated();
  const { data: addressData, isLoading } = useListAdderss(isAuthenticated);

  const convertApiToAddress = (apiData: any): Address | null => {
    if (!apiData?.data) return null;
    return {
      id: "api-address",
      fullName: apiData.data.fname || "",
      country: apiData.data.country || "IN",
      streetAddress: apiData.data.address_1 || "",
      addressLine2: apiData.data.address_2 || "",
      city: apiData.data.city || "",
      state: apiData.data.state || "",
      postcode: apiData.data.postcode || "",
      phone: apiData.data.phone || "",
      email: apiData.data.email || "",
      shippingOption: "standard",
    };
  };

  const getLocalAddress = async () => {
    try {
      const raw = (await AsyncStorage.getItem("@user_address")) || "";
      const localAddress = raw ? JSON.parse(raw) : null;
      const combined: Address[] = [];

      if (addressData?.success && addressData?.data) {
        const api = convertApiToAddress(addressData);
        if (api) combined.push(api);
      }

      if (localAddress) {
        const isDup = combined.some(
          (a) =>
            a.streetAddress === localAddress.streetAddress &&
            a.postcode === localAddress.postcode
        );
        if (!isDup) {
          combined.push({ ...localAddress, id: localAddress.id || "local-address" });
        }
      }

      setAddresses(combined);
    } catch (e) {
      console.error("Error loading addresses:", e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getLocalAddress();
    }, [addressData])
  );

  return (
    <View className="bg-white rounded-lg p-6 shadow-sm mb-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold">Delivery Address</Text>
        {!addresses.length && (
          <TouchableOpacity onPress={() => router.push("/add-address")}>
            <Text className="text-primary font-semibold ml-1">Add Address</Text>
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
          <Text className="text-gray-500 text-sm mt-1">Add an address to continue</Text>
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
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`mr-3 p-4 rounded-lg border min-w-[280] ${
        isSelected ? "border-primary bg-blue-50" : "border-gray-200 bg-white"
      }`}
    >
      <View className="flex-row items-start justify-between mb-2">
        <Text className="font-bold text-base flex-1">{address.fullName}</Text>
        <TouchableOpacity
          onPress={() =>
            router.push({ pathname: "/add-address", params: { isEdit: 1 } })
          }
        >
          <FontAwesome name="edit" size={20} color="black" />
        </TouchableOpacity>
      </View>
      <Text className="text-gray-600 text-sm mb-1">{address.streetAddress}</Text>
      {address.addressLine2 ? (
        <Text className="text-gray-600 text-sm mb-1">{address.addressLine2}</Text>
      ) : null}
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
  );
};

// ---------------------------------------------------------------------------
// DELIVERY PREFERENCES
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// PAYMENT SELECTOR
// ---------------------------------------------------------------------------
interface PaymentSelectorProps {
  selectedMethod: PaymentMethod | null;
  onSelectMethod: (method: PaymentMethod) => void;
}

const PaymentSelector = ({ selectedMethod, onSelectMethod }: PaymentSelectorProps) => (
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

// ---------------------------------------------------------------------------
// PLACE ORDER FOOTER
// ---------------------------------------------------------------------------
const PlaceOrderFooter = ({
  total,
  onPress,
  disabled,
  loading,
}: {
  total: number;
  onPress: () => void;
  disabled: boolean;
  loading: boolean;
}) => (
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

// ---------------------------------------------------------------------------
// MAIN CHECKOUT COMPONENT
// ---------------------------------------------------------------------------
const Checkout = () => {
  const { cData, gToken } = useAuthenticated();
  const token = gToken;
  const router = useRouter();

  const [state] = useState<string>(() => getInitialState(cData));
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
  const [deliveryPreferences, setDeliveryPreferences] = useState<DeliveryPreferences>({
    courier: "",
    instructions: "",
  });
  const [deliveryErrors, setDeliveryErrors] = useState<DeliveryErrors>({});
  const [deliveryTouched, setDeliveryTouched] = useState({
    courier: false,
    instructions: false,
  });

  // PhonePe WebView state — only used when PhonePe returns a redirect URL
  // (not used for UPI intent flow)
  const [phonePeWebView, setPhonePeWebView] = useState<{
    url: string;
    orderId: string;
  } | null>(null);

  // Refs
  const isVerifyingPayment = useRef(false);
  const pendingPhonePeOrderId = useRef<string | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  const { mutateAsync: checkout, isPending: checkoutPending } = useCheckoutCart();
  const { mutateAsync: get_status } = useRazorpayStatus();
  const { mutateAsync: getPhonePeStatus } = usePhonePeStatus();

  const {
    data: cart_items,
    isLoading,
    error,
  } = useViewCart({
    token,
    filter: {
      state: selectedAddress?.state || state,
      ...(appliedCoupon && { coupon_code: appliedCoupon.coupon_code }),
    },
  });

  const cart = cart_items?.data;
  const cartItems: CartItem[] = cart?.cart || [];
  const subtotal = Number(cart?.sub_total || 0);
  const shipping = Number(cart?.shipping_charge || 0);
  const total = Number(cart?.total || 0) - couponDiscount;

  // -------------------------------------------------------------------------
  // AppState listener — fires when user returns from UPI app
  // -------------------------------------------------------------------------
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      const wasBackground = appStateRef.current === "background";
      const isNowActive = nextAppState === "active";

      if (wasBackground && isNowActive && pendingPhonePeOrderId.current) {
        const orderId = pendingPhonePeOrderId.current;
        pendingPhonePeOrderId.current = null;
        // Small delay to let the UPI app finish its callback
        setTimeout(() => handlePhonePeResult(orderId, orderId), 1500);
      }

      appStateRef.current = nextAppState;
    });

    return () => subscription.remove();
  }, []);

  // -------------------------------------------------------------------------
  // Payment result handlers
  // -------------------------------------------------------------------------
  const handlePhonePeResult = useCallback(
    async (merchantOrderId: string, fallbackOrderId?: string) => {
      if (isVerifyingPayment.current) return;
      isVerifyingPayment.current = true;

      try {
        const res = await getPhonePeStatus(merchantOrderId);
        const status = res?.data?.state;
        const orderId = res?.data?.order_id || res?.data?.orderId || fallbackOrderId;

        if (status === "COMPLETED" && orderId) {
          router.replace({
            pathname: "/payment-success",
            params: { order_id: orderId },
          });
          return;
        }

        Toast.show({
          type: "error",
          text1: "Payment not confirmed",
          text2: "Please check your orders or try again.",
        });
        router.replace("/payment-faild");
      } catch (err: any) {
        Toast.show({
          type: "error",
          text1: "Payment failed",
          text2: err?.data?.message || "Could not confirm payment. Contact support.",
        });
        router.replace("/payment-faild");
      } finally {
        isVerifyingPayment.current = false;
      }
    },
    [getPhonePeStatus, router]
  );

  const handleRazorpaySubmit = (response: any) => {
    const rData = response?.pg?.RAZORPAY;
    const amountPaise = Math.round(Number.parseFloat(response?.total ?? 0) * 100);
    const sanitizedContact = sanitizeContact(
      rData?.prefill?.contact ?? rData?.contact ?? ""
    );

    RazorpayCheckout?.open({
      description: rData?.description,
      currency: "INR",
      key: rData?.key,
      amount: amountPaise,
      name: rData?.name,
      order_id: rData?.order_id,
      prefill: {
        email: rData?.prefill?.email ?? rData?.email ?? "",
        contact: sanitizedContact,
        name: rData?.prefill?.name ?? rData?.name ?? "",
      },
      method: { upi: true, card: true, netbanking: true, wallet: true, emi: false },
      theme: { color: "#F37254" },
    } as any)
      .then((data: any) => {
        get_status(data?.razorpay_payment_id, {
          onSuccess: (res: any) => {
            router.replace({
              pathname: "/payment-success",
              params: { order_id: res?.data?.order_id },
            });
          },
          onError: () => router.replace("/payment-faild"),
        });
      })
      .catch((err: any) => {
        if (err?.message) {
          Toast.show({
            type: "error",
            text1: "Payment Failed",
            text2: err?.description || err?.message || "Issue opening Razorpay",
          });
        }
      });
  };

  /**
   * PhonePe submit handler.
   *
   * PhonePe has TWO possible flows:
   *
   * FLOW A — UPI Intent (isIntentOnWebViewEnabled: false)
   *   response.pg.PHONEPE contains { intentUrl: "upi://pay?..." }
   *   → Open UPI app directly via Linking.openURL()
   *   → Use AppState to detect return and verify payment
   *
   * FLOW B — Redirect / WebView (isIntentOnWebViewEnabled: true)
   *   response.pg.PHONEPE contains { redirectInfo: { url: "https://..." } }
   *   → Open WebView overlay
   *   → Injected JS intercepts UPI intents fired inside the WebView
   */
  const handlePhonePeSubmit = async (response: any) => {
    const phonePeData = response?.pg?.PHONEPE || {};

    // Log for debugging — remove in production
    console.log("PhonePe data:", JSON.stringify(phonePeData, null, 2));

    const orderId: string =
      phonePeData?.order_id ||
      phonePeData?.orderId ||
      phonePeData?.merchantOrderId ||
      response?.data?.order_id ||
      "";

    // -----------------------------------------------------------------------
    // FLOW A: Direct UPI Intent URL
    // -----------------------------------------------------------------------
    const intentUrl: string = phonePeData?.intentUrl || "";
    if (intentUrl && intentUrl.startsWith("upi://")) {
      // Store orderId so AppState listener can verify when user returns
      pendingPhonePeOrderId.current = orderId;
      isVerifyingPayment.current = false;

      await Linking.openURL(intentUrl).catch(() => {
        pendingPhonePeOrderId.current = null;
        Toast.show({
          type: "error",
          text1: "No UPI app found",
          text2: "Install PhonePe, GPay, or Paytm and try again.",
        });
      });
      return;
    }

    // -----------------------------------------------------------------------
    // FLOW B: WebView redirect URL via PhonePe SDK
    // -----------------------------------------------------------------------
    const redirectUrl: string = phonePeData?.redirectInfo?.url || phonePeData?.url || "";
    if (!redirectUrl) {
      Toast.show({
        type: "error",
        text1: "PhonePe setup incomplete",
        text2: "No payment URL received. Please try again.",
      });
      return;
    }

    if (!orderId) {
      Toast.show({
        type: "error",
        text1: "PhonePe setup incomplete",
        text2: "No order ID received from payment gateway.",
      });
      return;
    }

    pendingPhonePeOrderId.current = orderId;
    isVerifyingPayment.current = false;
    
    // Open WebView overlay using the HTML SDK injection method
    setPhonePeWebView({ url: redirectUrl, orderId });
  };

  // -------------------------------------------------------------------------
  // WebView helpers
  // -------------------------------------------------------------------------
  const handleCancelPhonePeWebView = useCallback(() => {
    setPhonePeWebView(null);
    pendingPhonePeOrderId.current = null;
  }, []);

  const handleCompletePhonePeWebView = useCallback(() => {
    const orderId = phonePeWebView?.orderId;
    setPhonePeWebView(null);
    if (orderId) handlePhonePeResult(orderId, orderId);
  }, [phonePeWebView, handlePhonePeResult]);

  /**
   * Central URL decision for WebView.
   * Returns true  → allow WebView to load
   * Returns false → block WebView (we handle it natively)
   */
  const handleWebViewUrl = useCallback(
    (url: string): boolean => {
      if (!url || url === "about:blank") return true;
      const lower = url.toLowerCase();

      // UPI / intent deep-links → open natively, block WebView
      const isUpi =
        lower.startsWith("intent://") ||
        lower.startsWith("upi://") ||
        lower.startsWith("ppe://") ||
        lower.startsWith("gpay://") ||
        lower.startsWith("tez://") ||
        lower.startsWith("phonepe://") ||
        lower.startsWith("paytmmp://") ||
        lower.startsWith("credpay://") ||
        lower.startsWith("bhim://") ||
        lower.startsWith("super://") ||
        lower.startsWith("amazonpay://");

      if (isUpi) {
        openUpiUrl(url).catch(() => {});
        return false;
      }

      // Payment completion redirect → close WebView and verify
      const isDone =
        (lower.includes("floranzafashion.com") &&
          !lower.includes("phonepe") &&
          !lower.includes("pay.phonepe")) ||
        lower.includes("/payment-success") ||
        lower.includes("/payment-fail") ||
        lower.includes("/payment-cancel") ||
        lower.includes("/order-received");

      if (isDone) {
        setPhonePeWebView(null);
        const orderId = phonePeWebView?.orderId;
        if (orderId) handlePhonePeResult(orderId, orderId);
        return false;
      }

      return true;
    },
    [phonePeWebView, handlePhonePeResult]
  );

  // -------------------------------------------------------------------------
  // Delivery validation
  // -------------------------------------------------------------------------
  const validateDeliveryPreferences = (): boolean => {
    const errors: DeliveryErrors = {};
    if (!deliveryPreferences.courier) {
      errors.courier = "Please select a preferred courier";
    }
    setDeliveryErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // -------------------------------------------------------------------------
  // Place order
  // -------------------------------------------------------------------------
  const handlePlaceOrder = () => {
    setDeliveryTouched({ courier: true, instructions: true });
    if (!validateDeliveryPreferences()) return;
    if (!selectedAddress || !selectedPaymentMethod) return;

    const dataObject = {
      fname: selectedAddress.fullName,
      country: selectedAddress.country,
      address_1: `${selectedAddress.streetAddress}, ${selectedAddress.addressLine2}`,
      city: selectedAddress.city,
      state: selectedAddress.state,
      postcode: selectedAddress.postcode,
      phone: selectedAddress.phone,
      email: selectedAddress.email,
      courier: deliveryPreferences.courier,
      notes: deliveryPreferences.instructions,
      order_via: "MOBILE",
      pg: cart_items?.data?.total === 0 ? "WALLET" : selectedPaymentMethod,
      ...(appliedCoupon && { coupon_code: appliedCoupon.coupon_code }),
    };

    checkout(
      { data: dataObject, token },
      {
        onSuccess: (response) => {
          const paymentType = response?.data?.pg
            ? Object.keys(response.data.pg)[0]
            : null;

          if (paymentType === "RAZORPAY") {
            handleRazorpaySubmit(response.data);
          } else if (paymentType === "PHONEPE") {
            handlePhonePeSubmit(response.data);
          } else {
            router.replace(`/payment-success?order_id=${response?.data?.order_id}`);
          }
        },
        onError: (err: any) => {
          Toast.show({
            type: "error",
            text1: err?.data?.message || "Checkout failed. Please try again.",
          });
        },
      }
    );
  };

  // -------------------------------------------------------------------------
  // LOADING / ERROR / EMPTY states
  // -------------------------------------------------------------------------
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

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
        <Header type="cart" title="Checkout" />
        <View className="flex-1 items-center justify-center px-8">
          <MaterialCommunityIcons name="alert-circle-outline" size={80} color="#D1D5DB" />
          <Text className="mt-6 text-xl font-semibold text-gray-800">
            Failed to Load Checkout
          </Text>
          <Text className="mt-2 text-center text-gray-500 text-base">
            Something went wrong. Please try again.
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

  if (cartItems.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
        <Header type="cart" title="Checkout" />
        <View className="flex-1 items-center justify-center px-8">
          <MaterialCommunityIcons name="cart-outline" size={80} color="#D1D5DB" />
          <Text className="mt-6 text-xl font-semibold text-gray-800">
            Your Cart is Empty
          </Text>
          <Text className="mt-2 text-center text-gray-500 text-base">
            Add some items to your cart before checking out.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)")}
            className="mt-6 bg-primary rounded-lg py-3 px-8"
          >
            <Text className="text-white text-base font-semibold">Start Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // -------------------------------------------------------------------------
  // MAIN RENDER
  // -------------------------------------------------------------------------
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
              onCourierChange={(value) => {
                setDeliveryPreferences((p) => ({ ...p, courier: value }));
                if (value && deliveryErrors.courier) {
                  setDeliveryErrors((p) => ({ ...p, courier: undefined }));
                }
              }}
              onInstructionsChange={(value) =>
                setDeliveryPreferences((p) => ({ ...p, instructions: value }))
              }
              onInstructionsBlur={() =>
                setDeliveryTouched((p) => ({ ...p, instructions: true }))
              }
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
              appliedCoupon={appliedCoupon}
              setAppliedCoupon={setAppliedCoupon}
            />
          </View>
        </ScrollView>

        <PlaceOrderFooter
          total={total}
          onPress={handlePlaceOrder}
          disabled={!selectedAddress || !selectedPaymentMethod}
          loading={checkoutPending}
        />
      </KeyboardAvoidingView>

    
      {phonePeWebView && (
        <Modal
          visible={!!phonePeWebView}
          animationType="slide"
          onRequestClose={handleCancelPhonePeWebView}
        >
          <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
            <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
              <Text className="text-lg font-bold">Complete Payment</Text>
              <TouchableOpacity onPress={handleCancelPhonePeWebView}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <WebView
              source={{
                html: `
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                    <script src="https://mercury.phonepe.com/web/bundle/checkout.js"></script>
                  </head>
                  <body style="margin:0;padding:0;background-color:#fff;display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;">
                    <div id="loading" style="font-size:18px;color:#333;">Initializing PhonePe...</div>
                    <script>
                      window.onload = function() {
                        if (window.PhonePeCheckout && window.PhonePeCheckout.transact) {
                          window.PhonePeCheckout.transact({
                            tokenUrl: "${phonePeWebView.url}",
                            callback: function(response) {
                              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'PAYMENT_DONE' }));
                            },
                            type: "REDIRECT"
                          });
                        } else {
                          document.getElementById('loading').innerText = "Failed to load PhonePe SDK";
                        }
                      };
                    </script>
                  </body>
                  </html>
                `,
                baseUrl: "https://floranzafashion.com"
              }}
              style={{ flex: 1 }}
              originWhitelist={["*"]}
              domStorageEnabled
              javaScriptEnabled
              setSupportMultipleWindows={false}
              mixedContentMode="compatibility"
              userAgent="Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
              onMessage={(event) => {
                try {
                  const data = JSON.parse(event.nativeEvent.data);
                  if (data?.type === "upi_intent" && data?.url) {
                    pendingPhonePeOrderId.current = phonePeWebView.orderId;
                    openUpiUrl(data.url).catch(() => {});
                  } else if (data?.type === "PAYMENT_DONE") {
                    handleCompletePhonePeWebView();
                  }
                } catch (_) {}
              }}
              onShouldStartLoadWithRequest={(request) => {
                return handleWebViewUrl(request.url);
              }}
              onNavigationStateChange={(navState) => {
                const lower = (navState.url || "").toLowerCase();
               
                const isDone =
                  lower.includes("/payment-success") ||
                  lower.includes("/payment-fail") ||
                  lower.includes("/payment-cancel") ||
                  lower.includes("/order-received");
                
                if (isDone) handleCompletePhonePeWebView();
              }}
              onError={(e) => {
                const url = e.nativeEvent.url || "";
                if (
                  url.startsWith("upi://") ||
                  url.startsWith("intent://") ||
                  url.startsWith("ppe://") ||
                  url.startsWith("gpay://") ||
                  url.startsWith("tez://") ||
                  url.startsWith("paytmmp://")
                ) {
                  openUpiUrl(url).catch(() => {});
                }
              }}
            />
          </SafeAreaView>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default Checkout;