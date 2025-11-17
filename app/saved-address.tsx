import Header from '@/components/layout/header'
import { useListAdderss } from '@/services/queries/account'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import { useRouter } from 'expo-router'
import React from 'react'
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = {}

const SavedAddress = (props: Props) => {
    const router = useRouter()
    const { data: addressData, isLoading, error } = useListAdderss()

    const address = addressData?.data
    const hasAddress = address && address.fname

    // Loading State
    if (isLoading) {
        return (
            <SafeAreaView className='flex-1 bg-gray-50' edges={['top']}>
                <Header title='Address' type="account" />
                <View className='flex-1 items-center justify-center'>
                    <ActivityIndicator size="large" color="#ED2353" />
                    <Text className='mt-4 text-gray-600 text-base'>Loading address...</Text>
                </View>
            </SafeAreaView>
        )
    }

    // Error State
    if (error) {
        return (
            <SafeAreaView className='flex-1 bg-gray-50' edges={['top']}>
                <Header title='Address' type="account" />
                <View className='flex-1 items-center justify-center px-8'>
                    <MaterialCommunityIcons name="alert-circle-outline" size={80} color="#D1D5DB" />
                    <Text className='mt-6 text-xl font-semibold text-gray-800'>Failed to Load Address</Text>
                    <Text className='mt-2 text-center text-gray-500 text-base'>
                        Something went wrong while loading your address. Please try again.
                    </Text>
                    <TouchableOpacity 
                        onPress={() => window.location.reload()}
                        className='mt-6 bg-primary rounded-lg py-3 px-8'
                    >
                        <Text className='text-white text-base font-semibold'>Retry</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView className='flex-1 bg-gray-50' edges={['top']}>
            <Header title='Address' type="account" />

            <ScrollView className='flex-1 px-4 py-4'>
                {hasAddress ? (
                    // Saved Address Card
                    <View className='bg-white rounded-lg p-4 shadow-sm border border-gray-100'>
                        <View className='mb-4'>
                            <Text className='text-base font-bold text-black mb-2 uppercase'>
                                {address.fname} {address.lname}
                            </Text>
                            <Text className='text-sm text-gray-700 leading-5 mb-1'>
                                {address.address1}
                            </Text>
                            {address.address_2 && (
                                <Text className='text-sm text-gray-700 leading-5 mb-1'>
                                    {address.address_2}
                                </Text>
                            )}
                            <Text className='text-sm text-gray-700 leading-5 mb-1'>
                                {address.state}, {address.postcode}
                            </Text>
                            <Text className='text-sm text-gray-700 leading-5 mb-1'>
                                {address.country}
                            </Text>
                            <View className='mt-3 pt-3 border-t border-gray-100'>
                                <Text className='text-sm text-gray-700 mb-1'>
                                    <Text className='font-semibold'>Email: </Text>
                                    {address.email}
                                </Text>
                                <Text className='text-sm text-gray-700'>
                                    <Text className='font-semibold'>Phone: </Text>
                                    {address.phone}
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            className='bg-primary py-3 rounded-md flex-row items-center justify-center gap-2'
                            onPress={() => router.push({
                                pathname: '/add-address',
                                params: { isEdit: hasAddress }
                            })}
                            activeOpacity={0.8}
                        >
                            <FontAwesome6 name='edit' size={14} color="#fff" />
                            <Text className='text-white font-semibold text-sm uppercase tracking-wider'>
                                Edit Address
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    // No Address - Empty State
                    <View className='flex-1 items-center justify-center px-8 py-16'>
                        <MaterialCommunityIcons name="map-marker-outline" size={80} color="#D1D5DB" />
                        <Text className='mt-6 text-xl font-semibold text-gray-800'>No Address Saved</Text>
                        <Text className='mt-2 text-center text-gray-500 text-base'>
                            Add your delivery address for faster checkout and seamless delivery
                        </Text>
                        <TouchableOpacity
                            className='mt-6 bg-primary py-3 px-8 rounded-lg flex-row items-center gap-2'
                            onPress={() => router.push({
                                pathname: '/add-address',
                                params: { isEdit: hasAddress }
                            })}
                            activeOpacity={0.8}
                        >
                            <FontAwesome6 name='add' size={14} color="#fff" />
                            <Text className='text-white font-semibold text-base'>
                                Add Address
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

export default SavedAddress