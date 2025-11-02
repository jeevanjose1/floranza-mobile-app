import "@/global.css";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from 'expo-font';
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, View } from 'react-native';

export default function RootLayout() {
   const [fontsLoaded] = useFonts({
    'Dancing-Bold': require('../assets/fonts/DancingScript-Bold.ttf'),
    'Dancing-Medium': require('../assets/fonts/DancingScript-Medium.ttf'),
    'Dancing-Regular': require('../assets/fonts/DancingScript-Regular.ttf'),
    'Dancing-SemiBold': require('../assets/fonts/DancingScript-SemiBold.ttf'),
    'Sam-Bold': require('../assets/fonts/samsungsharpsans-bold.otf'),
    'Sam-Medium': require('../assets/fonts/samsungsharpsans-medium.otf'),
    'Sam': require('../assets/fonts/samsungsharpsans.otf'),
    

  });

  if(!fontsLoaded){
    return <Text>loading</Text>
  }
  return (
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