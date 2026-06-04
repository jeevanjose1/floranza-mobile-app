import React, { useEffect, useState } from 'react';
import { Dimensions, Pressable, StatusBar, ViewStyle } from 'react-native';
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type DrawerPosition = 'left' | 'right' | 'bottom';

interface DrawerProps {
  position?: DrawerPosition;
  width?: number;
  height?: number;
  children: React.ReactNode;
  overlayOpacity?: number;
  duration?: number;
  open: boolean;
  onClose?: () => void;
  onOpen?: () => void;
}

const Drawer: React.FC<DrawerProps> = ({
  position = 'left',
  width = 280,
  height = SCREEN_HEIGHT * 0.4,
  children,
  overlayOpacity = 0.5,
  duration = 250,
  open,
  onClose,
  onOpen,
}) => {
  const isVertical = position === 'bottom';
  const size = isVertical ? height : width;
  const initialOffset = position === 'right' ? size : -size;

  const [isVisible, setIsVisible] = useState(open);
  const offset = useSharedValue(open ? 0 : (isVertical ? size : initialOffset));
  const overlayAlpha = useSharedValue(open ? overlayOpacity : 0);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      overlayAlpha.value = withTiming(overlayOpacity, { duration });
      offset.value = withTiming(0, { duration });
      onOpen?.();
    } else {
      overlayAlpha.value = withTiming(0, { duration });
      offset.value = withTiming(
        isVertical ? size : initialOffset, 
        { duration },
        (finished) => {
          if (finished) {
            runOnJS(setIsVisible)(false);
          }
        }
      );
    }
  }, [open]);

  const handleClose = () => onClose?.();

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      const translation = isVertical ? e.translationY : e.translationX;
      const shouldUpdate = isVertical 
        ? translation >= 0 
        : (position === 'left' ? translation <= 0 : translation >= 0);
      
      if (shouldUpdate) offset.value = translation;
    })
    .onEnd((e) => {
      'worklet';
      const translation = isVertical ? e.translationY : e.translationX;
      const threshold = size * 0.3;
      const shouldClose = isVertical 
        ? translation > threshold 
        : (position === 'left' ? translation < -threshold : translation > threshold);

      if (shouldClose) {
        overlayAlpha.value = withTiming(0, { duration });
        offset.value = withTiming(isVertical ? size : initialOffset, { duration }, () => {
          runOnJS(handleClose)();
        });
      } else {
        offset.value = withTiming(0, { duration });
      }
    });

  const drawerStyle = useAnimatedStyle(() => ({
    transform: isVertical 
      ? [{ translateY: offset.value }] 
      : [{ translateX: offset.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    backgroundColor: `rgba(0,0,0,${overlayAlpha.value})`,
  }));

  const containerStyle: ViewStyle = {
    position: 'absolute',
    backgroundColor: 'white',
    ...(isVertical 
      ? { bottom: 0, left: 0, right: 0, height } 
      : position === 'left'
        ? { left: 0, top: 0, bottom: 0, width }
        : { right: 0, top: 0, bottom: 0, width }),
  };

  if (!isVisible) return null;

  const statusBarHeight = StatusBar.currentHeight || 0;

  return (
    <GestureHandlerRootView
      style={{
        position: 'absolute',
        top: -statusBarHeight,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99,
        height: SCREEN_HEIGHT + statusBarHeight,
      }}
    >
      <Animated.View
        style={[
          { 
            position: 'absolute', 
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%', 
            height: '100%',
          },
          overlayStyle,
        ]}
      >
        <Pressable onPress={handleClose} style={{ flex: 1 }} />
      </Animated.View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[containerStyle, drawerStyle]}>
          {children}
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default Drawer;