import Header from '@/components/layout/header'
import { Ionicons } from '@expo/vector-icons'
import { RelativePathString, useRouter } from 'expo-router'
import React from 'react'
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = {}

const HelpAndSupport = (props: Props) => {
  const router = useRouter()

  const handleMenuPress = (path: string) => {
    // Navigate to respective pages
    router.push(path as RelativePathString)
  }

  const menuSections = [
    {
      title: "Information",
      items: [
        { 
          icon: "information-circle-outline", 
          path: '/about', 
          label: "About Us", 
          color: "#ED2353" 
        },
        { 
          icon: "call-outline", 
          path: '/contact', 
          label: "Contact Us", 
          color: "#ED2353" 
        },
      ]
    },
    {
      title: "Policies",
      items: [
        { 
          icon: "shield-checkmark-outline", 
          path: '/privacy', 
          label: "Privacy Policy", 
          color: "#ED2353" 
        },
        { 
          icon: "document-text-outline", 
          path: '/terms', 
          label: "Terms & Conditions", 
          color: "#ED2353" 
        },
      ]
    },
    {
      title: "Shopping Help",
      items: [
        { 
          icon: "return-down-back-outline", 
          path: '/return', 
          label: "Returns & Exchange", 
          color: "#ED2353" 
        },
        { 
          icon: "cube-outline", 
          path: '/shipping', 
          label: "Shipping & Delivery", 
          color: "#ED2353" 
        },
      ]
    },
  ]

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <Header type="cart" title="Help And Support" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="p-4">
          {menuSections.map((section, idx) => (
            <View key={idx} className="mb-4">
              <Text className="text-xs font-semibold text-gray-500 uppercase mb-2 px-1 tracking-wider">
                {section.title}
              </Text>
              <View className="bg-white rounded-md shadow-sm overflow-hidden">
                {section.items.map((item, itemIdx) => (
                  <TouchableOpacity
                    onPress={() => handleMenuPress(item.path)}
                    key={itemIdx}
                    className={`flex-row items-center justify-between p-4 ${
                      itemIdx !== section.items.length - 1 
                        ? 'border-b border-gray-100' 
                        : ''
                    }`}
                    activeOpacity={0.7}
                  >
                    <View className="flex-row items-center">
                      <Ionicons 
                        name={item.icon as any} 
                        size={22} 
                        color={item.color} 
                      />
                      <Text className="text-base font-medium text-gray-800 ml-3">
                        {item.label}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Ionicons 
                        name="chevron-forward" 
                        size={20} 
                        color="#9CA3AF" 
                      />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          {/* Need More Help Section */}
          <View className="bg-white rounded-md shadow-sm p-4 mt-2">
            <View className="items-center">
              <Ionicons name="help-circle-outline" size={48} color="#ED2353" />
              <Text className="text-lg font-semibold text-gray-800 mt-3 mb-1">
                Need More Help?
              </Text>
              <Text className="text-sm text-gray-500 text-center mb-4">
                Our support team is here to assist you
              </Text>
              <TouchableOpacity
                onPress={() => handleMenuPress('/contact')}
                className="bg-[#ED2353] rounded-md px-6 py-3"
                activeOpacity={0.8}
              >
                <Text className="text-white font-semibold text-base">
                  Contact Support
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* App Version */}
          <Text className="text-center py-4 text-gray-400 text-sm">
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default HelpAndSupport