// CRITICAL: Import gesture-handler FIRST before anything else
import "react-native-gesture-handler";

import AnimatedSplash from "@/components/common/animated-splash";
import ErrorBoundary from "@/components/common/error-boundary";
import GtokenProvider from "@/components/common/gtoken-provider";
import NetworkWrapper from "@/components/common/network-wrapper";
import QueryProvider from "@/components/common/query-provider";
import { toastConfig } from "@/constants/others";
import "@/global.css";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as Linking from "expo-linking";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "Dancing-Bold": require("../assets/fonts/DancingScript-Bold.ttf"),
    "Dancing-Medium": require("../assets/fonts/DancingScript-Medium.ttf"),
    "Dancing-Regular": require("../assets/fonts/DancingScript-Regular.ttf"),
    "Dancing-SemiBold": require("../assets/fonts/DancingScript-SemiBold.ttf"),
    "Sam-Bold": require("../assets/fonts/samsungsharpsans-bold.otf"),
    "Sam-Medium": require("../assets/fonts/samsungsharpsans-medium.otf"),
    Sam: require("../assets/fonts/samsungsharpsans.otf"),
  });

  // Ensure fonts are loaded or proceed with error
  const isReady = fontsLoaded || fontError;
  const [showSplash, setShowSplash] = useState(true);
  const router = useRouter();

  // --- Deep link handler ---
  const handleDeepLink = (url: string) => {
    try {
      const parsed = new URL(url);
      const pathname = parsed.pathname; // e.g. "/product/some-kurti-slug"
      const productMatch = pathname.match(/^\/product\/(.+)/);
      if (productMatch && productMatch[1]) {
        const slug = productMatch[1];
        router.push({
          pathname: "/product-details",
          params: { slug },
        });
      }
    } catch {
      // ignore invalid URLs
    }
  };

  useEffect(() => {
    // Cold start: check if the app was opened via a deep link
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    // Warm start: listen for deep links while the app is running
    const subscription = Linking.addEventListener("url", (event) => {
      handleDeepLink(event.url);
    });

    return () => subscription.remove();
  }, []);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  // Show nothing while fonts are loading (native splash is still visible)
  if (!isReady) {
    return null;
  }

  // Log font error but continue (fallback to system fonts)
  if (fontError) {
    console.warn("Font loading error:", fontError);
  }

  return (
    <ErrorBoundary>
      <QueryProvider>
        <GtokenProvider>
          <SafeAreaProvider>
            <NetworkWrapper>
              <ThemeProvider value={DefaultTheme}>
                <View className="flex-1">
                  <Stack
                    screenOptions={{
                      headerStyle: {
                        backgroundColor: "transparent",
                      },
                      headerTransparent: true,
                    }}
                  >
                    <Stack.Screen
                      options={{
                        headerShown: false,
                      }}
                      name="(tabs)"
                    />
                    <Stack.Screen
                      options={{
                        headerShown: false,
                        animation: "slide_from_right",
                        title: "Checkout",
                      }}
                      name="checkout"
                    />
                    <Stack.Screen
                      options={{
                        headerShown: false,
                        animation: "slide_from_right",
                        title: "Wishlist",
                      }}
                      name="wishlist"
                    />
                    <Stack.Screen
                      options={{
                        headerShown: false,
                        animation: "slide_from_right",
                        title: "Saved Address",
                      }}
                      name="saved-address"
                    />
                    <Stack.Screen
                      options={{
                        headerShown: false,
                        animation: "slide_from_right",
                        title: "Tracking",
                      }}
                      name="tracking"
                    />
                    <Stack.Screen
                      options={{
                        headerShown: false,
                        animation: "slide_from_right",
                        title: "Help And Support",
                      }}
                      name="help-and-support"
                    />
                    <Stack.Screen
                      options={{
                        headerShown: false,
                        animation: "slide_from_right",
                        title: "Edit Profile",
                      }}
                      name="edit-profile"
                    />
                    <Stack.Screen
                      options={{
                        headerShown: false,
                        animation: "slide_from_right",
                        title: "My Orders",
                      }}
                      name="my-orders"
                    />
                    <Stack.Screen
                      options={{
                        headerShown: false,
                        animation: "slide_from_right",
                        title: "Order Details",
                      }}
                      name="order-details"
                    />
                    <Stack.Screen
                      options={{
                        headerShown: false,
                        animation: "slide_from_right",
                        title: "Add Address",
                      }}
                      name="add-address"
                    />
                    <Stack.Screen
                      options={{
                        headerShown: false,
                        animation: "slide_from_right",
                        title: "Cart",
                      }}
                      name="cart"
                    />
                    <Stack.Screen
                      options={{
                        headerShown: false,
                        animation: "slide_from_right",
                      }}
                      name="contact"
                    />
                    <Stack.Screen
                      options={{
                        headerShown: false,
                        animation: "slide_from_right",
                      }}
                      name="about"
                    />
                    <Stack.Screen
                      options={{
                        headerShown: false,
                        animation: "slide_from_right",
                      }}
                      name="privacy"
                    />
                    <Stack.Screen
                      options={{
                        headerShown: false,
                        animation: "slide_from_right",
                      }}
                      name="terms"
                    />
                    <Stack.Screen
                      options={{
                        headerShown: false,
                        animation: "slide_from_right",
                      }}
                      name="return"
                    />
                    <Stack.Screen
                      options={{
                        headerShown: false,
                        animation: "slide_from_right",
                      }}
                      name="shipping"
                    />
                    <Stack.Screen
                      options={{
                        headerShown: false,
                        animation: "slide_from_right",
                      }}
                      name="payment-success"
                    />
                    <Stack.Screen
                      options={{
                        headerShown: false,
                        animation: "slide_from_right",
                      }}
                      name="payment-faild"
                    />
                    <Stack.Screen
                      options={{
                        headerShown: false,
                        animation: "slide_from_right",
                      }}
                      name="account"
                    />
                    <Stack.Screen
                      options={{
                        headerShown: false,
                        animation: "slide_from_right",
                        title: "Search",
                      }}
                      name="search"
                    />
                    <Stack.Screen
                      options={{
                        headerShown: false,
                        animation: "fade",
                      }}
                      name="product-list"
                    />
                    <Stack.Screen
                      options={{
                        headerShown: false,
                        animation: "fade",
                      }}
                      name="product-details"
                    />
                    <Stack.Screen
                      options={{
                        headerShown: false,
                        animation: "fade",
                      }}
                      name="login"
                    />
                    <Stack.Screen
                      options={{
                        headerShown: false,
                        animation: "slide_from_right",
                      }}
                      name="register"
                    />
                  </Stack>

                  {/* Animated Splash Screen Overlay */}
                  {showSplash && (
                    <AnimatedSplash
                      onAnimationComplete={handleSplashComplete}
                    />
                  )}

                  <StatusBar
                    translucent
                    style="dark"
                    animated
                    backgroundColor="transparent"
                  />
                </View>
              </ThemeProvider>
            </NetworkWrapper>
          </SafeAreaProvider>
        </GtokenProvider>
        <Toast config={toastConfig} position="top" />
      </QueryProvider>
    </ErrorBoundary>
  );
}
