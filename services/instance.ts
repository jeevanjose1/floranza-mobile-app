import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import { Alert } from "react-native";

export const base_url = process.env.EXPO_PUBLIC_BASE_URL;
const instance = axios.create({
  baseURL: base_url,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("floranza-t-value");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error reading token from AsyncStorage:", error);
    }

    config.params = {
      ...config.params,
      source: "mobile",
    };
    return config;
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      await handleLogout();
    }
    return Promise.reject(error);
  },
);

async function handleLogout() {
  try {
    await AsyncStorage.removeItem("floranza-t-value");

    await AsyncStorage.clear();

    Alert.alert("Session Expired", "Please login again.", [{ text: "OK" }]);

    router.replace("/login");
  } catch (error) {
    console.error("Error during logout:", error);
  }
}

export default instance;
