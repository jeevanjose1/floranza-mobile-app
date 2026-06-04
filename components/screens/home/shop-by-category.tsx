import { useGetCatogeries } from '@/services/queries/home'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React from 'react'
import { Image, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native'

type CardProps = { title: string, image: any, slug: string, width: number }

const CategoryCard = ({ title, image, slug, width }: CardProps) => {
    const router = useRouter();

    const handlePress = () => {
        router.navigate({
            pathname: `/product-list`,
            params: { slug }
        })
    }
    
    return (
        <TouchableOpacity 
            onPress={handlePress} 
            activeOpacity={.8} 
            className="aspect-[4/5] relative overflow-hidden rounded-lg" 
            style={{ width }}
        >
            <>
                <View className='w-full h-full absolute opacity-40 z-10 overflow-hidden rounded-lg'>
                    <LinearGradient
                        colors={['black', 'transparent']}
                        start={{ x: 0.4, y: 1 }}
                        end={{ x: 0.5, y: 0 }}
                    >
                        <View className='w-full h-full' />
                    </LinearGradient>
                </View>

                {image && <Image
                    source={{ uri: image }}
                    className="w-full absolute top-0 left-0 h-full rounded-lg"
                    resizeMode="cover"
                />}
                <View className='flex items-center relative z-10 justify-end px-4 py-2 h-full'>
                    <Text className='font-bold text-white text-lg text-center font-sam-bold'>{title}</Text>
                </View>
            </>
        </TouchableOpacity>
    )
}

const ShopByCategory = () => {
    const { data: catogeries } = useGetCatogeries();
    const { width: screenWidth } = useWindowDimensions();

   
    const horizontalPadding = 32; 
    const gap = 8; 
    const cardsPerRow = 3;
    const totalGaps = (cardsPerRow - 1.5) * gap;
    const cardWidth = (screenWidth - horizontalPadding - totalGaps) / cardsPerRow;

    return (
        <View className="px-4 mb-6">
            <Text className="text-center font-sam-bold text-xl font-bold text-dark-blue mb-4">
                Shop By Category
            </Text>

            <View className="flex flex-row flex-wrap gap-2">

                {
                    catogeries?.data?.map((item: any) => {
                        return (
                            <CategoryCard 
                                slug={item?.slug} 
                                key={item?.id} 
                                title={item?.name} 
                                image={item?.images?.mini}
                                width={cardWidth}
                            />
                        )
                    })
                }
            </View>
        </View>
    )
}

export default ShopByCategory