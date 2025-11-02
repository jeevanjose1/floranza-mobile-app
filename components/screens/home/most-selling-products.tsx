import Button from "@/components/common/button";
import ProductCard from "@/components/common/product-card";
import { media } from "@/constants/medias";
import useBreakPoints from "@/hooks/useBreajpoints";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import { Text, View } from "react-native";

const MostSellingProducts = () => {
  const { isWidth } = useBreakPoints({ breakPoint: 475 });

  const products = [
    {
      id: "3",
      name: "Cotton Anarkali Suit Set",
      category: "Suit",
      price: 1299,
      oldPrice: 1699,
      discount: 23,
      image: media.dupattas,
    },
    {
      id: "1",
      name: "Florista Kurti in Fox Georgette - Off-White",
      category: "Kurti",
      price: 899,
      oldPrice: 1099,
      discount: 20,
      image: media.kurti,
    },
    {
      id: "2",
      name: "Elegant Silk Saree with Zari Border",
      category: "Saree",
      price: 1499,
      oldPrice: 1999,
      discount: 25,
      image: media.saree,
    },
    {
      id: "6",
      name: "Casual Cotton Dress - Pink Floral",
      category: "Dress",
      price: 799,
      oldPrice: 999,
      discount: 20,
      image: media.saree,
    },

    {
      id: "4",
      name: "Printed Rayon Kurta with Dupatta",
      category: "Kurta Set",
      price: 999,
      oldPrice: 1299,
      discount: 18,
      image: media.home_were,
    },
    {
      id: "5",
      name: "Designer Lehenga Choli with Embroidery",
      category: "Lehenga",
      price: 2999,
      oldPrice: 3999,
      discount: 25,
      image: media.pree_book,
    },

  ];

  return (
    <View className="px-4 w-full mb-6">
      <View className="items-center mb-4">
        <Text className="font-dancing-bold text-xl text-primary">
          Floranza Fashion Boutique
        </Text>
        <Text className="font-sam-bold text-xl">Most Selling Products </Text>
      </View>

      <FlashList
        data={products}
        numColumns={isWidth ? 2 : 3}
        // estimatedItemSize={250}
        renderItem={({ item }) => (
          <View className="flex-1 p-1">
            <ProductCard
              name={item.name}
              category={item.category}
              price={item.price}
              oldPrice={item.oldPrice}
              discount={item.discount}
              image={item.image}
            />
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingBottom: 20,
        }}
      />
      <View className="items-center">
        <Button size='small' variant='primary' className='max-w-28' ><Text className=' font-sam-bold'>Show all</Text></Button>

      </View>

    </View>
  );
};

export default MostSellingProducts;
