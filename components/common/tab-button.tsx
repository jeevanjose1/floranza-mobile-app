import useBreakPoints from '@/hooks/useBreajpoints';
import Feather from '@expo/vector-icons/Feather';
import { Href, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

type Props = {
  icon: string | any
  title: string
  path?: Href
  isActive?: Boolean
  onPress?: any
}

export default function TabButton({ icon, title, path, isActive, onPress = false }: Props) {
  const router = useRouter();
  const { isWidth } = useBreakPoints({breakPoint:375});

  const iconSize = isWidth ? 18 : 20;
  const iconContainerSize = isWidth ? 36 : 40;
  const textSize = isWidth ? 10 : 13;

  const handlePress = () => {
    router.push(path || '/(tabs)')
  }

  return (
    <Pressable 
      className='flex h-full justify-center flex-1 max-w-[100px]' 
      onPress={onPress || handlePress}
    >
      <View className='flex items-center  justify-between'>
        <View 
          className={`${isActive ? 'bg-primary/70' : 'bg-transparent'}  items-center justify-center rounded-[10px] overflow-hidden`}
          style={{ 
            width: iconContainerSize, 
            height: iconContainerSize 
          }}
        >
          <Feather 
            name={icon} 
            color={isActive ? 'white' : 'black'} 
            size={iconSize} 
          />
        </View>

        <Text 
          className={`${isActive ? 'text-primary font-semibold' : 'font-normal text-black/40'}`}
          style={{ fontSize: textSize }}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {title}
        </Text>
      </View>
    </Pressable>
  )
}