import React, { useCallback, useRef } from "react";
import { Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { openUpiUrl } from "./utils";

interface PhonePeModalProps {
  phonePeWebView: { url: string; orderId: string } | null;
  onCancel: () => void;
  onComplete: (orderId: string) => void;
  onUpiIntent: (orderId: string) => void;
}

const PhonePeModal = ({
  phonePeWebView,
  onCancel,
  onComplete,
  onUpiIntent,
}: PhonePeModalProps) => {
  const webViewRef = useRef<WebView>(null);

  const handleWebViewUrl = useCallback(
    (url: string): boolean => {
      if (!url || url === "about:blank") return true;
      const lower = url.toLowerCase();

      // UPI / intent deep-links → open natively, block WebView
      const isUpi =
        lower.startsWith("intent://") ||
        lower.startsWith("upi://") ||
        lower.startsWith("ppe://") ||
        lower.startsWith("gpay://") ||
        lower.startsWith("tez://") ||
        lower.startsWith("phonepe://") ||
        lower.startsWith("paytmmp://") ||
        lower.startsWith("credpay://") ||
        lower.startsWith("bhim://") ||
        lower.startsWith("super://") ||
        lower.startsWith("amazonpay://");

      if (isUpi) {
        if (phonePeWebView?.orderId) {
          onUpiIntent(phonePeWebView.orderId);
        }
        openUpiUrl(url).catch(() => { });
        return false;
      }

      // Payment completion redirect → close WebView and verify
      if (lower.includes("/payment-cancel")) {
        onCancel();
        return false;
      } else if (
        lower.includes("/payment-success") ||
        lower.includes("/payment-fail") ||
        lower.includes("/order-received")
      ) {
        if (phonePeWebView?.orderId) {
          onComplete(phonePeWebView.orderId);
        }
        return false;
      }

      return true;
    },
    [phonePeWebView, onCancel, onComplete, onUpiIntent]
  );

  if (!phonePeWebView) return null;

  return (
    <Modal
      visible={!!phonePeWebView}
      animationType="slide"
      onRequestClose={onCancel}
    >
      <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
        <WebView
          ref={webViewRef}
          source={{
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <script src="https://mercury.phonepe.com/web/bundle/checkout.js"></script>
              </head>
              <body style="margin:0;padding:0;background-color:#fff;display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;">
                <div id="loading" style="font-size:18px;color:#333;">Initializing PhonePe...</div>
                <script>
                  window.onload = function() {
                    if (window.PhonePeCheckout && window.PhonePeCheckout.transact) {
                      window.PhonePeCheckout.transact({
                        tokenUrl: "${phonePeWebView.url}",
                        callback: function(response) {
                          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'PAYMENT_DONE' }));
                        },
                        type: "REDIRECT"
                      });
                    } else {
                      document.getElementById('loading').innerText = "Failed to load PhonePe SDK";
                    }
                  };
                </script>
              </body>
              </html>
            `,
            baseUrl: "https://floranzafashion.com",
          }}
          style={{ flex: 1 }}
          originWhitelist={["*"]}
          domStorageEnabled
          javaScriptEnabled
          setSupportMultipleWindows={false}
          mixedContentMode="compatibility"
          userAgent="Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
          onMessage={(event) => {
            try {
              const data = JSON.parse(event.nativeEvent.data);
              if (data?.type === "upi_intent" && data?.url) {
                if (phonePeWebView.orderId) {
                  onUpiIntent(phonePeWebView.orderId);
                }
                openUpiUrl(data.url).catch(() => { });
              } else if (data?.type === "PAYMENT_DONE") {
                if (phonePeWebView.orderId) {
                  onComplete(phonePeWebView.orderId);
                }
              }
            } catch (_) { }
          }}
          onShouldStartLoadWithRequest={(request) => {
            return handleWebViewUrl(request.url);
          }}
          onNavigationStateChange={(navState) => {
            const lower = (navState.url || "").toLowerCase();

            if (lower.includes("/payment-cancel")) {
              onCancel();
            } else if (
              lower.includes("/payment-success") ||
              lower.includes("/payment-fail") ||
              lower.includes("/order-received")
            ) {
              if (phonePeWebView.orderId) {
                onComplete(phonePeWebView.orderId);
              }
            }
          }}
          onError={(e) => {
            const url = e.nativeEvent.url || "";
            if (
              url.startsWith("upi://") ||
              url.startsWith("intent://") ||
              url.startsWith("ppe://") ||
              url.startsWith("gpay://") ||
              url.startsWith("tez://") ||
              url.startsWith("paytmmp://")
            ) {
              openUpiUrl(url).catch(() => { });
            }
          }}
        />
      </SafeAreaView>
    </Modal>
  );
};

export default PhonePeModal;
