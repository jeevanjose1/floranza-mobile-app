import useBreakPoints from "@/hooks/useBreajpoints";
import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import {
  Dimensions,
  Image,
  Modal,
  StatusBar,
  TouchableOpacity,
  View,
} from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";

type imageProp = {
  data: any[];
};

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// ─── Full-screen zoomable viewer ─────────────────────────────────────────────
function ImageViewer({
  uri,
  onClose,
}: {
  uri: string;
  onClose: () => void;
}) {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const resetZoom = () => {
    "worklet";
    scale.value = withTiming(1);
    savedScale.value = 1;
    translateX.value = withTiming(0);
    translateY.value = withTiming(0);
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
  };

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.min(Math.max(savedScale.value * e.scale, 1), 5);
    })
    .onEnd(() => {
      if (scale.value < 1.1) {
        resetZoom();
      } else {
        savedScale.value = scale.value;
      }
    });

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      if (savedScale.value <= 1) return;
      const maxX = (screenWidth * (savedScale.value - 1)) / 6;   // was /6
      const maxY = (screenHeight * (savedScale.value - 1)) / 6;  // was /6
      translateX.value = Math.min(Math.max(savedTranslateX.value + e.translationX * 0.3, -maxX), maxX);  // was 0.3
      translateY.value = Math.min(Math.max(savedTranslateY.value + e.translationY * 0.3, -maxY), maxY);  // was 0.3
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value > 1) {
        resetZoom();
      } else {
        scale.value = withTiming(2.5);
        savedScale.value = 2.5;
      }
    });

  const composed = Gesture.Simultaneous(pinch, Gesture.Race(pan, doubleTap));

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <Modal visible animationType="fade" transparent statusBarTranslucent>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: "black" }}>
          <StatusBar hidden />

          {/* Close button */}
          <SafeAreaView
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 10,
              paddingHorizontal: 16,
              paddingTop: 8,
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity
              onPress={onClose}
              style={{
                backgroundColor: "rgba(0,0,0,0.55)",
                borderRadius: 99,
                padding: 8,
              }}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </SafeAreaView>

          {/* Zoomable image */}
          <GestureDetector gesture={composed}>
            <Animated.View
              style={[
                {
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                },
                animatedStyle,
              ]}
            >
              <Image
                source={{ uri }}
                style={{ width: screenWidth, height: screenHeight }}
                resizeMode="contain"
              />
            </Animated.View>
          </GestureDetector>

          {/* Hint */}
          <View
            style={{
              position: "absolute",
              bottom: 32,
              alignSelf: "center",
              backgroundColor: "rgba(255,255,255,0.12)",
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 99,
            }}
          >
          </View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

// ─── Main carousel ────────────────────────────────────────────────────────────
export default function ProductDetailsCarousel({ data }: imageProp) {
  const scrollOffsetValue = useSharedValue<number>(0);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [viewerUri, setViewerUri] = React.useState<string | null>(null);
  const { isWidth } = useBreakPoints({ breakPoint: 475 });

  const imageData =
    data?.map((item, i) => ({ id: `${i}`, image: item.large })) || [];
  const carouselHeight = isWidth ? 600 : 900;

  const renderItem = ({ item }: { item: (typeof imageData)[0] }) => (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={() => setViewerUri(item.image)}
      style={{ flex: 1 }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "#f8fafc",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={{ uri: item.image }}
          style={{ width: screenWidth, height: carouselHeight }}
          resizeMode="cover"
        />
        {/* Tap-to-expand hint */}
        <View
          style={{
            position: "absolute",
            bottom: 16,
            right: 16,
            backgroundColor: "rgba(0,0,0,0.45)",
            borderRadius: 99,
            padding: 7,
          }}
        >
          <Ionicons name="expand-outline" size={18} color="white" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView>
      <View style={{ backgroundColor: "#f9fafb" }}>
        <View style={{ backgroundColor: "white" }}>
          <Carousel
            loop
            width={screenWidth}
            height={carouselHeight}
            autoPlay={false}
            data={imageData}
            defaultScrollOffsetValue={scrollOffsetValue}
            scrollAnimationDuration={200}
            onSnapToItem={setCurrentIndex}
            renderItem={renderItem}
          />

          {/* Dot indicators */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
              paddingVertical: 20,
              backgroundColor: "white",
            }}
          >
            {imageData.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setCurrentIndex(index)}
                style={{
                  borderRadius: 99,
                  width: 8,
                  height: 8,
                  backgroundColor: index === currentIndex ? "#1f2937" : "#d1d5db",
                }}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Full-screen viewer modal */}
      {viewerUri && (
        <ImageViewer uri={viewerUri} onClose={() => setViewerUri(null)} />
      )}
    </GestureHandlerRootView>
  );
}