import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

type Category = {
  id: string;
  name: string;
};

const categories: Category[] = [
  { id: '1', name: 'Kurties' },
  { id: '2', name: 'Bottoms' },
  { id: '3', name: 'Homewares' },
  { id: '4', name: 'Prebook' },
  { id: '5', name: 'Sarees' },
  { id: '6', name: 'Dupattas' },
];

type Props = {};

const Categories: React.FC<Props> = (props) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <View className="py-2 bg-white">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 14, gap: 12 }}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            className={`py-2 px-4 rounded-full border-2 ${
              selectedCategory === category.id
                ? 'bg-primary/5 border-primary/40'
                : 'bg-black/5 border-transparent'
            }`}
            onPress={() => setSelectedCategory(category.id)}
            activeOpacity={0.7}
          >
            <Text
              className={`text-sm font-semibold ${
                selectedCategory === category.id ? 'text-primary' : 'text-black/80'
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