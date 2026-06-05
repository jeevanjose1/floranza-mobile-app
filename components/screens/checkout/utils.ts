export const getInitialState = (cData: string | null | undefined): string => {
  const DEFAULT_STATE = "KL";
  if (!cData) return DEFAULT_STATE;
  try {
    return JSON.parse(cData as string)?.state || DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
};

export const sanitizeContact = (contact: string | undefined | null): string => {
  if (!contact) return "";
  const digits = contact.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  return digits.slice(-10);
};

export const parseIntentUrl = (intentUrl: string): string | null => {
  try {
    const schemeMatch = intentUrl.match(/[;#]scheme=([^;]+)/i);
    if (!schemeMatch) return null;
    const scheme = schemeMatch[1];
    const pathAndQuery = intentUrl
      .replace(/^intent:\/\//, "")
      .replace(/#Intent;.*$/i, "");
    return `${scheme}://${pathAndQuery}`;
  } catch {
    return null;
  }
};

import { Linking, Alert } from "react-native";

export const openUpiUrl = async (url: string): Promise<void> => {
  let targetUrl = url;

  if (url.startsWith("intent://")) {
    const parsed = parseIntentUrl(url);
    if (parsed) {
      targetUrl = parsed;
    } else {
      const fallbackMatch = url.match(/S\.browser_fallback_url=([^;]+)/i);
      if (fallbackMatch) {
        targetUrl = decodeURIComponent(fallbackMatch[1]);
      } else {
        Alert.alert("Error", "Could not parse the UPI intent.");
        return;
      }
    }
  }

  await Linking.openURL(targetUrl).catch(() => {
    Alert.alert("UPI app not installed", "Please install PhonePe, GPay, or Paytm and try again.");
  });
};
