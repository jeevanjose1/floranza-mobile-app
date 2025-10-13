import { media } from '@/constants/medias';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

type Props = {}

const Header = (props: Props) => {
  const router = useRouter()

  const handlePressSearch = () => {
    router.push('/search')
  }


  return (
    <View className='px-4  z-10 flex flex-row justify-between items-center'>
      <LinearGradient
        colors={['#ED23534a', '#ED23532a', '#0000', 'transparent']}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '-100%',
          height: 150, // Adjust this to cover StatusBar + Header
          zIndex: 0,
        }}
      />
      <Image source={media.logo} resizeMode='contain' className='w-32 h-20  ' />
      <View className='flex flex-row items-center gap-4'>
        <TouchableOpacity onPress={handlePressSearch}>
          <Ionicons name="search-outline" size={24} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="bag-outline" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Header