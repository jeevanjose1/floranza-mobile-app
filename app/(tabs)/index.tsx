import Header from '@/components/layout/header';
import Hero from '@/components/screens/home/hero';
import LatestProducts from '@/components/screens/home/latest-products';
import MostSellingProducts from '@/components/screens/home/most-selling-products';
import ShopByCategory from '@/components/screens/home/shop-by-category';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function HomeScreen() {
  return (
    <SafeAreaView className='flex-1 bg-gray-50' edges={['top']}>
      <Header gradiant/>
      <ScrollView className='h-full' contentContainerStyle={{ flexGrow: 1 }}>
        
        <Hero/>
        <ShopByCategory/>
        <LatestProducts/>
        <MostSellingProducts/>
      </ScrollView>
    </SafeAreaView>
  );
}