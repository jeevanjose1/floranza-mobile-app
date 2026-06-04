import Header from '@/components/layout/header'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = {}

const Return = (props: Props) => {
    const handleEmail = () => {
        Linking.openURL('mailto:support@floranzafashion.com')
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
            <Header type="cart" title="Return And Exchange" />
            
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="p-4">
                    {/* Header */}
                    <View className="bg-[#ED2353] rounded-md shadow-sm p-6 mb-4">
                        <View className="items-center">
                            <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center mb-3">
                                <Ionicons name="repeat" size={32} color="#FFFFFF" />
                            </View>
                            <Text className="text-2xl font-bold text-white mb-1 text-center">
                                Floranza Fashion Boutique
                            </Text>
                            <Text className="text-lg text-white/90 text-center">
                                Exchange/ Return Policy
                            </Text>
                        </View>
                    </View>

                    {/* Overview */}
                    <View className="bg-white rounded-md shadow-sm p-5 mb-4">
                        <Text className="text-lg font-bold text-gray-800 mb-3">
                            Overview
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6 mb-3">
                            If you have received a damaged or defective product you can return the item. In such case, you need to inform us about the return within 12 hours of product receipt along with parcel opening video. Exchange / Return product(s) must be unused, unworn, unwashed, undamaged, and un-customized.
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6 mb-3">
                            If the product does not reach us within 7 days for domestic and 30 days of International Shipment from the date of delivery, the product is not eligible for return.
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6">
                            We will be arranging an exchange with a new item or initiate a refund if the item is not in stock.
                        </Text>
                    </View>

                    {/* Refunds */}
                    <View className="bg-white rounded-md shadow-sm p-5 mb-4">
                        <Text className="text-lg font-bold text-gray-800 mb-3">
                            Refunds
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6">
                            Once your return is received, inspected, and found okay, within 5-7 working refund will be processed to the original payment method used for placing the order through our website and credit the amount to the customer's bank account.
                        </Text>
                    </View>

                    {/* Important Notice */}
                    <View className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                        <View className="flex-row items-start">
                            <Ionicons name="warning" size={24} color="#F59E0B" />
                            <View className="flex-1 ml-3">
                                <Text className="text-sm font-bold text-yellow-800 mb-1">
                                    Important:
                                </Text>
                                <Text className="text-sm text-yellow-700 leading-5">
                                    Opening video of the package received is mandatory for an exchange or refund
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Shipping Returns */}
                    <View className="bg-white rounded-md shadow-sm p-5 mb-4">
                        <Text className="text-lg font-bold text-gray-800 mb-3">
                            Shipping Returns
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6 mb-3">
                            To return your product, you should mail your product to:
                        </Text>
                        <View className="bg-gray-50 rounded-md p-4 mb-3">
                            <Text className="text-sm font-semibold text-gray-800 mb-2">
                                Return Address:
                            </Text>
                            <Text className="text-sm text-gray-600 leading-5">
                                Floranza fashion Online{'\n'}
                                St. Mary's Shopping Complex, 1st Floor{'\n'}
                                Anakkampoyil Post 673603{'\n'}
                                Kozhikode, Kerala
                            </Text>
                        </View>
                        <Text className="text-sm text-gray-600 leading-6 mb-3">
                            You will be responsible for paying for your shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6 mb-3">
                            Depending on where you live, the time it may take for your exchanged product to reach you may vary.
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6">
                            If you are returning more expensive items, you may consider using a trackable shipping service or purchasing shipping insurance. We don't guarantee that we will receive your returned item.
                        </Text>
                    </View>

                    {/* Need help */}
                    <View className="bg-[#ED2353]/5 rounded-md p-5 mb-4">
                        <View className="items-center">
                            <Ionicons name="help-circle" size={40} color="#ED2353" />
                            <Text className="text-base font-semibold text-gray-800 mt-3 mb-2 text-center">
                                Need help?
                            </Text>
                            <Text className="text-sm text-gray-600 text-center mb-4">
                                Contact us for questions related to refunds and returns
                            </Text>
                            <TouchableOpacity
                                onPress={handleEmail}
                                className="bg-[#ED2353] rounded-md px-6 py-3"
                                activeOpacity={0.8}
                            >
                                <Text className="text-white font-semibold text-sm">
                                    support@floranzafashion.com
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="h-4" />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Return