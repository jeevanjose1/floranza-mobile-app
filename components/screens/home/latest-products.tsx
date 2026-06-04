import Button from "@/components/common/button";
import ProductCard from "@/components/common/product-card";
import useBreakPoints from "@/hooks/useBreajpoints";
import { calculate_discount, calculate_product_price } from "@/lib/utils";
import { useGetLatestProducts } from "@/services/queries/home";
import { FlashList } from "@shopify/flash-list";
import React, { useMemo } from "react";
import { ActivityIndicator, Text, View } from "react-native";

const LatestProducts = () => {
  const { isWidth } = useBreakPoints({ breakPoint: 475 });
  const {
    data: latest_products,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetLatestProducts();

  const filterd_data = useMemo(() => {
    const flat_product = latest_products
      ? latest_products?.pages?.map((item: any) => item?.data?.list)?.flat()
      : [];
    return (
      flat_product?.map((item: any) => ({
        id: item?.id,
        title: item?.name,
        price: calculate_product_price(item),
        image: item?.images?.large,
        slug: item?.slug,
        is_pre_order: item?.is_pre_order,
        is_new_product: item?.is_new_product,
      })) || []
    );
  }, [latest_products]);

  return (
    <View className="px-4 w-full mb-8">
      <View className="items-center mb-4">
        <Text className="font-dancing-bold text-xl text-primary">
          Floranza Fashion Boutique
        </Text>
        <Text className="font-sam-bold text-xl">Latest Products</Text>
      </View>

      <FlashList
        data={filterd_data}
        numColumns={isWidth ? 2 : 3}
        // @ts-ignore
        estimatedItemSize={250}
        refreshing={isFetchingNextPage}
        renderItem={({ item }) => (
          <View className="flex-1 p-1">
            <ProductCard
              name={item.title}
              // category={item.category}
              price={item.price.min as any}
              oldPrice={item.price.max !== 0 && (String(item.price.max) as any)}
              discount={
                item.price.max
                  ? (calculate_discount(
                      item.price.min,
                      item.price.max,
                    ) as number)
                  : 0
              }
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
      {hasNextPage && (
        <View className="items-center">
          <Button
            disabled={isFetchingNextPage}
            onPress={() => fetchNextPage()}
            size="small"
            variant="primary"
            className="max-w-28"
          >
            {isFetchingNextPage ? (
              <ActivityIndicator />
            ) : (
              <Text className=" font-sam-bold">Show more</Text>
            )}
          </Button>
        </View>
      )}
    </View>
  );
};

export default LatestProducts;
