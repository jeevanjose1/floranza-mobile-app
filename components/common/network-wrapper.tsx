import NetInfo from "@react-native-community/netinfo";
import React, { useEffect, useState } from "react";
import Toast from "react-native-toast-message";

export default function NetworkWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    // Listen for network state changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected === false) {
        setWasOffline(true);
        Toast.show({
          type: "error",
          text1: "No Internet Connection 📡",
          text2: "Please check your network settings and try again.",
          autoHide: false,
          position: "bottom",
          bottomOffset: 100,
        });
      } else if (state.isConnected && wasOffline) {
        setWasOffline(false);
        Toast.hide();
        Toast.show({
          type: "success",
          text1: "Back Online! ⚡️",
          text2: "Your internet connection was restored.",
          position: "bottom",
          bottomOffset: 100,
        });
      }
    });

    return () => unsubscribe();
  }, [wasOffline]);

  return <>{children}</>;
}
