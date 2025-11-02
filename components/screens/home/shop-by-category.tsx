import { media } from '@/constants/medias'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

type CardProps = { title: string, image: any }

const CategoryCard = ({ title, image }: CardProps) => {
    const router = useRouter();
    
    
      const handlePress = ()=>{
       router.navigate('/product-list')
    
      }
    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={.8} className="w-[30%] flex-grow aspect-[4/5] h-full relative overflow-hidden bg-gray-100">
            <>
                <View className='w-full h-full absolute opacity-40 z-10 overflow-hidden'>
                    <LinearGradient
                        colors={['black', 'transparent']}
                        start={{ x: 0.4, y: 1 }}
                        end={{ x: 0.5, y: 0 }}
                    >
                        <View className='w-full h-full' />
                    </LinearGradient>
                </View>

                <Image
                    source={image}
                    className="w-full absolute top-0 left-0 h-full"
                    resizeMode="cover"

                />
                <View className='flex items-center relative z-10 justify-end px-4 py-2 h-full'>
                    <Text className='font-bold text-white text-lg  font-sam-bold'>{title}</Text>
                </View>
            </>
        </TouchableOpacity>
    )
}

const ShopByCategory = () => {
    const data = [
        {
            title: 'Kurties',
            image: media.kurti
        },
        {
            title: 'Bottoms',
            image: media.bottom
        },
        {
            title: 'Home wares',
            image: media.home_were
        },
        {
            title: 'Pre-Book',
            image: media.pree_book
        },
        {
            title: 'Sarees ',
            image: media.saree
        },
        {
            title: 'Dupattas',
            image: media.dupattas
        },
    ]
    return (
        <View className="px-4 mb-6">
            <Text className="text-center  font-sam-bold text-xl font-bold text-dark-blue mb-4">
                Shop By Category
            </Text>

            <View className="flex flex-row gap-2 flex-wrap justify-between">
                {
                    data.map(item => {
                        return <CategoryCard key={item.title} title={item.title} image={item.image} />
                    })
                }
            </View>
        </View>
    )
}

export default ShopByCategory