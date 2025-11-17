import ProductCard from "@/components/common/product-card"
import Header from "@/components/layout/header"
import useBreakPoints from "@/hooks/useBreajpoints"
import { calculate_discount, calculate_product_price } from "@/lib/utils"
import { useDeleteWishlist, useGetWishlistInfinity } from "@/services/queries/product"
import { AntDesign, Ionicons } from "@expo/vector-icons"
import { FlashList } from "@shopify/flash-list"
import { useCallback, useState } from "react"
import { ActivityIndicator, RefreshControl, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Toast from "react-native-toast-message"


const WishlistCard = ({ item }: any) => {
    const { mutateAsync: remove_wishlist, isPending: deleteWishlistPending } = useDeleteWishlist()
    const handleDelete = (wishlist_id: string) => {
        remove_wishlist(wishlist_id, {
            onSuccess: (response) => {
                Toast.show({
                    type: 'success',
                    text1: response?.message
                })
            }, onError: (error) => {

                Toast.show({
                    type: 'success',
                    text1: error.message
                })
            }
        })
    }
    return (
        <View className='flex-1 p-1 relative'>
            <TouchableOpacity
                onPress={() => handleDelete(item.wishlist_id)}
                className="absolute z-10 right-3 top-3"
            >
                <View className="bg-white w-8 h-8 items-center justify-center rounded-md">
                    {deleteWishlistPending ? (
                        <AntDesign name="loading" size={16} color="red" />
                    ) : (
                        <Ionicons name="trash" size={16} color="red" />
                    )}
                </View>
            </TouchableOpacity>
            <ProductCard
                name={item?.title}
                price={item.price?.min as any}
                oldPrice={item.price?.max !== 0 && String(item.price?.max) as any}
                discount={item.price?.max ? calculate_discount(item?.price?.min, item?.price?.max) as number : 0}
                image={item.image}
                slug={item.slug}
            />
        </View>)
}

export default function Wishlist() {


    const [refreshing, setRefreshing] = useState(false)

    const {
        data: product,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
        isRefetching
    } = useGetWishlistInfinity({


    })


    const flat_product = product ? product?.pages?.map((item: any) => item?.data?.data)?.flat() : []

    const filterd_data =
        flat_product?.map((item: any) => {
            return {
                wishlist_id: item?.wishlist_id,
                id: item?.id,
                title: item?.name,
                price: calculate_product_price(item),
                image: item?.images?.large,
                slug: item?.slug,
                is_pre_order: item?.is_pre_order,
                is_new_product: item?.is_new_product
            }
        }) || []


    const { isWidth } = useBreakPoints({ breakPoint: 475 })

    const numColumns = isWidth ? 2 : 3





    const loadMore = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage])






    const onRefresh = async () => {
        setRefreshing(true)
        await refetch()
        setRefreshing(false)
    }
    const renderFooter = () => {
        if (!isFetchingNextPage) return null
        return (
            <View className='py-4 items-center'>
                <ActivityIndicator size='large' color='#ED2353' />
            </View>
        )
    }

    return (
        <SafeAreaView className='flex-1 ' edges={['top']}>
            <Header title='Wishlist' type="account" />
            <View className="bg-white px-4   shadow-sm">

                <View className=" pt-2 pb-3">
                    <Text className="text-sm text-gray-600">
                        {filterd_data.length} {filterd_data.length === 1 ? 'Wishlist' : 'Wishlists'} found
                    </Text>
                </View>
            </View>

            {/* Product List */}
            <View className="flex-1 ">
                <FlashList
                    data={filterd_data}
                    numColumns={numColumns}
                    key={numColumns}
                    className='px-4 mt-2'
                    renderItem={({ item }) => (
                        <WishlistCard item={item} />
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing || isRefetching}
                            onRefresh={onRefresh}
                            colors={['#ED2353']}
                            tintColor='#ED2353'
                            title='Pull to refresh'
                            titleColor='#ED2353'
                        />
                    }
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                />


            </View>

        </SafeAreaView>
    )
}