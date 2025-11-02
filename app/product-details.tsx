import QuantitySelector from '@/components/common/quandity-selector'
import Header from '@/components/layout/header'
import ImageSection from '@/components/screens/product-details/image-section'
import SimilarProducts from '@/components/screens/product-details/similar-products'
import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import RenderHtml from 'react-native-render-html'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = {}

const ProductDetails = (props: Props) => {
    const { width } = useWindowDimensions()
    const [selectedSize, setSelectedSize] = useState<string>('M')
    const [quantity, setQuantity] = useState<number>(1)
    const [expandedAccordion, setExpandedAccordion] = useState<string | null>(null)

    const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']

    const handleQuantityChange = (newQuantity: number) => {
        setQuantity(newQuantity)
    }

    const toggleAccordion = (section: string) => {
        setExpandedAccordion(expandedAccordion === section ? null : section)
    }

    const accordionData = [
        {
            id: 'description',
            title: 'Description',
            isHtml: true,
            content: `<div class="text-sm font-medium text-muted-foreground/70 mb-5"><p class="my-1" dir="ltr"><span data-lexical-text="true">Co-ord set in 2 tone rayon fabric</span></p><p class="my-1" dir="ltr"><span data-lexical-text="true">Top</span></p><ul class="list-disc ml-6 my-2"><li value="1" dir="ltr"><span data-lexical-text="true">Slit top</span></li><li value="2" dir="ltr"><span data-lexical-text="true">With cotton Lining</span></li><li value="3" dir="ltr"><span data-lexical-text="true">Length 46 inches</span></li></ul><p class="my-1" dir="ltr"><span data-lexical-text="true">Bottom</span></p><ul class="list-disc ml-6 my-2"><li value="1" dir="ltr"><span data-lexical-text="true">Loose fit with full elastic waist band</span></li><li value="2" dir="ltr"><span data-lexical-text="true">Length 38 inches</span></li></ul><p class="my-1"><br></p><p class="my-1" dir="ltr"><strong class="font-bold" data-lexical-text="true">Product Code: 3081D</strong></p><p class="my-1"><br></p></div>

<p style="margin-top: 12px; margin-bottom: 4px;"><strong>Please Note:</strong></p>
<ul style="margin-left: 20px; margin-bottom: 12px;">
<li style="margin-bottom: 4px;">Actual product color may vary slightly due to photographic lighting sources or your mobile/monitor display settings.</li>
<li style="margin-bottom: 4px;">Refer to the size chart before placing the order. (there will be no return for size issues)</li>
<li style="margin-bottom: 4px;">After receiving the products if there are any complaints, inform us within 24 hours.</li>
<li style="margin-bottom: 4px;">We accept cancellations made within 2 hours of placing the order. Please reach out to our customer care service.</li>
<li style="margin-bottom: 4px;">Opening video of the package received is mandatory for an exchange or refund.</li>
<li style="margin-bottom: 4px;">Proof of purchase – invoice is compulsory.</li>
</ul>

<p style="margin-top: 12px; margin-bottom: 4px;"><strong>Wash Care:</strong></p>
<ul style="margin-left: 20px;">
<li>Wash separately in cold water</li>
</ul>`
        },
        {
            id: 'important',
            title: 'Important Info',
            isHtml: false,
            content: `• Care Instructions: Gentle hand wash or dry clean
• Material: Premium rayon fabric with cotton lining
• Color may vary slightly due to lighting
• Model wearing size M
• Made in India with love`
        },
        {
            id: 'shipping',
            title: 'Shipping Info',
            isHtml: false,
            content: `• Free shipping on orders above ₹999
• Delivery in 5-7 business days
• Easy 7-day returns & exchanges
• Cash on delivery available
• Track your order in real-time`
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
                  <View className='p-4 bg-white  mb-2'>
                <ImageSection />

                {/* Product Title & Favorite */}
              


                    <View className='flex-row  items-start w-full justify-between mb-1'>
                        <Text numberOfLines={2} className='font-sam-bold max-w-[90%] text-lg'>
                            Florista Kurti in Fox Georgette - Off-White
                        </Text>
                        <TouchableOpacity className='pt-1'>
                            <Ionicons name='heart-outline' size={24} color="#374151" />
                        </TouchableOpacity>
                    </View>

                    {/* Category */}
                    <Text className="font-sam-regular  text-gray-500 text-[14px] mb-2">
                        Kurti
                    </Text>

                    {/* Price */}
                    <View className="flex-row  items-center mb-4">
                        <Text className="font-sam-bold text-primary text-2xl mr-4">
                            ₹800
                        </Text>
                        <Text className="font-sam-medium text-gray-400 text-[14px] line-through mr-2">
                            ₹1000
                        </Text>
                        <View className='bg-green-100 px-2 py-1 rounded'>
                            <Text className='font-sam-medium text-green-700 text-xs'>20% OFF</Text>
                        </View>
                    </View>

                    {/* Size Selector */}
                    <View className=" mb-4">
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
                            {sizes.map((size) => (
                                <TouchableOpacity
                                    key={size}
                                    onPress={() => setSelectedSize(size)}
                                    className={`px-4 py-3 rounded-lg border-2 min-w-min items-center ${selectedSize === size
                                        ? 'border-primary bg-primary/5'
                                        : 'border-gray-300 bg-white'
                                        }`}
                                >
                                    <Text className={`font-sam-medium ${selectedSize === size
                                        ? 'text-primary'
                                        : 'text-gray-700'
                                        }`}>
                                        {size}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Quantity Selector */}
                    <View className="mb-4">
                        <QuantitySelector
                            quantity={quantity}
                            onQuantityChange={handleQuantityChange}
                            minQuantity={1}
                            maxQuantity={99}
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
                            <View key={item.id} className='mb-2'>
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

                    <SimilarProducts />
                </View>
            </ScrollView>

            {/* Bottom Action Buttons */}
            <View className='px-4 h-20 py-4 w-full items-center bg-white gap-4 flex-row justify-center border-t border-gray-200'>
                <TouchableOpacity className='flex-1 h-full px-6 items-center justify-center bg-primary rounded-lg'>
                    <Text className='color-white font-sam-medium font-semibold'>ADD TO CART</Text>
                </TouchableOpacity>
                <TouchableOpacity className='flex-1 h-full px-6 items-center justify-center border-2 border-primary rounded-lg'>
                    <Text className='color-primary font-sam-medium font-semibold'>BUY NOW</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default ProductDetails