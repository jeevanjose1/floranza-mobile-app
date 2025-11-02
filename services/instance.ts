import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { Alert } from 'react-native';

export const base_url = process.env.EXPO_PUBLIC_BASE_URL;
const instance = axios.create({
  baseURL: base_url,
  headers: {
    'Content-Type': 'application/json'
  }
});

instance.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("floranza-t-value");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error reading token from AsyncStorage:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      await handleLogout();
    }
    return Promise.reject(error);
  }
);

async function handleLogout() {
  try {
    // Remove specific token
    await AsyncStorage.removeItem("floranza-t-value");
    
    // Clear all AsyncStorage (equivalent to localStorage.clear())
    await AsyncStorage.clear();
    
    // Show alert instead of toast
    Alert.alert(
      "Session Expired",
      "Please login again.",
      [{ text: "OK" }]
    );
    
    // Navigate to login screen
    // Note: You'll need to import your navigation reference
    // Example: navigationRef.current?.reset({ index: 0, routes: [{ name: 'Login' }] });
    
  } catch (error) {
    console.error('Error during logout:', error);
  }
}

export default instance;