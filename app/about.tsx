import Header from '@/components/layout/header'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = {}

const About = (props: Props) => {
  
    
  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <Header type="cart" title="About Us" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="p-4">
          {/* Hero Section */}
          <View className="bg-gradient-to-br bg-[#ED2353] rounded-md shadow-sm p-6 mb-4">
            <View className="items-center">
              <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center mb-4">
                <Ionicons name="storefront" size={40} color="#FFFFFF" />
              </View>
              <Text className="text-3xl font-bold text-white mb-2 text-center">
                Floranza Fashion Boutique
              </Text>
              <Text className="text-lg text-white/90 italic text-center">
                Where passion meets fashion.
              </Text>
            </View>
          </View>

          {/* Story Section */}
          <View className="bg-white rounded-md shadow-sm p-6 mb-4">
            <Text className="text-xl font-bold text-gray-800 mb-4">
              Our Story
            </Text>
            <Text className="text-base text-gray-600 leading-6 mb-4">
              Floranza Fashion Boutique is a complete ladies fashion store located in Thiruvambady, Calicut, Kerala. Floranza is owned by young entrepreneur <Text className="font-semibold text-gray-800">Linda Vineeth</Text>, who left her high-paying government nursing job in Qatar to pursue her passion.
            </Text>
            <Text className="text-base text-gray-600 leading-6 mb-4">
              At Floranza, you'll discover carefully curated, high-quality, and on-trend dresses at affordable prices. Our goal is to bring fashionable clothing that resonates with the modern Indian woman—without breaking the bank.
            </Text>
            <Text className="text-base text-gray-600 leading-6">
              Today, Floranza Fashion is one of Kerala's most loved online fashion stores, with fresh styles being added to our collections every single day!
            </Text>
          </View>

         
         
         

          {/* Bottom Spacing */}
          <View className="h-4" />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default About