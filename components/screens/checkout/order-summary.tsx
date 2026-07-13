import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { CartItem } from "./types";
import { useRouter } from "expo-router";

const OrderSummary = React.memo(({ items }: { items: CartItem[] }) => {
  const router = useRouter();

  return (
    <View className="bg-white rounded-lg p-6 shadow-sm mb-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold">Order Summary</Text>
        <TouchableOpacity onPress={() => router.push("/cart")}>
          <Text className="text-primary font-semibold text-base">Edit</Text>
        </TouchableOpacity>
      </View>
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
  );
});

export default OrderSummary;
