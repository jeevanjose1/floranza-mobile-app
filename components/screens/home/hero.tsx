import Button from '@/components/common/button'
import { media } from '@/constants/medias'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { Image, Text, View } from 'react-native'


const Hero = () => {
  return (
    <View className='h-64 w-full relative mb-4'>
      <View className='w-full h-full absolute opacity-80 z-10 overflow-hidden'>
        <LinearGradient
          colors={['white', 'transparent']}
          start={{ x: 0.4, y: 1 }} 
          end={{ x: 0.5, y: 0 }}
        >
          <View className='w-full h-full' />
        </LinearGradient>
      </View>

      <Image
        source={media.hero}
        className='w-full h-full absolute'
        style={{ objectFit: 'cover' }}
      />
      
      <View className='px-4 py-4 flex flex-col justify-end h-full relative z-20'>
        <Text className='font-bold text-lg  font-sam-bold text-dark-blue leading-4 '>New Season</Text>
        <Text className='font-bold text-2xl text-dark-blue  font-sam-bold  mb-2'>Discover Unique Styles</Text>
        <Button size='small' variant='primary' className='max-w-32' ><Text className=' font-sam-bold'>Explore Now</Text></Button>
      </View>
    </View>
  )
}

export default Hero