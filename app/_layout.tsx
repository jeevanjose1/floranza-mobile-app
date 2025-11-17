// CRITICAL: Import gesture-handler FIRST before anything else
import 'react-native-gesture-handler';

import ErrorBoundary from "@/components/common/error-boundary";
import GtokenProvider from '@/components/common/gtoken-provider';
import QueryProvider from '@/components/common/query-provider';
import { toastConfig } from '@/constants/others';
import "@/global.css";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from 'expo-font';
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from "expo-status-bar";
import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';


// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const [fontsLoaded, fontError] = useFonts({
    'Dancing-Bold': require('../assets/fonts/DancingScript-Bold.ttf'),
    'Dancing-Medium': require('../assets/fonts/DancingScript-Medium.ttf'),
    'Dancing-Regular': require('../assets/fonts/DancingScript-Regular.ttf'),
    'Dancing-SemiBold': require('../assets/fonts/DancingScript-SemiBold.ttf'),
    'Sam-Bold': require('../assets/fonts/samsungsharpsans-bold.otf'),
    'Sam-Medium': require('../assets/fonts/samsungsharpsans-medium.otf'),
    'Sam': require('../assets/fonts/samsungsharpsans.otf'),
  });

  // Ensure fonts are loaded or proceed with error
  const isReady = fontsLoaded || fontError;

 

  useEffect(() => {
    if (isReady) {
      // Hide splash screen when fonts are loaded or if there's an error
      // Use setTimeout to ensure UI is ready
      const timer = setTimeout(() => {
        SplashScreen.hideAsync().catch((err) => {
          // Ignore errors if splash screen is already hidden
          console.warn('Splash screen hide error:', err);
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isReady]);

  // Show loading indicator while fonts are loading
  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <ActivityIndicator size="large" color="#ED2353" />
        <Text style={{ marginTop: 16, color: '#6B7280' }}>Loading...</Text>
      </View>
    );
  }

  // Log font error but continue (fallback to system fonts)
  if (fontError) {
    console.warn('Font loading error:', fontError);
  }

  return (
    <ErrorBoundary>
      <QueryProvider>
        <GtokenProvider>
        <SafeAreaProvider>

          <ThemeProvider value={DefaultTheme}>
            <View className="flex-1">
              <Stack
                screenOptions={{
                  headerStyle: {
                    backgroundColor: 'transparent',
                  },
                  headerTransparent: true,
                }}
              >
                <Stack.Screen
                  options={{
                    headerShown: false
                  }}
                  name="(tabs)"
                />
                <Stack.Screen
                  options={{
                    headerShown: false,
                    animation: 'slide_from_right',
                    title: 'Checkout'
                  }}
                  name="checkout"
                />
                <Stack.Screen
                  options={{
                    headerShown: false,
                    animation: 'slide_from_right',
                    title: 'Wishlist'
                  }}
                  name="wishlist"
                />
                 <Stack.Screen
                  options={{
                    headerShown: false,
                    animation: 'slide_from_right',
                    title: 'Saved Address'
                  }}
                  name="saved-address"
                />
                 <Stack.Screen
                  options={{
                    headerShown: false,
                    animation: 'slide_from_right',
                    title: 'Tracking'
                  }}
                  name="tracking"
                />
                 <Stack.Screen
                  options={{
                    headerShown: false,
                    animation: 'slide_from_right',
                    title: 'Help And Support'
                  }}
                  name="help-and-support"
                />
                 <Stack.Screen
                  options={{
                    headerShown: false,
                    animation: 'slide_from_right',
                    title: 'Edit Profile'
                  }}
                  name="edit-profile"
                />
                 <Stack.Screen
                  options={{
                    headerShown: false,
                    animation: 'slide_from_right',
                    title: 'My Orders'
                  }}
                  name="my-orders"
                />
                <Stack.Screen
                  options={{
                    headerShown: false,
                    animation: 'slide_from_right',
                    title: 'Order Details'
                  }}
                  name="order-details"
                />
                <Stack.Screen
                  options={{
                    headerShown: false,
                    animation: 'slide_from_right',
                    title: 'Add Address'
                  }}
                  name="add-address"
                />
                 <Stack.Screen
                  options={{
                    headerShown: false,
                    animation: 'slide_from_right',
                    title: 'Cart'
                  }}
                  name="cart"
                />
                <Stack.Screen
                  options={{
                    headerShown: false,
                    animation: 'slide_from_right'
                  }}
                  name="contact"
                />
                 <Stack.Screen
                  options={{
                    headerShown: false,
                    animation: 'slide_from_right'
                  }}
                  name="about"
                />
                <Stack.Screen
                  options={{
                    headerShown: false,
                    animation: 'slide_from_right'
                  }}
                  name="privacy"
                />
                <Stack.Screen
                  options={{
                    headerShown: false,
                    animation: 'slide_from_right'
                  }}
                  name="terms"
                />
                <Stack.Screen
                  options={{
                    headerShown: false,
                    animation: 'slide_from_right'
                  }}
                  name="return"
                />
                 <Stack.Screen
                  options={{
                    headerShown: false,
                    animation: 'slide_from_right'
                  }}
                  name="shipping"
                />
                 <Stack.Screen
                  options={{
                    headerShown: false,
                    animation: 'slide_from_right'
                  }}
                  name="payment-success"
                />
                 <Stack.Screen
                  options={{
                    headerShown: false,
                    animation: 'slide_from_right'
                  }}
                  name="payment-faild"
                />
                <Stack.Screen
                  options={{
                    headerShown: false,
                    animation: 'slide_from_right'
                  }}
                  name="account"
                />
                <Stack.Screen
                  options={{
                    headerShown: false,
                    animation: 'slide_from_right',
                    title: 'Search'
                  }}
                  name="search"
                />
                <Stack.Screen
                  options={{
                    headerShown: false,
                    animation: 'fade',
                  }}
                  name="product-list"
                />
                <Stack.Screen
                  options={{
                    headerShown: false,
                    animation: 'fade',
                  }}
                  name="product-details"
                />
                <Stack.Screen
                  options={{
                    headerShown: false,
                    animation: 'fade',
                  }}
                  name="login"
                />
                <Stack.Screen
                  options={{
                    headerShown: false,
                    animation: 'slide_from_right',
                  }}
                  name="register"
                />
              </Stack>

              <StatusBar
                translucent
                style="dark"
                animated
                backgroundColor="transparent"
              />

            </View>
          </ThemeProvider>
        </SafeAreaProvider>
        </GtokenProvider>
       <Toast config={toastConfig} position='bottom' />
      </QueryProvider>
    </ErrorBoundary>
  );
}