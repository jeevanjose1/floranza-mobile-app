import Constants, { ExecutionEnvironment } from 'expo-constants';
import { useEffect } from 'react';
import { Platform } from 'react-native';

export const useInAppUpdate = () => {
  useEffect(() => {
    // Skip in-app update logic if we are running in Expo Go or in local development
    const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
    
    if (__DEV__ || isExpoGo) {
      console.log('Skipping in-app update check in development/Expo Go');
      return;
    }

    const checkUpdate = async () => {
      try {
        // Use dynamic import so the app doesn't crash on startup if native modules are missing locally
        const SpInAppUpdates = require('sp-react-native-in-app-updates').default;
        const { IAUUpdateKind } = require('sp-react-native-in-app-updates');

        const inAppUpdates = new SpInAppUpdates(false);
        const result = await inAppUpdates.checkNeedsUpdate();

        if (result.shouldUpdate) {
          let updateOptions: any = {};
          if (Platform.OS === 'android') {
            updateOptions = { updateType: IAUUpdateKind.IMMEDIATE };
          }
          await inAppUpdates.startUpdate(updateOptions);
        }
      } catch (error: any) {
        // Play Core throws an error if the app wasn't downloaded from the Play Store
        console.log("In-app update check failed (expected if sideloaded):", error?.message);
      }
    };

    checkUpdate();
  }, []);
};
