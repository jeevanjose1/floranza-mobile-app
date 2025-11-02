import Button from '@/components/common/button';
import { media } from '@/constants/medias';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import React, { useState } from 'react';
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from 'yup';

// Validation schema
const loginSchema = Yup.object().shape({
  usernameOrEmail: Yup.string()
    .required('Username or email is required')
    .min(3, 'Username or email must be at least 3 characters'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (values: {
    usernameOrEmail: string;
    password: string;
  }) => {
    try {
      // TODO: Implement login logic
      console.log('Login:', values);
      // After successful login, navigate to home
      // router.replace('/(tabs)');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleSignUp = () => {
    router.push('/register');
  };

  return (
    <ImageBackground
      source={media.auth_bg}
      className="flex-1"
      resizeMode="cover"
    >
      <LinearGradient
        colors={['#0000', '#0000', 'rgba(0,0,0,0.7)']}
        className="flex-1"
      >
        <SafeAreaView className="flex-1" edges={['top']}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
          >
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View className="flex-1 justify-center px-4 py-8">
                {/* Logo Section */}
                

                {/* Login Form Card */}
                <View className="bg-white/95  rounded-xl p-6 shadow-2xl">
                <View className="items-center mb-8">
                  <View className="bg-white rounded-full p-4 mb-4">
                    <Image
                      source={media.logo}
                      className="w-36 h-36"
                      resizeMode="contain"
                    />
                  </View>
                  <Text className="font-sam-bold text-2xl mb-2">
                    Welcome Back
                  </Text>
                  <Text className="font-sam-regular  text-base">
                    Sign in to continue
                  </Text>
                </View>
                  <Formik
                    initialValues={{ usernameOrEmail: '', password: '' }}
                    validationSchema={loginSchema}
                    onSubmit={handleLogin}
                  >
                    {({
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      values,
                      errors,
                      touched,
                      isSubmitting,
                    }) => (
                      <View>
                        {/* Username/Email Input */}
                        <View className="mb-4">
                          <Text className="font-sam-medium text-gray-700 text-sm mb-2">
                            Username or Email
                          </Text>
                          <View
                            className={`flex-row items-center border rounded-xl px-4 py-1 bg-white ${
                              errors.usernameOrEmail && touched.usernameOrEmail
                                ? 'border-red-500'
                                : 'border-gray-200'
                            }`}
                          >
                            <Ionicons
                              name="person-outline"
                              size={20}
                              color={errors.usernameOrEmail && touched.usernameOrEmail ? '#EF4444' : '#6B7280'}
                            />
                            <TextInput
                              className="flex-1 ml-3 text-base text-gray-900 font-sam-regular"
                              placeholder="Enter username or email"
                              placeholderTextColor="#9CA3AF"
                              value={values.usernameOrEmail}
                              onChangeText={handleChange('usernameOrEmail')}
                              onBlur={handleBlur('usernameOrEmail')}
                              autoCapitalize="none"
                              keyboardType="email-address"
                            />
                          </View>
                          {errors.usernameOrEmail && touched.usernameOrEmail && (
                            <Text className="text-red-500 text-xs mt-1 font-sam-regular">
                              {errors.usernameOrEmail}
                            </Text>
                          )}
                        </View>

                        {/* Password Input */}
                        <View className="mb-6">
                          <Text className="font-sam-medium text-gray-700 text-sm mb-2">
                            Password
                          </Text>
                          <View
                            className={`flex-row items-center border rounded-xl px-4 py-1 bg-white ${
                              errors.password && touched.password
                                ? 'border-red-500'
                                : 'border-gray-200'
                            }`}
                          >
                            <Ionicons
                              name="lock-closed-outline"
                              size={20}
                              color={errors.password && touched.password ? '#EF4444' : '#6B7280'}
                            />
                            <TextInput
                              className="flex-1 ml-3 text-base text-gray-900 font-sam-regular"
                              placeholder="Enter password"
                              placeholderTextColor="#9CA3AF"
                              value={values.password}
                              onChangeText={handleChange('password')}
                              onBlur={handleBlur('password')}
                              secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity
                              onPress={() => setShowPassword(!showPassword)}
                              className="ml-2"
                            >
                              <Ionicons
                                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                size={20}
                                color="#6B7280"
                              />
                            </TouchableOpacity>
                          </View>
                          {errors.password && touched.password && (
                            <Text className="text-red-500 text-xs mt-1 font-sam-regular">
                              {errors.password}
                            </Text>
                          )}
                        </View>

                        {/* Forgot Password */}
                        <TouchableOpacity className="self-end mb-6">
                          <Text className="font-sam-medium text-primary text-sm">
                            Forgot Password?
                          </Text>
                        </TouchableOpacity>

                        {/* Login Button */}
                        <Button
                          variant="primary"
                          size="large"
                          onPress={handleSubmit}
                          disabled={isSubmitting}
                          className="w-full mb-4"
                        >
                          <Text className="font-sam-bold text-white text-base">
                            {isSubmitting ? 'Signing In...' : 'Sign In'}
                          </Text>
                        </Button>
                      </View>
                    )}
                  </Formik>
                </View>

                {/* Sign Up Link */}
                <View className="flex-row justify-center items-center mt-6">
                  <Text className="font-sam-regular text-white text-base">
                    Don't have an account?{' '}
                  </Text>
                  <TouchableOpacity onPress={handleSignUp}>
                    <Text className="font-sam-bold text-white text-base underline">
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}