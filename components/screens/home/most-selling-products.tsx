import Button from "@/components/common/button";
import ProductCard from "@/components/common/product-card";
import useBreakPoints from "@/hooks/useBreajpoints";
import { calculate_discount, calculate_product_price } from "@/lib/utils";
import { useGetMostSelleingProducts } from "@/services/queries/home";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

const MostSellingProducts = () => {
  const { isWidth } = useBreakPoints({ breakPoint: 475 });
  const {
    data: latest_products,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useGetMostSelleingProducts();

  const flat_product = latest_products ? latest_products?.pages?.map((item: any) => item?.data?.list)?.flat() : [];

  const filterd_data =
    flat_product?.map((item: any) => {
      return {
        id: item?.id,
        title: item?.name,
        price: calculate_product_price(item),

        image: item?.images?.large,
     
        slug: item?.slug,
        is_pre_order: item?.is_pre_order,
        is_new_product: item?.is_new_product
      };
    }) || [];




  return (
    <View className="px-4 w-full mb-6">
      <View className="items-center mb-4">
        <Text className="font-dancing-bold text-xl text-primary">
          Floranza Fashion Boutique
        </Text>
        <Text className="font-sam-bold text-xl">Most Selling Products </Text>
      </View>

      <FlashList
        data={filterd_data}
        numColumns={isWidth ? 2 : 3}
        refreshing={isFetchingNextPage}
        renderItem={({ item }) => (
          <View className="flex-1 p-1">
            <ProductCard
              name={item.title}
              // category={item.category}
              price={item.price.min  as any}
              oldPrice={item.price.max !==0 && String(item.price.max) as any}
              discount={item.price.max ? calculate_discount(item.price.min,item.price.max) as number :0 }
              image={item.image}
              slug={item.slug}
            />
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingBottom: 20,
        }}
      />
      {hasNextPage && <View className="items-center">
        <Button disabled={isFetchingNextPage} onPress={()=>fetchNextPage()} size='small' variant='primary' className='max-w-28' >{isFetchingNextPage ? <ActivityIndicator /> : <Text className=' font-sam-bold'>Show more</Text>}</Button>

      </View>}

    </View>
  );
};

export default MostSellingProducts;
