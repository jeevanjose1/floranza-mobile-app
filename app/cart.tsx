import Header from "@/components/layout/header"
import CartItems from "@/components/screens/cart/cart-items"
import ChangeStateForm from "@/components/screens/cart/change-state"
import { useAuthenticated } from "@/hooks/useAutheticated"
import { useViewCart } from "@/services/queries/cart"
import { indianStates } from "@/shared/others/others"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRouter } from "expo-router"
import React, { useState } from "react"
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"


const getInitialState = (cData: string | null | undefined): string => {
  const DEFAULT_STATE = "KL"
  if (!cData) return DEFAULT_STATE

  try {
    const parsedData = JSON.parse(cData as string)
    return parsedData?.state || DEFAULT_STATE
  } catch (error) {
    console.warn("Failed to parse initial state data:", error)
    return DEFAULT_STATE
  }
}


type CartItem = any

// --- Main Component ---

export default function Cart() {
  const { cData, gToken } = useAuthenticated()
  const [state, setState] = useState<string>(() => getInitialState(cData))
  const [isStateModalVisible, setIsStateModalVisible] = useState(false) // Modal visibility state
  const token = gToken
  const router = useRouter()
  const { data: cart_items, isLoading } = useViewCart({
    token: token,
    filter: {
      state: state, // Pass state directly
    },
  })

  // --- Data & State Calculation ---
  const cart = cart_items?.data
  const cartItems: CartItem[] = cart?.cart || []
  const cartIsEmpty = !isLoading && cartItems.length === 0

  // Safer calculations to prevent 'NaN' errors
  const subtotal = Number(cart?.sub_total || 0)
  const shipping = Number(cart?.shipping_charge || 0)
  const total = Number(cart?.total || 0)

  // Helper to get full state name from abbreviation
  const currentSateLabel =
    indianStates.find((s) => s.code === state)?.name || state

  // --- Action Handlers ---

  
  const handleStateChange = async (newState: string) => {
    setState(newState)
    const data = {
      country: 'IN',
      state: newState,
    };
    try {
      await AsyncStorage.setItem('floranza-c-data',JSON.stringify(data))
      
    } catch (error) {
      
    }   
    
    setIsStateModalVisible(false) 
  }

  /**
   * Placeholder for placing the order
   */
  const handlePlaceOrder = () => {
    if (cartIsEmpty || isLoading) return // Prevent action if disabled
    router.push('/checkout')
  }

  // --- Render Functions ---

  /**
   * Renders a loading spinner while the cart is being fetched.
   */
  const renderLoading = () => (
    <View className="flex-1 items-center justify-center bg-gray-50">
      <ActivityIndicator size="large" />
      <Text className="mt-4 text-gray-600">Loading Your Cart...</Text>
    </View>
  )


  const renderEmptyCart = () => (
    <View className="flex-1 items-center justify-center bg-gray-50 p-8">
      <Text className="text-2xl font-bold mb-3">Your Cart is Empty </Text>
      <Text className="text-center text-gray-600">
        Looks like you haven't added anything yet.
      </Text>
      <TouchableOpacity className="mt-6 bg-primary rounded-lg py-3 px-8">
        <Text className="text-white text-lg font-bold">Start Shopping</Text>
      </TouchableOpacity>
    </View>
  )

 
  const renderCartContent = () => (
    <>
      <ScrollView className="flex-1 bg-gray-50">
        <View className="p-4">
          {/* Cart Items */}
          <View className="mb-6">
            {cartItems.map((item: CartItem,index:number) => (
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
                  {/* Make state dynamic */}
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
          <Text className="text-white text-lg font-bold">Place order</Text>
        </TouchableOpacity>
      </View>
    </>
  )

  // --- Main Return ---
  return (
    <SafeAreaView className="flex-1" edges={["top"]}>
      <Header type="cart" title="Cart" />
      {isLoading
        ? renderLoading()
        : cartIsEmpty
        ? renderEmptyCart()
        : renderCartContent()}

      <Modal
        animationType="fade"
        transparent={true}
        visible={isStateModalVisible}
        onRequestClose={() => {
          setIsStateModalVisible(false)
        }}
      >
        <Pressable
          className="flex-1 justify-center items-center bg-black/50 p-4"
          onPress={() => setIsStateModalVisible(false)} // Close on overlay press
        >
          <Pressable
            className="bg-white p-6 rounded-lg w-full"
            onPress={() => {}} // Prevents modal from closing when pressing inside it
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
  )
}