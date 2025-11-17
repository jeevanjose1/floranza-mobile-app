import Header from '@/components/layout/header'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = {}

const Privacy = (props: Props) => {
    const handleEmail = () => {
        Linking.openURL('mailto:support@floranzafashion.com')
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
            <Header type="cart" title="Privacy Policy" />
            
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="p-4">
                    {/* Who we are */}
                    <View className="bg-white rounded-md shadow-sm p-5 mb-4">
                        <Text className="text-lg font-bold text-gray-800 mb-3">
                            Who we are
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6">
                            This privacy policy sets out how www.floranzafashion.com website/app which is owned and operated by Floranza Fashion Boutique, uses and protects any information that you give Floranza Fashion Boutique when you use this website. Floranza fashion boutique is committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this website, then you can be assured that it will only be used in accordance with this privacy statement. Floranza Fashion Boutique may change this policy from time to time by updating this page. You should check this page from time to time to ensure that you are happy with any changes.
                        </Text>
                    </View>

                    {/* What we collect */}
                    <View className="bg-white rounded-md shadow-sm p-5 mb-4">
                        <Text className="text-lg font-bold text-gray-800 mb-3">
                            What we collect:
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6 mb-2">
                            We may collect the following information:
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6">
                            • Name{'\n'}
                            • Contact information including email address{'\n'}
                            • Demographic information such as postcode, preferences, and interests{'\n'}
                            • Other information relevant to customer surveys and/or offers{'\n'}
                            • For the exhaustive list of cookies we collect see the List of cookies we collect section.
                        </Text>
                    </View>

                    {/* What we do with the information */}
                    <View className="bg-white rounded-md shadow-sm p-5 mb-4">
                        <Text className="text-lg font-bold text-gray-800 mb-3">
                            What we do with the information we gather
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6 mb-2">
                            We require this information to understand your needs and provide you with a better service, and in particular for the following reasons:
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6">
                            • Internal record keeping.{'\n'}
                            • We may use the information to improve our products and services.{'\n'}
                            • We may periodically send promotional emails about new products, special offers or other information that we think you may find interesting using the email address which you have provided.{'\n'}
                            • From time to time, we may also use your information to contact you for market research purposes. We may contact you by email, phone, fax or mail. We may use the information to customize the website according to your interests.
                        </Text>
                    </View>

                    {/* Security */}
                    <View className="bg-white rounded-md shadow-sm p-5 mb-4">
                        <Text className="text-lg font-bold text-gray-800 mb-3">
                            Security
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6">
                            We are committed to ensuring that your information is secure. In order to prevent unauthorized access or disclosure, we have put in place suitable physical, electronic and managerial procedures to safeguard and secure the information we collect online.
                        </Text>
                    </View>

                    {/* How we use cookies */}
                    <View className="bg-white rounded-md shadow-sm p-5 mb-4">
                        <Text className="text-lg font-bold text-gray-800 mb-3">
                            How we use cookies
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6 mb-3">
                            A cookie is a small file that asks permission to be placed on your computer's hard drive. Once you agree, the file is added and the cookie helps analyze web traffic or let you know when you visit a particular site. Cookies allow web applications to respond to you as an individual. The web application can tailor its operations to your needs, likes and dislikes by gathering and remembering information about your preferences.
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6 mb-3">
                            We use traffic log cookies to identify which pages are being used. This helps us analyze data about web page traffic and improve our website in order to tailor it to customer needs. We only use this information for statistical analysis purposes and then the data is removed from the system.
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6">
                            Overall, cookies help us provide you with a better website, by enabling us to monitor which pages you find useful and which you do not. A cookie in no way gives us access to your computer or any information about you, other than the data you choose to share with us. You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser settings to decline cookies if you prefer. This may prevent you from taking full advantage of the website.
                        </Text>
                    </View>

                    {/* Links to other websites */}
                    <View className="bg-white rounded-md shadow-sm p-5 mb-4">
                        <Text className="text-lg font-bold text-gray-800 mb-3">
                            Links to other websites
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6">
                            Our website may contain links to other websites of interest. However, once you have used these links to leave our site, you should note that we do not have any control over other website. Therefore, we cannot be responsible for the protection and privacy of any information which you provide whilst visiting such sites, and such sites are not governed by this privacy statement. You should exercise caution and look at the privacy statement applicable to the website in question.
                        </Text>
                    </View>

                    {/* Controlling your personal information */}
                    <View className="bg-white rounded-md shadow-sm p-5 mb-4">
                        <Text className="text-lg font-bold text-gray-800 mb-3">
                            Controlling your personal information
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6 mb-2">
                            You may choose to restrict the collection or use your personal information in the following ways:
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6 mb-3">
                            • whenever you are asked to fill in a form on the website, look for the box that you can click to indicate that you do not want the information to be used by anybody for direct marketing purposes{'\n'}
                            • if you have previously agreed to us using your personal information for direct marketing purposes, you may change your mind at any time by writing to or emailing us at support@floranzafashion.com
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6 mb-3">
                            We will not sell, distribute or lease your personal information to third parties unless we have your permission or are required by law to do so. We may use your personal information to send you promotional information about third parties which we think you may find interesting if you tell us that you wish this to happen.
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6 mb-2">
                            You may request details of personal information which we hold about you under the Data Protection Act 1998. A small fee will be payable. If you would like a copy of the information held on you please write to
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6 mb-3">
                            Floranza fashion Online{'\n'}
                            St. Mary's Shopping Complex, 1st Floor Anakkampoyil Post 673603, Kozhikode, Kerala{'\n'}
                            Phone No: 9539006690{'\n'}
                            Email: support@floranzafashion.com
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6">
                            If you believe that any information we are holding on you is incorrect or incomplete, please write to or email us as soon as possible, at the above address. We will promptly correct any information found to be incorrect.
                        </Text>
                    </View>

                    {/* List of cookies */}
                    <View className="bg-white rounded-md shadow-sm p-5 mb-4">
                        <Text className="text-lg font-bold text-gray-800 mb-3">
                            List of cookies we collect
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6 mb-3">
                            The table below lists the cookies we collect and what information they store.
                        </Text>
                        <View className="space-y-2">
                            {[
                                { name: 'CART', desc: 'The association with your shopping cart.' },
                                { name: 'CATEGORY_INFO', desc: 'Stores the category info on the page, which allows to display of pages more quickly.' },
                                { name: 'COMPARE', desc: 'The items that you have in the Compare Products list.' },
                                { name: 'CURRENCY', desc: 'Your preferred currency' },
                                { name: 'CUSTOMER', desc: 'An encrypted version of your customer id with the store.' },
                                { name: 'CUSTOMER_AUTH', desc: 'An indicator if you are currently logged into the store.' },
                                { name: 'CUSTOMER_INFO', desc: 'An encrypted version of the customer group you belong to.' },
                                { name: 'CUSTOMER_SEGMENT_IDS', desc: 'Stores the Customer Segment ID' },
                                { name: 'EXTERNAL_NO_CACHE', desc: 'A flag, which indicates whether caching is disabled or not.' },
                                { name: 'FRONTEND', desc: 'You sesssion ID on the server.' },
                                { name: 'GUEST-VIEW', desc: 'Allows guests to edit their orders.' },
                                { name: 'LAST_CATEGORY', desc: 'The last category you visited.' },
                                { name: 'LAST_PRODUCT', desc: 'The most recent product you have viewed.' },
                                { name: 'NEWMESSAGE', desc: 'Indicates whether a new message has been received.' },
                                { name: 'NO_CACHE', desc: 'Indicates whether it is allowed to use cache.' },
                                { name: 'PERSISTENT_SHOPPING_CART', desc: 'A link to information about your cart and viewing history if you have asked the site.' },
                                { name: 'POLL', desc: 'The ID of any polls you have recently voted in.' },
                                { name: 'POLLN', desc: 'Information on what polls you have voted on.' },
                                { name: 'RECENTLYCOMPARED', desc: 'The items that you have recently compared.' },
                                { name: 'STF', desc: 'Information on products you have emailed to friends.' },
                                { name: 'STORE', desc: 'The store view or language you have selected.' },
                                { name: 'USER_ALLOWED_SAVE_COOKIE', desc: 'Indicates whether a customer is allowed to use cookies.' },
                                { name: 'VIEWED_PRODUCT_IDS', desc: 'The products that you have recently viewed.' },
                                { name: 'WISHLIST', desc: 'An encrypted list of products added to your Wishlist.' },
                                { name: 'WISHLIST_CNT', desc: 'The number of items in your Wishlist.' }
                            ].map((cookie, index) => (
                                <View key={index} className="border-b border-gray-100 pb-2 mb-2">
                                    <Text className="text-sm font-semibold text-gray-800">
                                        {cookie.name}
                                    </Text>
                                    <Text className="text-xs text-gray-600 mt-1">
                                        {cookie.desc}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Consent */}
                    <View className="bg-white rounded-md shadow-sm p-5 mb-4">
                        <Text className="text-lg font-bold text-gray-800 mb-3">
                            Consent
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6">
                            By using our website (Floranza fashion boutique) you hereby consent to our privacy policy and agree to its terms.
                        </Text>
                    </View>

                    {/* Changes to this privacy policy */}
                    <View className="bg-white rounded-md shadow-sm p-5 mb-4">
                        <Text className="text-lg font-bold text-gray-800 mb-3">
                            Changes to this privacy policy
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6">
                            Floranza Fashion Boutique reserves the right to make changes to this privacy policy at any time by giving notice to its Users on this page. It is strongly recommended to check this page often, referring to the date of the last modification listed at the bottom. If a User objects to any of the changes to the Policy, the User must cease using this Website and can request us to erase the Personal Data. Unless stated otherwise, the then-current privacy policy applies to all Personal Data we have about Users
                        </Text>
                    </View>

                    {/* Update */}
                    <View className="bg-white rounded-md shadow-sm p-5 mb-4">
                        <Text className="text-lg font-bold text-gray-800 mb-3">
                            Update
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6">
                            This Privacy Policy was last updated on: Monday, January 29, 2024. Should we update, amend, or make any changes to our privacy policy, those changes will be posted here
                        </Text>
                    </View>

                    {/* Contact */}
                    <View className="bg-[#ED2353]/5 rounded-md p-5 mb-4">
                        <View className="items-center">
                            <Ionicons name="mail" size={40} color="#ED2353" />
                            <Text className="text-base font-semibold text-gray-800 mt-3 mb-2 text-center">
                                Questions or Concerns?
                            </Text>
                            <Text className="text-sm text-gray-600 text-center mb-4">
                                If you have any questions or concerns feel free to write to us
                            </Text>
                            <TouchableOpacity
                                onPress={handleEmail}
                                className="bg-[#ED2353] rounded-md px-6 py-3"
                                activeOpacity={0.8}
                            >
                                <Text className="text-white font-semibold text-sm">
                                    support@floranzafashion.com
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="h-4" />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Privacy