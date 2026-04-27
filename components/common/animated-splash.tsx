import React, { useEffect, useCallback } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withSpring,
  Easing,
  runOnJS,
  interpolate,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface AnimatedSplashProps {
  onAnimationComplete: () => void;
}

export default function AnimatedSplash({ onAnimationComplete }: AnimatedSplashProps) {
  // Animation progress values
  const iconScale = useSharedValue(0.3);
  const iconOpacity = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);
  const taglineTranslateY = useSharedValue(20);
  const containerOpacity = useSharedValue(1);
  const shimmerProgress = useSharedValue(0);

  const handleComplete = useCallback(() => {
    onAnimationComplete();
  }, [onAnimationComplete]);

  useEffect(() => {
    // Phase 1: Icon fades in and scales up with a spring bounce
    iconOpacity.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
    iconScale.value = withSpring(1, {
      damping: 12,
      stiffness: 100,
      mass: 0.8,
    });

    // Phase 2: Shimmer effect across the icon
    shimmerProgress.value = withDelay(
      700,
      withTiming(1, { duration: 800, easing: Easing.inOut(Easing.cubic) })
    );

    // Phase 3: Tagline slides up and fades in
    taglineOpacity.value = withDelay(
      900,
      withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) })
    );
    taglineTranslateY.value = withDelay(
      900,
      withSpring(0, { damping: 14, stiffness: 120 })
    );

    // Phase 4: Entire splash fades out
    containerOpacity.value = withDelay(
      2200,
      withTiming(0, {
        duration: 400,
        easing: Easing.in(Easing.cubic),
      }, (finished) => {
        if (finished) {
          runOnJS(handleComplete)();
        }
      })
    );
  }, []);

  // Animated styles
  const iconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{ scale: iconScale.value }],
  }));

  const taglineAnimatedStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineTranslateY.value }],
  }));

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const shimmerAnimatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      shimmerProgress.value,
      [0, 1],
      [-SCREEN_WIDTH, SCREEN_WIDTH]
    );
    return {
      transform: [{ translateX }],
    };
  });

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      {/* Subtle radial gradient effect using overlays */}
      <View style={styles.backgroundGlow} />

      {/* Icon with animation */}
      <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
        <Image
          source={require("../../assets/images/icon.png")}
          style={styles.icon}
          resizeMode="contain"
        />

        {/* Shimmer overlay */}
        <View style={styles.shimmerMask}>
          <Animated.View style={[styles.shimmer, shimmerAnimatedStyle]} />
        </View>
      </Animated.View>

      {/* Tagline */}
      <Animated.View style={[styles.taglineContainer, taglineAnimatedStyle]}>
        <Animated.Text style={styles.tagline}>Fashion Boutique</Animated.Text>
      </Animated.View>

      {/* Decorative dots */}
      <View style={styles.dotsContainer}>
        {[0, 1, 2].map((i) => (
          <DotAnimation key={i} index={i} />
        ))}
      </View>
    </Animated.View>
  );
}

function DotAnimation({ index }: { index: number }) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    const delay = 1400 + index * 150;
    opacity.value = withDelay(
      delay,
      withSequence(
        withTiming(1, { duration: 300 }),
        withDelay(400, withTiming(0.6, { duration: 200 }))
      )
    );
    scale.value = withDelay(
      delay,
      withSpring(1, { damping: 10, stiffness: 150 })
    );
  }, []);

  const dotStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={[styles.dot, dotStyle]} />;
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  backgroundGlow: {
    position: "absolute",
    width: SCREEN_WIDTH * 1.5,
    height: SCREEN_WIDTH * 1.5,
    borderRadius: SCREEN_WIDTH * 0.75,
    backgroundColor: "rgba(237, 35, 83, 0.03)",
    top: SCREEN_HEIGHT * 0.5 - SCREEN_WIDTH * 0.75,
    left: SCREEN_WIDTH * 0.5 - SCREEN_WIDTH * 0.75,
  },
  iconContainer: {
    width: 180,
    height: 180,
    borderRadius: 40,
    overflow: "hidden",
    // Subtle shadow
    ...Platform.select({
      ios: {
        shadowColor: "#ED2353",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.2,
        shadowRadius: 24,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  icon: {
    width: 180,
    height: 180,
    borderRadius: 40,
  },
  shimmerMask: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
    borderRadius: 40,
  },
  shimmer: {
    width: 80,
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    transform: [{ skewX: "-20deg" }],
  },
  taglineContainer: {
    marginTop: 24,
    alignItems: "center",
  },
  tagline: {
    fontSize: 16,
    letterSpacing: 4,
    color: "#9B1B3F",
    fontWeight: "300",
    textTransform: "uppercase",
  },
  dotsContainer: {
    flexDirection: "row",
    marginTop: 32,
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ED2353",
  },
});
