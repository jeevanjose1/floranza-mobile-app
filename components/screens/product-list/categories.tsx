import { useFilterCatogery } from '@/services/queries/common';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

type Category = {
  name: string;
  value: string;
};



type Props = {};

const Categories: React.FC<Props> = (props) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const itemPositions = useRef<{ [key: string]: number }>({});
  const { slug } = useLocalSearchParams()
  const router = useRouter()

  const { data: catogeries } = useFilterCatogery()

  const category_datas = catogeries?.data?.data?.map((item: any) => {
    return { name: item?.name, value: item?.slug }
  }) || []

  useEffect(() => {
    if (typeof slug === 'string') {
      setSelectedCategory(slug)
    }
  }, [slug])

  // Scroll to selected category when it changes
  useEffect(() => {
    if (selectedCategory && category_datas.length > 0 && scrollViewRef.current) {
      // Small delay to ensure layout is complete
      setTimeout(() => {
        const position = itemPositions.current[selectedCategory];
        if (position !== undefined && scrollViewRef.current) {
          // Scroll to position with some offset to center it better
          scrollViewRef.current.scrollTo({
            x: Math.max(0, position - 100),
            animated: true,
          });
        }
      }, 200);
    }
  }, [selectedCategory, category_datas]);

   
  return (
    <View className="py-2 bg-white">
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 14, gap: 12 }}
      >
        {category_datas?.map((category:Category, index: number) => (
          <TouchableOpacity
            key={category.value}
            onLayout={(event) => {
              const { x } = event.nativeEvent.layout;
              itemPositions.current[category.value] = x;
            }}
            className={`py-2 px-4 rounded-full border-2 ${
              selectedCategory === category.value
                ? 'bg-primary/5 border-primary/40'
                : 'bg-black/5 border-transparent'
            }`}
            onPress={() => {
              setSelectedCategory(category.value)
              router.replace({ pathname: '/product-list', params: { slug: category.value } })
            }}
            activeOpacity={0.7}
          >
            <Text
              className={`text-sm font-semibold ${
                selectedCategory === category.value ? 'text-primary' : 'text-black/80'
              }`}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default Categories;