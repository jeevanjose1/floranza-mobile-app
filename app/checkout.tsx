import Header from "@/components/layout/header";
import AddressManager from "@/components/screens/checkout/address-manager";
import DeliveryPreferencesManager from "@/components/screens/checkout/delivery-preferences-manager";
import OrderSummary from "@/components/screens/checkout/order-summary";
import PaymentMethodSelector from "@/components/screens/checkout/payment-method-selector";
import PhonePeModal from "@/components/screens/checkout/phonepe-modal";
import PlaceOrderFooter from "@/components/screens/checkout/place-order-footer";
import PriceDetails from "@/components/screens/checkout/price-details";
import { Address, CartItem, DeliveryErrors, DeliveryPreferences, PaymentMethod } from "@/components/screens/checkout/types";
import { getInitialState, sanitizeContact } from "@/components/screens/checkout/utils";
import { useAuthenticated } from "@/hooks/useAutheticated";
import {
  useCheckoutCart,
  useViewCart,
} from "@/services/queries/cart";
import {
  usePhonePeStatus,
  useRazorpayStatus,
} from "@/services/queries/payment";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  AppState,
  AppStateStatus,
  Linking,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import RazorpayCheckout from "react-native-razorpay";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

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
  const { mutateAsync: getPhonePeStatus, isPending: isPhonePeStatusPending } = usePhonePeStatus();
  const [isVerifyingOverlay, setIsVerifyingOverlay] = useState(false);

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
  // Payment result handlers
  // -------------------------------------------------------------------------
  const handlePhonePeResult = useCallback(
    async (merchantOrderId: string, fallbackOrderId?: string, attempt: number = 1) => {
      if (isVerifyingPayment.current && attempt === 1) return;
      isVerifyingPayment.current = true;
      setIsVerifyingOverlay(true);

      try {
        const res = await getPhonePeStatus(merchantOrderId);
        const orderId =
          res?.data?.order_id ||
          res?.data?.orderId ||
          res?.data?.merchantOrderId ||
          fallbackOrderId;

        if (orderId) {
          setIsVerifyingOverlay(false);
          router.replace({ pathname: "/payment-success", params: { order_id: orderId } });
          isVerifyingPayment.current = false;
          return;
        }

        if (attempt < 3) {
          setTimeout(() => handlePhonePeResult(merchantOrderId, fallbackOrderId, attempt + 1), 1000);
          return;
        }

        
      } catch {
       
        Toast.show({ type: "error", text1: "Payment failed", text2: "Could not verify payment. Please check your orders." });
        setIsVerifyingOverlay(false);
        router.replace("/payment-faild");
        isVerifyingPayment.current = false;
      }
    },
    [getPhonePeStatus, router]
  );

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

        // Close the WebView modal immediately so it doesn't fire conflicting
        // navigation events while we verify the payment
        setPhonePeWebView(null);

        // Give PhonePe's servers 2s to process the UPI callback before we
        // query the status — prevents false failures on fast returns
        setTimeout(() => handlePhonePeResult(orderId, orderId, 1), 2000);
      }

      appStateRef.current = nextAppState;
    });

    return () => subscription.remove();
  }, [handlePhonePeResult]);

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


  const handlePhonePeSubmit = async (response: any) => {
    const phonePeData = response?.pg?.PHONEPE || {};

  
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
  const handleCancelPhonePeModal = useCallback(() => {
    setPhonePeWebView(null);
    pendingPhonePeOrderId.current = null;
  }, []);

  const handleCompletePhonePeModal = useCallback((orderId: string) => {
    setPhonePeWebView(null);
    handlePhonePeResult(orderId, orderId);
  }, [handlePhonePeResult]);

  const handleUpiIntentPhonePeModal = useCallback((orderId: string) => {
    pendingPhonePeOrderId.current = orderId;
  }, []);

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

      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        enableOnAndroid
        extraScrollHeight={120}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
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
          <PaymentMethodSelector
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
      </KeyboardAwareScrollView>

      <PlaceOrderFooter
        total={total}
        onPress={handlePlaceOrder}
        disabled={!selectedAddress || !selectedPaymentMethod}
        loading={checkoutPending}
      />


      <PhonePeModal
        phonePeWebView={phonePeWebView}
        onCancel={handleCancelPhonePeModal}
        onComplete={handleCompletePhonePeModal}
        onUpiIntent={handleUpiIntentPhonePeModal}
      />

      {/* Payment verification loading overlay */}
      {(isVerifyingOverlay || isPhonePeStatusPending) && (
        <View
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 16,
              paddingVertical: 32,
              paddingHorizontal: 40,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 10,
            }}
          >
            <ActivityIndicator size="large" color="#ED2353" />
            <Text style={{ marginTop: 16, fontSize: 16, fontWeight: "600", color: "#1f2937" }}>
              Verifying Payment...
            </Text>
            <Text style={{ marginTop: 6, fontSize: 13, color: "#6b7280", textAlign: "center" }}>
              Please wait, do not close the app
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Checkout;