import { media } from "@/constants/medias";
import useBreakPoints from "@/hooks/useBreajpoints";
import * as React from "react";
import { Dimensions, Image, TouchableOpacity, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";

const { width: screenWidth } = Dimensions.get("window");

const products = [
    { id: '1',  image: media.kurti },
    { id: '2', image: media.saree },
    { id: '3', image: media.dupattas },
    { id: '4', image: media.home_were },
    { id: '5', image: media.pree_book },
    { id: '6', image: media.saree }
  ]

export default function ProductDetailsCarousel() {
  const scrollOffsetValue = useSharedValue<number>(0);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const { isWidth } = useBreakPoints({ breakPoint: 475 })
 const coursolHeight = isWidth ? 600 : 900
   const renderItem = ({ item }: { item: typeof products[0] }) => {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center ">
        <Image
          source={item.image}
          style={{ width: screenWidth, height: coursolHeight }}
          resizeMode="cover"
        />
      </View>
    );
  };

 

  return (
    <View className="flex-1 bg-gray-50 mb-2">
      {/* Carousel Container */}
      <View className="bg-white">
        <Carousel
          loop={true}
          width={screenWidth}
          height={coursolHeight}
          autoPlay={false}
          data={products}
          defaultScrollOffsetValue={scrollOffsetValue}
          scrollAnimationDuration={200}
          onSnapToItem={(index) => setCurrentIndex(index)}
          renderItem={renderItem}
        />

        <View className="flex-row justify-center items-center gap-3 py-6 bg-white">
          {products.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setCurrentIndex(index);
              }}
              className={`rounded-full w-2 h-2 ${
                index === currentIndex
                  ?  "bg-gray-800"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </View>
      </View>

      
    </View>
  );
}