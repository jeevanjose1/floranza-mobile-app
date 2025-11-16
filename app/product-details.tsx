import QuantitySelector from '@/components/common/quandity-selector'
import Header from '@/components/layout/header'
import ImageSection from '@/components/screens/product-details/image-section'
import SimilarProducts from '@/components/screens/product-details/similar-products'
import { useAuthenticated } from '@/hooks/useAutheticated'
import { calculate_discount, calculate_product_price } from '@/lib/utils'
import { useAddToCart, useOutOfStock } from '@/services/queries/cart'
import { useAddWishlist, useGetProductDetails } from '@/services/queries/product'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import RenderHtml from 'react-native-render-html'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
type Props = {}

const ProductDetails = (props: Props) => {
    const { slug } = useLocalSearchParams()
    const router = useRouter()

    const { width } = useWindowDimensions()
    const accordionRefs = useRef<{ [key: string]: View | null }>({})
    const [selectedSize, setSelectedSize] = useState<any>()
    const [quantity, setQuantity] = useState<number>(1)
    const [expandedAccordion, setExpandedAccordion] = useState<string | null>(null)
    const { mutateAsync: check, data } = useOutOfStock();
    const { mutateAsync: add, isPending } = useAddToCart();
    const { mutateAsync: add_wishlist, isPending: wishlistPending } = useAddWishlist()
    const { isAuthenticated, gToken } = useAuthenticated();

    const {
        data: product_details,
        isLoading,
        error,
    } = useGetProductDetails(slug) as any;


    const product = product_details?.data?.product;
    const catogery = product_details?.data?.category;
    const related = product_details?.data?.relatedProducts;
    const [variationIndex, setVariationIndex] = useState<any>(null);


    const filterd_data = related?.map((item: any) => {
        return {
            id: item?.id,
            title: item?.name,
            price: calculate_product_price(item),
            image: item?.images?.large,
            variations: item?.variations,
            slug: item?.slug,
            is_pre_order: item?.is_pre_order,
            is_new_product: item?.is_new_product
        };
    });
    const stocks = Boolean(product?.qty) ? product?.qty : data?.data?.qty

    useEffect(() => {
        if (selectedSize) {
            const form_data = new FormData();
            form_data.append("product_id", product?.id);
            form_data.append("prd_var_value_id", selectedSize?.id);
            check(form_data, {
                onSuccess: (response) => {
                    if (!response?.data?.is_unlimited_qty && response?.data?.qty === 0) {
                        Toast.show({
                            type: 'error',
                            text1: 'Out of stock',
                        });
                        setSelectedSize(null);
                    }
                },
            });
        }
    }, [selectedSize]);



    const price = calculate_product_price(product, variationIndex)
    const discount = calculate_discount(product?.price?.min, product?.price?.max)

    const sizes = product?.variations

    const handleQuantityChange = (newQuantity: number) => {
        setQuantity(newQuantity)
    }

    const toggleAccordion = (section: string) => {
        const newExpandedState = expandedAccordion === section ? null : section
        setExpandedAccordion(newExpandedState)
    }


    const handleHandleSelectVariation = (size: any, index: number) => {
        if (selectedSize?.id === size.id) {
            setSelectedSize(null);
            return;
        }
        setQuantity(1)
        setVariationIndex(index);
        setSelectedSize(size);
    }

    const handleAddToCart = () => {
        if (!selectedSize && product?.variations?.length > 0) {
            Toast.show({
                type: 'info',
                text1: 'Please select a size first',
            });
            return;
        }

        if (quantity < 1) {
            Toast.show({
                type: 'info',
                text1: 'Please select quantity',
            });
            return;
        }

        const form_data = new FormData();
        form_data.append("guest_token", gToken as string);
        form_data.append("product_id", product.id);
        if (product?.variations?.length) {
            form_data.append("prd_var_value_id", selectedSize?.id);
        }

        form_data.append("qty", quantity.toString());
        add(form_data, {
            onSuccess: () => {
                Toast.show({
                    type: 'success',
                    text1: 'Product added to cart',
                });
            },
            onError: (error: any) => {
                Toast.show({
                    type: 'info',
                    text1: error.data.message,
                })

            }
        });
    };

    const handleBuyNow = () => {
        // First add to cart then redirect
        if (!selectedSize && product?.variations?.length > 0) {
            Toast.show({
                type: 'info',
                text1: 'Please select a size first',
            });
            return;
        }

        if (quantity < 1) {
            Toast.show({
                type: 'info',
                text1: 'Please select quantity',
            });
            return;
        }

        // Add to cart then redirect to checkout
        const form_data = new FormData();
        form_data.append("guest_token", gToken as string);
        form_data.append("product_id", product.id);
        if (product?.variations?.length) {
            form_data.append("prd_var_value_id", selectedSize?.id);
        }
        form_data.append("qty", quantity.toString());

        add(form_data, {
            onSuccess: () => {
                // Redirect to checkout
                // window.location.href = "/checkout";
            },
        });
    };


    const handleWishList = () => {
        if (isAuthenticated) {
            add_wishlist({
                product_id: product.id
            }, {
                onSuccess: (response) => {
                    Toast.show({
                        type: 'success',
                        text1: response?.message,
                    });

                },
                onError: (error) => {

                    Toast.show({
                        type: 'error',
                        text1: error?.message,
                    });
                }
            })
        } else {
            router.push('/login')
        }

    }

    const is_unlimited_qty = product?.data?.is_unlimited_qty


    const accordionData = [
        {
            id: 'description',
            title: 'Description',
            isHtml: true,
            content: product?.description
        },
        {
            id: 'important',
            title: 'Important Info',
            isHtml: true,
            content: product?.important_info
        },
        {
            id: 'shipping',
            title: 'Shipping Info',
            isHtml: false,
            content: product?.shipping_delivery
        }
    ]

    const tagsStyles = {
        p: {
            marginVertical: 4,
            fontSize: 14,
            lineHeight: 20,
            color: '#374151',
        },
        ul: {
            marginLeft: 20,
            marginVertical: 8,
        },
        li: {
            marginVertical: 2,
            fontSize: 14,
            lineHeight: 20,
            color: '#374151',
        },
        strong: {
            fontWeight: 'bold',
            color: '#111827',
        },
        div: {
            marginBottom: 0,
        },
        span: {
            fontSize: 14,
            color: '#374151',
        }
    }

    return (
        <SafeAreaView className='flex-1 ' edges={['bottom', 'top']}>
            <Header title={false} type='product_details' />

            <ScrollView className='flex-1 '>
                <View className=' bg-white  mb-2'>
                    <ImageSection data={product?.images} />

                    {/* Product Title & Favorite */}



                    <View className='flex-row px-4  items-start w-full justify-between mb-1'>
                        <Text numberOfLines={2} className='font-sam-bold max-w-[90%] text-lg'>
                            {product?.name}
                        </Text>
                        <TouchableOpacity onPress={handleWishList} className='pt-1'>
                            <Ionicons name='heart-outline' size={24} color="#374151" />
                        </TouchableOpacity>
                    </View>

                    <Text className="font-sam-regular px-4 text-gray-500 text-[14px] mb-2">
                        {catogery?.name}
                    </Text>

                    <View className="flex-row px-4 items-center mb-4">
                        <Text className="font-sam-bold text-primary text-2xl mr-4">
                            {`₹${String(price.min)}`}
                        </Text>
                        {price.max ? <Text className="font-sam-medium text-gray-400 text-[14px] line-through mr-2">
                            {`₹${String(price.max)}`}
                        </Text> : null}
                        {discount ? <View className='bg-green-100 px-2 py-1 rounded'>
                            <Text className='font-sam-medium text-green-700 text-xs'>{String(discount)}% OFF</Text>
                        </View> : null}
                    </View>

                    {/* Size Selector */}
                    {product?.is_variation && <View className=" mb-4 px-4 ">
                        <View className='flex-row justify-between items-center mb-3'>
                            <Text className="font-sam-medium text-base">
                                Select Size
                            </Text>
                            <TouchableOpacity>
                                <Text className='text-sm text-primary font-sam-medium'>
                                    Size Guide
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View className='flex-row flex-wrap gap-2'>
                            {sizes.map((size: any, index: any) => (
                                <View key={size.id} className='relative'>
                                    <TouchableOpacity

                                        onPress={() => handleHandleSelectVariation(size, index)}
                                        disabled={!size.qty && Boolean(!size?.is_unlimited_qty)}
                                        className={` rounded-lg border min-w-min relative z-10 items-center ${selectedSize === size
                                            ? 'border-primary bg-primary/5'
                                            : 'border-gray-300 bg-white'
                                            }`}
                                    >
                                        <View className="relative">
                                            {!size.qty && Boolean(!size?.is_unlimited_qty) && (
                                                <View className="absolute inset-0 items-center justify-center">
                                                    <View className="absolute h-[1px] w-8 bg-primary" style={{ transform: [{ rotate: '45deg' }] }} />
                                                    <View className="absolute h-[1px] w-8 bg-primary" style={{ transform: [{ rotate: '-45deg' }] }} />
                                                </View>
                                            )}
                                            <Text
                                                className={`font-sam-medium px-5 py-2 ${selectedSize === size ? 'text-primary' : 'text-gray-700'
                                                    } ${!size.qty && Boolean(!size?.is_unlimited_qty) ? 'opacity-50' : ''}`}
                                            >
                                                {size.attribute_option_name}
                                                {size?.option_title && <Text> - {size?.option_title}</Text>}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>

                                </View>


                            ))}
                            {selectedSize && !data?.data?.is_unlimited_qty &&
                                (data?.data?.qty > 4 ? <View className=' h-10    flex items-center flex-row gap-2 justify-center -bottom-9   rounded-md '>
                                    <View className='w-3 h-3 rounded-full bg-green-500' />
                                    <Text className='text-[13px] text-primary'>{data?.data?.qty} Stock Available</Text>
                                </View>
                                    :
                                    <View className=' h-10    flex items-center flex-row gap-2 justify-center -bottom-9   rounded-md '>
                                        <View className='w-3 h-3 rounded-full bg-red-500' />
                                        <Text className='text-[13px] text-primary'>Only {data?.data?.qty} stocks left!</Text>
                                    </View>)
                            }
                        </View>

                    </View>
                    }
                    {/* Quantity Selector */}
                    <View className="mb-4 px-4 ">
                        <QuantitySelector
                            quantity={quantity}
                            onQuantityChange={handleQuantityChange}
                            minQuantity={1}
                            maxQuantity={is_unlimited_qty ? 10000 : stocks}
                            showLabel={true}

                        />
                    </View>
                </View>
                <View className='p-4 bg-white  mb-2'>
                    <Text className="font-sam-bold text-base mb-3">
                        Product Details
                    </Text>

                    {/* Accordion Sections */}
                    <View >
                        {accordionData.map((item) => (
                            <View
                                key={item.id}
                                className='mb-2'
                                ref={(ref) => accordionRefs.current[item.id] = ref as any}
                                collapsable={false}
                            >
                                <TouchableOpacity
                                    onPress={() => toggleAccordion(item.id)}
                                    className='bg-white rounded-lg p-4 flex-row justify-between items-center border border-gray-200'
                                >
                                    <Text className='font-sam-medium text-sm'>
                                        {item.title}
                                    </Text>
                                    <Ionicons
                                        name={expandedAccordion === item.id ? 'chevron-up' : 'chevron-down'}
                                        size={20}
                                        color="#374151"
                                    />
                                </TouchableOpacity>

                                {expandedAccordion === item.id && (
                                    <View className='bg-gray-50 px-4 py-3 border-x border-b border-gray-200 rounded-b-lg'>
                                        {item.isHtml ? (
                                            <RenderHtml
                                                contentWidth={width - 64}
                                                source={{ html: item.content }}
                                                tagsStyles={tagsStyles as any}
                                            />
                                        ) : (
                                            <Text className='font-sam-regular text-sm text-gray-700 leading-6'>
                                                {item.content}
                                            </Text>
                                        )}
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                </View>
                <View className='p-4 bg-white  '>

                    <SimilarProducts data={filterd_data} />
                </View>
            </ScrollView>

            {/* Bottom Action Buttons */}
            <View className='px-4 h-20 py-4 w-full items-center bg-white gap-4 flex-row justify-center border-t border-gray-200'>
                <TouchableOpacity onPress={handleAddToCart} className='flex-1 h-full px-6 items-center justify-center bg-primary rounded-lg'>
                    <Text className='color-white font-sam-medium font-semibold'>ADD TO CART</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleBuyNow} className='flex-1 h-full px-6 items-center justify-center border-2 border-primary rounded-lg'>
                    <Text className='color-primary font-sam-medium font-semibold'>BUY NOW</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default ProductDetails