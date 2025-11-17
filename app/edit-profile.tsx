import Header from '@/components/layout/header';
import { useAccountDetails, useEditAccount } from '@/services/queries/account';
import { Formik } from 'formik';
import React from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import * as Yup from 'yup';

// Validation Schema
const profileSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters'),
  displayName: Yup.string()
    .required('Display name is required')
    .min(3, 'Display name must be at least 3 characters'),
  email: Yup.string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
});

const PLACEHOLDER_TEXT_COLOR = '#9CA3AF';

// Form Input Component
interface FormInputProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur: (e: any) => void;
  error?: any;
  touched?: any;
  isOptional?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChangeText,
  onBlur,
  error,
  touched,
  isOptional = false,
  ...rest
}) => {
  const hasError = !!(error && touched);

  return (
    <View className="mb-4">
      <Text className="text-[13px] font-medium text-gray-700 mb-2 font-sam-medium">
        {label} {isOptional && <Text className="text-gray-400 font-normal">(Optional)</Text>}
      </Text>
      <View className={`bg-white rounded-lg shadow-sm ${hasError ? 'border border-red-400' : 'border border-gray-200'}`}>
        <TextInput
          className="px-4 h-12 text-[15px] text-gray-900 font-sam-regular"
          placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          {...rest}
        />
      </View>
      {hasError && (
        <Text className="text-red-500 text-xs mt-1.5 ml-1 font-sam-regular">
          {error}
        </Text>
      )}
    </View>
  );
};

type Props = {};

const EditProfile = (props: Props) => {
  const { mutateAsync: update, isPending } = useEditAccount();
  const { data: user_data } = useAccountDetails(true);

  const handleSubmit = (values: any) => {
    const form_data = new FormData();
    form_data.append('fname', values.firstName);
    form_data.append('username', values.displayName);
    form_data.append('email', values.email);
    if (values.newPassword) {
      form_data.append('password', values.newPassword as string);
    }

    update(form_data, {
      onSuccess: () => {
        Toast.show({
          type: 'success',
          text1: 'Account details updated'
        });
      },
      onError: (error: any) => {
        Toast.show({
          type: 'error',
          text1: error.data.message
        });
      }
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <Header title="Edit Profile" type="account" />

      <Formik
        initialValues={{
          firstName: user_data?.data?.name || '',
          displayName: user_data?.data?.username || '',
          email: user_data?.data?.email || '',
          newPassword: '',
          confirmPassword: ''
        }}
        validationSchema={profileSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched
        }) => (
          <View className="flex-1">
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
              className="flex-1"
              keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                className="flex-1"
                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16 }}
              >
                {/* Account Details Section */}
                <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                  <Text className="text-base font-bold text-gray-900 mb-4 font-sam-bold">
                    Account Details
                  </Text>

                  <FormInput
                    label="Full Name"
                    value={values.firstName}
                    onChangeText={handleChange('firstName')}
                    onBlur={handleBlur('firstName')}
                    error={errors.firstName}
                    touched={touched.firstName}
                    placeholder="Enter your full name"
                    autoCapitalize="words"
                  />

                  <FormInput
                    label="Display Name"
                    value={values.displayName}
                    onChangeText={handleChange('displayName')}
                    onBlur={handleBlur('displayName')}
                    error={errors.displayName}
                    touched={touched.displayName}
                    placeholder="johndoe"
                    autoCapitalize="none"
                  />
                  <Text className="text-xs text-gray-500 -mt-2 mb-4 ml-1 font-sam-regular">
                    This is the name that will be displayed on your profile.
                  </Text>

                  <FormInput
                    label="Email"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    error={errors.email}
                    touched={touched.email}
                    placeholder="john.doe@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                {/* Change Password Section */}
                <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                  <Text className="text-base font-bold text-gray-900 mb-4 font-sam-bold">
                    Change Password
                  </Text>

                  <FormInput
                    label="New Password"
                    isOptional
                    value={values.newPassword}
                    onChangeText={handleChange('newPassword')}
                    onBlur={handleBlur('newPassword')}
                    error={errors.newPassword}
                    touched={touched.newPassword}
                    placeholder="••••••••"
                    secureTextEntry
                  />
                  <Text className="text-xs text-gray-500 -mt-2 mb-4 ml-1 font-sam-regular">
                    Password must be at least 8 characters.
                  </Text>

                  <FormInput
                    label="Confirm Password"
                    isOptional
                    value={values.confirmPassword}
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    error={errors.confirmPassword}
                    touched={touched.confirmPassword}
                    placeholder="••••••••"
                    secureTextEntry
                  />
                </View>
              </ScrollView>

              {/* Fixed Bottom Button */}
              <View className="h-24 right-0 bg-white px-4 py-3 shadow-lg">
                <TouchableOpacity
                  onPress={() => handleSubmit()}
                  disabled={isPending}
                  className={`rounded-lg py-3.5 ${isPending ? 'bg-gray-400' : 'bg-primary'}`}
                  activeOpacity={0.8}
                >
                  <Text className="text-white font-bold text-center text-[15px] font-sam-bold tracking-wide">
                    {isPending ? 'SAVING...' : 'SAVE CHANGES'}
                  </Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default EditProfile;