import Header from '@/components/layout/header'
import useBreakPoints from '@/hooks/useBreajpoints'
import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'



const Account = () => {
  const [user] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210"
  })

  const menuSections = [
    {
      title: "Orders & Shopping",
      items: [
        { icon: "cube-outline", label: "My Orders", badge: "3", color: "#ED2353" },
        { icon: "heart-outline", label: "Wishlist", badge: "12", color: "#ED2353" },
      ]
    },
    {
      title: "Account Settings",
      items: [
        { icon: "person-outline", label: "Edit Profile", color: "#ED2353" },
        { icon: "location-outline", label: "Saved Addresses", color: "#ED2353" },
        { icon: "notifications-outline", label: "Notifications", color: "#ED2353" }
      ]
    },
    {
      title: "Support",
      items: [
        { icon: "help-circle-outline", label: "Help Center", color: "#ED2353" },
        { icon: "settings-outline", label: "Settings", color: "#ED2353" }
      ]
    }
  ]

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('')
  }
  const { isWidth } = useBreakPoints({breakPoint:375});

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header type='account'/>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 py-8 rounded-b-3xl">
          <View className="flex-col justify-center items-center">
            <View className="w-16 h-16 bg-black/10 rounded-full items-center justify-center">
              <Text className={` ${isWidth ? 'text-lg' : 'text-2xl'} font-bold text-black`}>
                {getInitials(user.name)}
              </Text>
            </View>
            <View className=" items-center">
              <Text className={ `${isWidth ? 'text-base' : 'text-xl'} font-bold text-black mb-1`}>
                {user.name}
              </Text>
              <Text className=" text-black">
                {user.email}
              </Text>
              <Text className=" text-black">
                {user.phone}
              </Text>
            </View>
          </View>
        </View>

        {/* Menu Sections */}
        <View className="p-4">
          {menuSections.map((section, idx) => (
            <View key={idx} className="mb-4">
              <Text className="text-xs font-semibold text-gray-500 uppercase mb-2 px-1 tracking-wider">
                {section.title}
              </Text>
              <View className="bg-white rounded-md shadow-sm overflow-hidden">
                {section.items.map((item, itemIdx) => (
                  <TouchableOpacity
                    key={itemIdx}
                    className={`flex-row items-center justify-between p-4 ${
                      itemIdx !== section.items.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                    activeOpacity={0.7}
                  >
                    <View className="flex-row items-center">
                      <Ionicons name={item.icon as any} size={22} color={item.color} />
                      <Text className="text-base font-medium text-gray-800 ml-3">
                        {item.label}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      
                      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          {/* Logout Button */}
          <TouchableOpacity 
            className="bg-white rounded-md shadow-sm p-4 flex-row items-center justify-center mt-2"
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={22} color="#EF4444" />
            <Text className="text-base font-semibold text-red-600 ml-2">
              Logout
            </Text>
          </TouchableOpacity>

          {/* App Version */}
          <Text className="text-center py-4 text-gray-400 text-sm">
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Account