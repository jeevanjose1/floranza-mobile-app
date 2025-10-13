import "@/global.css";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from 'react-native';

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <View style={{ flex: 1 }}>
      
        
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
              headerShown: true, 
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
            name="account" 
          />
          <Stack.Screen 
            options={{ 
              headerShown: true,
              animation: 'slide_from_right',
              title: 'Search'
            }} 
            name="search" 
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
  );
}