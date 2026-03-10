import Header from "@/components/layout/header";
import CartItems from "@/components/screens/cart/cart-items";
import ChangeStateForm from "@/components/screens/cart/change-state";
import { useAuthenticated } from "@/hooks/useAutheticated";
import { useViewCart } from "@/services/queries/cart";
import { indianStates } from "@/shared/others/others";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

type CartItem = any;

export default function Cart() {
  const { cData, gToken } = useAuthenticated();
  const [state, setState] = useState<string>(() => getInitialState(cData));
  const [isStateModalVisible, setIsStateModalVisible] = useState(false);
  const token = gToken;
  const router = useRouter();

  const {
    data: cart_items,
    isLoading,
    error,
  } = useViewCart({
    token: token,
    filter: {
      state: state,
    },
  });

  const cart = cart_items?.data;
  const cartItems: CartItem[] = cart?.cart || [];
  const cartIsEmpty = !isLoading && cartItems.length === 0;

  const subtotal = Number(cart?.sub_total || 0);
  const shipping = Number(cart?.shipping_charge || 0);
  const total = Number(cart?.total || 0);

  const currentSateLabel =
    indianStates.find((s) => s.code === state)?.name || state;

  const handleStateChange = async (newState: string) => {
    setState(newState);
    const data = {
      country: "IN",
      state: newState,
    };
    try {
      await AsyncStorage.setItem("floranza-c-data", JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save state:", error);
    }
    setIsStateModalVisible(false);
  };

  const handlePlaceOrder = () => {
    if (cartIsEmpty || isLoading) return;
    router.push("/checkout");
  };

  const handleStartShopping = () => {
    router.push("/(tabs)");
  };

  // Loading State
  const renderLoading = () => (
    <View className="flex-1 items-center justify-center bg-gray-50">
      <ActivityIndicator size="large" color="#ED2353" />
      <Text className="mt-4 text-gray-600 text-base">Loading your cart...</Text>
    </View>
  );

  // Error State
  const renderError = () => (
    <View className="flex-1 items-center justify-center bg-gray-50 px-8">
      <MaterialCommunityIcons
        name="alert-circle-outline"
        size={80}
        color="#D1D5DB"
      />
      <Text className="mt-6 text-xl font-semibold text-gray-800">
        Failed to Load Cart
      </Text>
      <Text className="mt-2 text-center text-gray-500 text-base">
        Something went wrong while loading your cart. Please try again.
      </Text>
      <TouchableOpacity
        onPress={() => window.location.reload()}
        className="mt-6 bg-primary rounded-lg py-3 px-8"
      >
        <Text className="text-white text-base font-semibold">Retry</Text>
      </TouchableOpacity>
    </View>
  );

  // Empty Cart State
  const renderEmptyCart = () => (
    <View className="flex-1 items-center justify-center bg-gray-50 px-8">
      <MaterialCommunityIcons name="cart-outline" size={80} color="#D1D5DB" />
      <Text className="mt-6 text-sm font-semibold text-gray-800">
        Your Cart is Empty
      </Text>
      <Text className="mt-2 text-center text-gray-500 text-base">
        Looks like you haven't added anything yet. Start shopping to fill your
        cart!
      </Text>
      <TouchableOpacity
        onPress={handleStartShopping}
        className="mt-6 bg-primary rounded-lg py-3 px-8"
      >
        <Text className="text-white text-base font-semibold">
          Start Shopping
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Cart Content with Items
  const renderCartContent = () => (
    <>
      <ScrollView className="flex-1 bg-gray-50">
        <View className="p-4">
          {/* Cart Items */}
          <View className="mb-6">
            {cartItems.map((item: CartItem, index: number) => (
              <CartItems key={index} item={item} />
            ))}
          </View>

          {/* Order Summary */}
          <View className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <Text className="text-xl font-bold mb-4">Order Summary</Text>

            {/* Price Details */}
            <View className="mb-4">
              <View className="flex-row justify-between mb-3">
                <Text className="text-gray-600">Subtotal</Text>
                <Text className="font-semibold">₹{subtotal.toFixed(2)}</Text>
              </View>
              <View className="flex-row justify-between mb-3">
                <Text className="text-gray-600">Shipping</Text>
                <Text className="font-semibold">₹{shipping.toFixed(2)}</Text>
              </View>
              <View className="border-t border-gray-200 pt-3 flex-row justify-between">
                <Text className="text-lg font-bold">Total</Text>
                <Text className="text-lg font-bold text-primary">
                  ₹{total.toFixed(2)}
                </Text>
              </View>
            </View>

            {/* Shipping Details */}
            <View className="border-t border-gray-200 pt-4 mb-4">
              <View className="flex-row justify-between items-start">
                <View>
                  <Text className="text-gray-600 text-sm mb-1">Ship to</Text>
                  <Text className="font-semibold">{currentSateLabel}</Text>
                </View>
                <TouchableOpacity onPress={() => setIsStateModalVisible(true)}>
                  <Text className="underline text-black/70 font-semibold">
                    Change
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer/Checkout Button */}
      <View className="h-24 px-4 pt-4 bg-white border-t border-gray-200">
        <TouchableOpacity
          onPress={handlePlaceOrder}
          disabled={cartIsEmpty || isLoading}
          className={`rounded-lg py-3 items-center ${
            cartIsEmpty || isLoading ? "bg-gray-400" : "bg-primary"
          }`}
        >
          <Text className="text-white text-lg font-bold">Go To Checkout</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  // Main Render Logic
  const renderContent = () => {
    if (isLoading) {
      return renderLoading();
    }

    if (error) {
      return renderError();
    }

    if (cartIsEmpty) {
      return renderEmptyCart();
    }

    return renderCartContent();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <Header type="cart" title="Cart" />
      {renderContent()}

      <Modal
        animationType="fade"
        transparent={true}
        visible={isStateModalVisible}
        onRequestClose={() => setIsStateModalVisible(false)}
      >
        <Pressable
          className="flex-1 justify-center items-center bg-black/50 p-4"
          onPress={() => setIsStateModalVisible(false)}
        >
          <Pressable
            className="bg-white p-6 rounded-lg w-full max-w-md"
            onPress={() => {}}
          >
            <ChangeStateForm
              currentState={state}
              onClose={() => setIsStateModalVisible(false)}
              onSubmit={handleStateChange}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
