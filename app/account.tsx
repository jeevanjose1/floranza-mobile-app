import Header from '@/components/layout/header'
import { useAuthenticated } from '@/hooks/useAutheticated'
import useBreakPoints from '@/hooks/useBreajpoints'
import { useAccountDetails } from '@/services/queries/account'
import { useLogout } from '@/services/queries/auth'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { RelativePathString, useRouter } from 'expo-router'
import React from 'react'
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'



const Account = () => {
  const {isAuthenticated} = useAuthenticated()

  const { mutateAsync: logout } = useLogout()
      const { data: user_data } = useAccountDetails(isAuthenticated)
  const handleLogout = () => {
    logout().then( async() => {
      try {
        await AsyncStorage.multiRemove(['floranza-t-value'])
        router.replace('/login');
      } catch (error) {
        
      }
    })
  }
 

  const router = useRouter();



  const menuSections = [
    {
      title: "Orders & Shopping",
      items: [
        { icon: "cube-outline", path:'/my-orders', label: "My Orders", badge: "3", color: "#ED2353" },
        { icon: "heart-outline",  path:'/wishlist', label: "Wishlist", badge: "12", color: "#ED2353" },
        { icon: "basket-outline",  path:'/tracking', label: "Track Yout Order", badge: "12", color: "#ED2353" },

      ]
    },
    {
      title: "Account Settings",
      items: [
        { icon: "person-outline",   path:'/edit-profile',label: "Edit Profile", color: "#ED2353" },
        { icon: "location-outline",   path:'/saved-address',label: "Saved Addresses", color: "#ED2353" },
        { icon: "help-buoy-outline",   path:'/help-and-support',label: "Help And Support", color: "#ED2353" },

      ]
    },

  ]

  const getInitials = (name: string) => {
    return name?.split(' ')?.map(n => n[0])?.join('')
  }
  const { isWidth } = useBreakPoints({ breakPoint: 375 });

  const handleGotoMenu = (path:RelativePathString)=>{
    router.push(path)
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header type='account' />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 py-8 rounded-b-3xl">
          <View className="flex-col justify-center items-center">
            <View className="w-16 h-16 bg-black/10 rounded-full items-center justify-center">
              <Text className={` ${isWidth ? 'text-lg' : 'text-2xl'} font-bold text-black`}>
                {getInitials(user_data?.data?.username)}
              </Text>
            </View>
            <View className=" items-center">
              <Text className={`${isWidth ? 'text-base' : 'text-xl'} font-bold text-black mb-1`}>
                {user_data?.data?.username}
              </Text>
              <Text className=" text-black">
               {user_data?.data?.email}
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
                    onPress={()=>handleGotoMenu(item.path as RelativePathString)}
                    key={itemIdx}
                    className={`flex-row items-center justify-between p-4 ${itemIdx !== section.items.length - 1 ? 'border-b border-gray-100' : ''
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
            onPress={handleLogout}
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