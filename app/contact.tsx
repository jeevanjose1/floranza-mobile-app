import Header from "@/components/layout/header"
import { Ionicons } from "@expo/vector-icons"
import { Linking, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function Contact() {
  const handleWhatsApp = () => {
    const phoneNumber = "919539006690" // Remove + and spaces
    const url = `whatsapp://send?phone=${phoneNumber}`
    Linking.openURL(url).catch(() => {
      // If WhatsApp is not installed, open in browser
      Linking.openURL(`https://wa.me/${phoneNumber}`)
    })
  }

  const handleEmail = () => {
    const email = "support@floranzafashion.com"
    const url = `mailto:${email}`
    Linking.openURL(url)
  }

  const handleAddress = () => {
    const address = "Floranza fashion Online St. Mary's Shopping Complex, 1st Floor Anakkampoyil Post 673603 Kozhikode, Kerala"
    const url = `https://maps.google.com/?q=${encodeURIComponent(address)}`
    Linking.openURL(url)
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <Header type="cart" title="Contact Us" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="p-4">
          {/* Header Section */}
          <View className="bg-white rounded-md shadow-sm p-6 mb-4">
            <Text className="text-2xl font-bold text-gray-800 mb-3">
              We'd love to hear from you
            </Text>
            <Text className="text-base text-gray-600 leading-6">
              We love to hear from you on our customer service, merchandise, website or any topics you want to share with us. Your comments and suggestions will be appreciated.
            </Text>
          </View>

          {/* Contact Information Title */}
          <Text className="text-xs font-semibold text-gray-500 uppercase mb-2 px-1 tracking-wider">
            Contact Information
          </Text>

          {/* Address Card */}
          <TouchableOpacity
            onPress={handleAddress}
            className="bg-white rounded-md shadow-sm p-4 mb-3"
            activeOpacity={0.7}
          >
            <View className="flex-row items-start">
              <View className="w-12 h-12 bg-[#ED2353]/10 rounded-full items-center justify-center mr-4">
                <Ionicons name="location" size={24} color="#ED2353" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-800 mb-2">
                  Address
                </Text>
                <Text className="text-sm text-gray-600 leading-5">
                  Floranza fashion Online{'\n'}
                  St. Mary's Shopping Complex, 1st Floor{'\n'}
                  Anakkampoyil Post 673603{'\n'}
                  Kozhikode, Kerala
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>
          </TouchableOpacity>

          {/* Phone Card */}
          <TouchableOpacity
            onPress={handleWhatsApp}
            className="bg-white rounded-md shadow-sm p-4 mb-3"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-[#25D366]/10 rounded-full items-center justify-center mr-4">
                <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-800 mb-1">
                  Phone
                </Text>
                <Text className="text-sm text-gray-600">
                  +91 9539006690
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>
          </TouchableOpacity>

          {/* Email Card */}
          <TouchableOpacity
            onPress={handleEmail}
            className="bg-white rounded-md shadow-sm p-4 mb-3"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-[#ED2353]/10 rounded-full items-center justify-center mr-4">
                <Ionicons name="mail" size={24} color="#ED2353" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-800 mb-1">
                  Email
                </Text>
                <Text className="text-sm text-gray-600">
                  support@floranzafashion.com
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>
          </TouchableOpacity>

          {/* Hours Card */}
          <View className="bg-white rounded-md shadow-sm p-4 mb-3">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-[#ED2353]/10 rounded-full items-center justify-center mr-4">
                <Ionicons name="time" size={24} color="#ED2353" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-800 mb-1">
                  Hours
                </Text>
                <Text className="text-sm text-gray-600">
                  Everyday 9:00 AM – 8:00 PM
                </Text>
              </View>
            </View>
          </View>

          {/* Social Media or Additional Info */}
          <View className="bg-[#ED2353]/5 rounded-md p-4 mt-2">
            <View className="items-center">
              <Ionicons name="chatbubbles" size={40} color="#ED2353" />
              <Text className="text-base font-semibold text-gray-800 mt-3 mb-1">
                Quick Response
              </Text>
              <Text className="text-sm text-gray-600 text-center">
                For faster support, reach us on WhatsApp
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}