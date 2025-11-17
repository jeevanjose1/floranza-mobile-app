import Header from '@/components/layout/header'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = {}

const Shipping = (props: Props) => {
    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
            <Header type="cart" title="Shipping And Delivery" />
            
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="p-4">
                    {/* Header */}
                    <View className="bg-[#ED2353] rounded-md shadow-sm p-6 mb-4">
                        <View className="items-center">
                            <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center mb-3">
                                <Ionicons name="cube" size={32} color="#FFFFFF" />
                            </View>
                            <Text className="text-2xl font-bold text-white text-center">
                                SHIPPING & DELIVERY POLICY
                            </Text>
                        </View>
                    </View>

                    {/* Domestic Shipping */}
                    <View className="bg-white rounded-md shadow-sm p-5 mb-4">
                        <View className="flex-row items-center mb-3">
                            <View className="w-12 h-12 bg-[#ED2353]/10 rounded-full items-center justify-center mr-3">
                                <Ionicons name="home" size={24} color="#ED2353" />
                            </View>
                            <Text className="text-lg font-bold text-gray-800 flex-1">
                                Domestic Shipping:
                            </Text>
                        </View>
                        <Text className="text-sm text-gray-600 leading-6">
                            All the confirmed domestic orders (except pre-booking products) shall be dispatched from our store within 3 working days and It may take around 5-10 working days for the shipment to be delivered.
                        </Text>
                    </View>

                    {/* International Shipping */}
                    <View className="bg-white rounded-md shadow-sm p-5 mb-4">
                        <View className="flex-row items-center mb-3">
                            <View className="w-12 h-12 bg-[#ED2353]/10 rounded-full items-center justify-center mr-3">
                                <Ionicons name="globe" size={24} color="#ED2353" />
                            </View>
                            <Text className="text-lg font-bold text-gray-800 flex-1">
                                International Shipping:
                            </Text>
                        </View>
                        <Text className="text-sm text-gray-600 leading-6">
                            For International orders item shall be dispatched from our store within 7- 10 working days and it shall be delivered with in 14- 21 days.
                        </Text>
                    </View>

                    {/* International Customs Charges */}
                    <View className="bg-white rounded-md shadow-sm p-5 mb-4">
                        <View className="flex-row items-center mb-3">
                            <View className="w-12 h-12 bg-[#ED2353]/10 rounded-full items-center justify-center mr-3">
                                <Ionicons name="card" size={24} color="#ED2353" />
                            </View>
                            <Text className="text-lg font-bold text-gray-800 flex-1">
                                International Customs Charges:
                            </Text>
                        </View>
                        <Text className="text-sm text-gray-600 leading-6">
                            Some destination countries charge customs on the shipments. All customs charges, local taxes, and delivery company's processing fees for clearing customs are to be borne by the customer unless it is charged at checkout.
                        </Text>
                    </View>

                    <View className="h-4" />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Shipping