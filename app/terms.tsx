import Header from '@/components/layout/header'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = {}

const Terms = (props: Props) => {
    const handleEmail = () => {
        Linking.openURL('mailto:floranzafashiontdy@gmail.com')
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
            <Header type="cart" title="Terms And Condition" />
            
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="p-4">
                    {/* Introduction */}
                    <View className="bg-white rounded-md shadow-sm p-5 mb-4">
                        <Text className="text-lg font-bold text-gray-800 mb-3">
                            Introduction
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6">
                            This website www.floranzafashion.com is owned and operated by Floranza Fashion Boutique. The terms "we", "us", and "our" refer to floranzafashion.com. The use of our website is subject to the following terms and conditions of use, as amended from time to time (the "Terms"). The Terms are to be read together by you with any terms, conditions, or disclaimers provided in the pages of our website. Please review the Terms carefully. The Terms apply to all users of our website, including without limitation, users who are browsers, customers, merchants, vendors and/or contributors of content. If you access and use this website, you accept and agree to be bound by and comply with the Terms and our Privacy Policy. If you do not agree to the Terms or our Privacy Policy, you are not authorized to access our website, use any of our website's services or place an order on our website.
                        </Text>
                    </View>

                    {/* Use of our Website */}
                    <View className="bg-white rounded-md shadow-sm p-5 mb-4">
                        <Text className="text-lg font-bold text-gray-800 mb-3">
                            Use of our Website
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6 mb-3">
                            You agree to use our website for legitimate purposes and not for any illegal or unauthorized purpose, including without limitation, in violation of any intellectual property or privacy law. By agreeing to the Terms, you represent and warrant that you are at least the age of majority in your state or province of residence and are legally capable of entering into a binding contract.
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6 mb-3">
                            You agree to not use our website to conduct any activity that would constitute a civil or criminal offense or violate any law. You agree not to attempt to interfere with our website's network or security features or to gain unauthorized access to our systems.
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6">
                            You agree to provide us with accurate personal information, such as your email address, mailing address and other contact details in order to complete your order or contact you as needed. You agree to promptly update your account and information. You authorize us to collect and use this information to contact you in accordance with our Privacy Policy.
                        </Text>
                    </View>

                    {/* General Conditions */}
                    <View className="bg-white rounded-md shadow-sm p-5 mb-4">
                        <Text className="text-lg font-bold text-gray-800 mb-3">
                            General Conditions
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6 mb-3">
                            We reserve the right to refuse service to anyone, at any time, for any reason. We reserve the right to make any modifications to the website, including terminating, changing, suspending or discontinuing any aspect of the website at any time, without notice. We may impose additional rules or limits on the use of our website. You agree to review the Terms regularly and your continued access or use of our website will mean that you agree to any changes.
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6">
                            You agree that we will not be liable to you or any third party for any modification, suspension or discontinuance of our website or for any service, content, feature or product offered through our website.
                        </Text>
                    </View>

                    {/* Products or Services */}
                    <View className="bg-white rounded-md shadow-sm p-5 mb-4">
                        <Text className="text-lg font-bold text-gray-800 mb-3">
                            Products or Services
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6">
                            All purchases through our website are subject to product availability. We may, in our sole discretion, limit or cancel the quantities offered on our website or limit the sales of our products or services to any person, household, geographic region or jurisdiction. Prices for our products are subject to change, without notice. Unless otherwise indicated, prices displayed on our website are quoted in Indian Rupee (INR). We reserve the right, in our sole discretion, to refuse orders, including without limitation, orders that appear to be placed by distributors or resellers. If we believe that you have made a false or fraudulent order, we will be entitled to cancel the order and inform the relevant authorities. We do not guarantee the accuracy of the colour or design of the products on our website. We have made efforts to ensure the colour and design of our products are displayed as accurately as possible on our website.
                        </Text>
                    </View>

                    {/* Links to Third-Party Websites */}
                    <View className="bg-white rounded-md shadow-sm p-5 mb-4">
                        <Text className="text-lg font-bold text-gray-800 mb-3">
                            Links to Third-Party Websites
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6">
                            Links from or to websites outside our website are meant for convenience only. We do not review, endorse, approve or control, and are not responsible for any sites linked from or to our website, the content of those sites, the third parties named therein, or their products and services. Linking to any other site is at your sole risk and we will not be responsible or liable for any damages in connection with linking. Links to downloadable software sites are for convenience only and we are not responsible or liable for any difficulties or consequences associated with downloading the software. Use of any downloaded software is governed by the terms of the license agreement, if any, which accompanies or is provided with the software.
                        </Text>
                    </View>

                    {/* Use Comments, Feedback, and Other Submissions */}
                    <View className="bg-white rounded-md shadow-sm p-5 mb-4">
                        <Text className="text-lg font-bold text-gray-800 mb-3">
                            Use Comments, Feedback, and Other Submissions
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6 mb-3">
                            You acknowledge that you are responsible for the information, profiles, opinions, messages, comments, and any other content (collectively, the "Content") that you post, distribute, or share on or through our website or services available in connection with our website. You further acknowledge that you have full responsibility for the Content, including but limited to, concerning its legality, and its trademark, copyright, and other intellectual property ownership.
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6 mb-3">
                            You agree that any Content submitted by you in response to a request by us for a specific submission may be edited, adapted, modified, recreated, published, or distributed by us. You further agree that we are under no obligation to maintain any Content in confidence, to pay compensation for any Content or to respond to any Content.
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6 mb-3">
                            You agree that you will not post, distribute or share any Content on our website that is protected by copyright, trademark, patent or any other proprietary right without the express consent of the owner of such proprietary right. You further agree that your Content will not be unlawful, abusive or obscene nor will it contain any malware or computer virus that could affect our website"s operations. You will be solely liable for any Content that you make and its accuracy. We have no responsibility and assume no liability for any Content posted by you or any third party.
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6">
                            We reserve the right to terminate your ability to post on our website and to remove and/or delete any Content that we deem objectionable. You consent to such removal and/or deletion and waive any claim against us for the removal and/or deletion of your Content.
                        </Text>
                    </View>

                    {/* Your Personal Information */}
                    <View className="bg-white rounded-md shadow-sm p-5 mb-4">
                        <Text className="text-lg font-bold text-gray-800 mb-3">
                            Your Personal Information
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6">
                            Please see our Privacy Policy to learn about how we collect, use, and share your personal information.
                        </Text>
                    </View>

                    {/* Errors and Omissions */}
                    <View className="bg-white rounded-md shadow-sm p-5 mb-4">
                        <Text className="text-lg font-bold text-gray-800 mb-3">
                            Errors and Omissions
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6 mb-3">
                            Please note that our website may contain typographical errors or inaccuracies and may not be complete or current. We reserve the right to correct any errors, inaccuracies or omissions and to change or update information at any time, without prior notice (including after an order has been submitted). Such errors, inaccuracies or omissions may relate to product description, pricing, promotion and availability and we reserve the right to cancel or refuse any order placed based on incorrect pricing or availability information, to the extent permitted by applicable law.
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6">
                            We do not undertake to update, modify or clarify information on our website, except as required by law.
                        </Text>
                    </View>

                    {/* Disclaimer and Limitation of Liability */}
                    <View className="bg-white rounded-md shadow-sm p-5 mb-4">
                        <Text className="text-lg font-bold text-gray-800 mb-3">
                            Disclaimer and Limitation of Liability
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6 mb-3">
                            You assume all responsibility and risk concerning your use of our website, which is provided "as is" without warranties, representations or conditions of any kind, either express or implied, about information accessed from or via our website, including without limitation, all content and materials, and functions and services provided on our website, all of which are provided without warranty of any kind, including but not limited to warranties concerning the availability, accuracy, completeness or usefulness of content or information, uninterrupted access, and any warranties of title, non-infringement, merchantability or fitness for a particular purpose. We do not warrant that our website or its functioning or the content and material of the services made available thereby will be timely, secure, uninterrupted or error-free, that defects will be corrected, or that our websites or the servers that make our website available are free of viruses or other harmful components.
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6 mb-3">
                            The use of our website is at your sole risk and you assume full responsibility for any costs associated with your use of our website. We will not be liable for any damages of any kind related to the use of our website.
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6 mb-3">
                            In no event will we, or our affiliates, our or their respective content or service providers, or any of our or their respective directors, officers, agents, contractors, suppliers or employees be liable to you for any direct, indirect, special, incidental, consequential, exemplary or punitive damages, losses or causes of action, or lost revenue, lost profits, lost business or sales, or any other type of damage, whether based in contract or tort (including negligence), strict liability or otherwise, arising from your use of, or the inability to use, or the performance of, our website or the content or material or functionality through our website, even if we are advised of the possibility of such damages.
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6">
                            Certain jurisdictions do not allow the limitation of liability or the exclusion or limitation of certain damages. In such jurisdictions, some or all of the above disclaimers, exclusions, or limitations, may not apply to you and our liability will be limited to the maximum extent permitted by law.
                        </Text>
                    </View>

                    {/* Indemnification */}
                    <View className="bg-white rounded-md shadow-sm p-5 mb-4">
                        <Text className="text-lg font-bold text-gray-800 mb-3">
                            Indemnification
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6">
                            You agree to defend and indemnify us, and hold us and our affiliates harmless,, and our and their respective directors, officers, agents, contractors, and employees against any losses, liabilities, claims, expenses (including legal fees) in any way arising from, related to or in connection with your use of our website, your violation of the Terms, or the posting or transmission of any materials on or through the website by you, including but not limited to, any third party claim that any information or materials provided by you infringe upon any third party proprietary rights.
                        </Text>
                    </View>

                    {/* Entire Agreement */}
                    <View className="bg-white rounded-md shadow-sm p-5 mb-4">
                        <Text className="text-lg font-bold text-gray-800 mb-3">
                            Entire Agreement
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6">
                            The Terms and any documents expressly referred to in them represent the entire agreement between you and us about the subject matter of the Terms and supersede any prior agreement, understanding, or arrangement between you and us, whether oral or in writing. Both you and we acknowledge that, in entering into these Terms, neither you nor we have relied on any representation, undertaking or promise given by the other or implied from anything said or written between you and us before such Terms, except as expressly stated in the Terms.
                        </Text>
                    </View>

                    {/* Waiver */}
                    <View className="bg-white rounded-md shadow-sm p-5 mb-4">
                        <Text className="text-lg font-bold text-gray-800 mb-3">
                            Waiver
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6">
                            Our failure to exercise or enforce any right or provision of the Terms will not constitute a waiver of such right or provision. A waiver by us of any default will not constitute a waiver of any subsequent default. No waiver by us is effective unless it is communicated to you in writing.
                        </Text>
                    </View>

                    {/* Headings */}
                    <View className="bg-white rounded-md shadow-sm p-5 mb-4">
                        <Text className="text-lg font-bold text-gray-800 mb-3">
                            Headings
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6">
                            Any headings and titles herein are for convenience only.
                        </Text>
                    </View>

                    {/* Severability */}
                    <View className="bg-white rounded-md shadow-sm p-5 mb-4">
                        <Text className="text-lg font-bold text-gray-800 mb-3">
                            Severability
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6">
                            If any of the provisions of the Terms are determined by any competent authority to be invalid, unlawful, or unenforceable, such provision will to that extent be severed from the remaining Terms, which will continue to be valid and enforceable to the fullest extent permitted by law.
                        </Text>
                    </View>

                    {/* Governing Law */}
                    <View className="bg-white rounded-md shadow-sm p-5 mb-4">
                        <Text className="text-lg font-bold text-gray-800 mb-3">
                            Governing Law
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6">
                            Any disputes arising out of or relating to the Terms, the Privacy Policy, use of our website, or our products or services offered on our website will be resolved by the laws of India regarding its conflict of law rules. Any disputes, actions, or proceedings relating to the Terms or your access to or use of our website must be brought before the courts of the state of Kerala in the City of Calicut, and you irrevocably consent to the exclusive jurisdiction and venue of such courts.
                        </Text>
                    </View>

                    {/* Footer Note */}
                    <View className="bg-white rounded-md shadow-sm p-5 mb-4">
                        <Text className="text-sm text-gray-600 leading-6">
                            This document is an electronic record in terms of the Information Technology Act, 2000, and the amended provisions of electronic records in various statutes as amended by the Information Technology Act, 2000. This electronic record is generated by a computer system and does not require any physical or digital signatures.
                        </Text>
                    </View>

                    {/* Contact */}
                    <View className="bg-[#ED2353]/5 rounded-md p-5 mb-4">
                        <View className="items-center">
                            <Ionicons name="mail" size={40} color="#ED2353" />
                            <Text className="text-base font-semibold text-gray-800 mt-3 mb-2 text-center">
                                Questions or Concerns
                            </Text>
                            <Text className="text-sm text-gray-600 text-center mb-4">
                                Please send all questions, comments, and feedback to us
                            </Text>
                            <TouchableOpacity
                                onPress={handleEmail}
                                className="bg-[#ED2353] rounded-md px-6 py-3"
                                activeOpacity={0.8}
                            >
                                <Text className="text-white font-semibold text-sm">
                                    floranzafashiontdy@gmail.com
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

export default Terms