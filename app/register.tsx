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
const registerSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .matches(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores'
    ),
  email: Yup.string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
});

export default function Register() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (values: {
    username: string;
    email: string;
    password: string;
  }) => {
    try {
      // TODO: Implement registration logic
      console.log('Register:', values);
      // After successful registration, navigate to home or login
      // router.replace('/(tabs)');
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <ImageBackground
      source={media.auth_bg}
      className="flex-1"
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)']}
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
              <View className="flex-1 justify-center px-6 py-8">
                

                {/* Registration Form Card */}
                <View className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
                {/* Logo Section */}
                <View className="items-center mb-8">
                <View className="bg-white rounded-full p-4 mb-4">
                    <Image
                      source={media.logo}
                      className="w-36 h-36"
                      resizeMode="contain"
                    />
                  </View>
                  <Text className="font-sam-bold text-2xl mb-2">
                    Create Account
                  </Text>
                  <Text className="font-sam-regular  text-base">
                    Sign up to get started
                  </Text>
                </View>
                  <Formik
                    initialValues={{ username: '', email: '', password: '' }}
                    validationSchema={registerSchema}
                    onSubmit={handleRegister}
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
                        {/* Username Input */}
                        <View className="mb-4">
                          <Text className="font-sam-medium text-gray-700 text-sm mb-2">
                            Username
                          </Text>
                          <View
                            className={`flex-row items-center border rounded-xl px-4 py-1 bg-white ${
                              errors.username && touched.username
                                ? 'border-red-500'
                                : 'border-gray-200'
                            }`}
                          >
                            <Ionicons
                              name="person-outline"
                              size={20}
                              color={errors.username && touched.username ? '#EF4444' : '#6B7280'}
                            />
                            <TextInput
                              className="flex-1 ml-3 text-base text-gray-900 font-sam-regular"
                              placeholder="Enter username"
                              placeholderTextColor="#9CA3AF"
                              value={values.username}
                              onChangeText={handleChange('username')}
                              onBlur={handleBlur('username')}
                              autoCapitalize="none"
                            />
                          </View>
                          {errors.username && touched.username && (
                            <Text className="text-red-500 text-xs mt-1 font-sam-regular">
                              {errors.username}
                            </Text>
                          )}
                        </View>

                        {/* Email Input */}
                        <View className="mb-4">
                          <Text className="font-sam-medium text-gray-700 text-sm mb-2">
                            Email
                          </Text>
                          <View
                            className={`flex-row items-center border rounded-xl px-4 py-1 bg-white ${
                              errors.email && touched.email
                                ? 'border-red-500'
                                : 'border-gray-200'
                            }`}
                          >
                            <Ionicons
                              name="mail-outline"
                              size={20}
                              color={errors.email && touched.email ? '#EF4444' : '#6B7280'}
                            />
                            <TextInput
                              className="flex-1 ml-3 text-base text-gray-900 font-sam-regular"
                              placeholder="Enter email"
                              placeholderTextColor="#9CA3AF"
                              value={values.email}
                              onChangeText={handleChange('email')}
                              onBlur={handleBlur('email')}
                              autoCapitalize="none"
                              keyboardType="email-address"
                            />
                          </View>
                          {errors.email && touched.email && (
                            <Text className="text-red-500 text-xs mt-1 font-sam-regular">
                              {errors.email}
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

                        {/* Sign Up Button */}
                        <Button
                          variant="primary"
                          size="large"
                          onPress={handleSubmit}
                          disabled={isSubmitting}
                          className="w-full mb-4"
                        >
                          <Text className="font-sam-bold text-white text-base">
                            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                          </Text>
                        </Button>
                      </View>
                    )}
                  </Formik>
                </View>

                {/* Login Link */}
                <View className="flex-row justify-center items-center mt-6">
                  <Text className="font-sam-regular text-white text-base">
                    Already have an account?{' '}
                  </Text>
                  <TouchableOpacity onPress={handleLogin}>
                    <Text className="font-sam-bold text-white text-base underline">
                      Sign In
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