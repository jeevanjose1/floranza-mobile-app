import Drawer from "@/components/common/drawer"
import ProductCard from "@/components/common/product-card"
import Header from "@/components/layout/header"
import { Filter, FilterOptions } from "@/components/screens/search/filter"
import useBreakPoints from "@/hooks/useBreajpoints"
import { useDebounce } from "@/hooks/useDebounce"
import { calculate_discount, calculate_product_price } from "@/lib/utils"
import { useGetProductsSearchInfinity } from "@/services/queries/product"
import { Ionicons } from "@expo/vector-icons"
import { FlashList } from "@shopify/flash-list"
import { useCallback, useState } from "react"
import { ActivityIndicator, Dimensions, Pressable, RefreshControl, Text, TextInput, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("")
  const [textInput, setTextInput] = useState("") // for immediate typing

  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<FilterOptions>({
    sizes: [],
    materials: [],
    priceRanges: []
  })
  const [refreshing, setRefreshing] = useState(false)

  const {
    data: product,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching
  } = useGetProductsSearchInfinity({
    filter: {
      material: selectedFilters?.materials[0],
      size: selectedFilters?.sizes[0],
      min_price: selectedFilters.priceRanges?.[0]?.split('-')[0],
      max_price: selectedFilters.priceRanges?.[0]?.split('-')[1],
      name: searchQuery
    },
    enabled: searchQuery !== ''
  })

  const flat_product = product ? product?.pages?.map((item: any) => item?.data?.products)?.flat() : []

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
      }
    }) || []

  const handleOpenFilter = () => setFilterOpen(true)
  const handleCloseFilter = () => setFilterOpen(false)
  const { height: SCREEN_HEIGHT } = Dimensions.get('window')

  const { isWidth } = useBreakPoints({ breakPoint: 475 })

  const numColumns = isWidth ? 2 : 3
  const debouncedSetSearchQuery = useDebounce((text: string) => {
    setSearchQuery(text)
  }, 1000)
  const handleChangeText = (text: string) => {
    setTextInput(text)
    debouncedSetSearchQuery(text)
  }


  const clearSearch = () => {
    setTextInput("")
    setSearchQuery("")
  }

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])



  const handleApplyFilters = () => {
    handleCloseFilter()
  }



  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }
  const renderFooter = () => {
    if (!isFetchingNextPage) return null
    return (
      <View className='py-4 items-center'>
        <ActivityIndicator size='large' color='#ED2353' />
      </View>
    )
  }

  return (
    <SafeAreaView className='flex-1 ' edges={['top']}>
      <Header title='Search' type="account" />
      {/* Search Header */}
      <View className="bg-white px-4   shadow-sm">
        <View className="flex-row items-center bg-gray-100 rounded-md px-4 py-1">
          <Ionicons size={20} name="search" color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-3 text-base text-gray-800"
            placeholder="Search products..."
            placeholderTextColor="#9CA3AF"
            value={textInput}
            onChangeText={handleChangeText}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={clearSearch} className="p-1">
              <Ionicons size={20} name="close" color="#9CA3AF" />
            </Pressable>
          )}
        </View>
        <View className=" pt-2 pb-3">
          <Text className="text-sm text-gray-600">
            {/* {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'} found */}
          </Text>
        </View>
      </View>

      {/* Product List */}
      <View className="flex-1 ">
        <FlashList
          data={filterd_data}
          numColumns={numColumns}
          key={numColumns}
          className='px-4 mt-2'
          renderItem={({ item }) => (
            <View className='flex-1 p-1'>
              <ProductCard
                name={item?.title}
                price={item.price?.min as any}
                oldPrice={item.price?.max !== 0 && String(item.price?.max) as any}
                discount={item.price?.max ? calculate_discount(item?.price?.min, item?.price?.max) as number : 0}
                image={item.image}
                slug={item.slug}
              />
            </View>
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing || isRefetching}
              onRefresh={onRefresh}
              colors={['#ED2353']}
              tintColor='#ED2353'
              title='Pull to refresh'
              titleColor='#ED2353'
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />

        <View className='w-full flex-row justify-between bg-white h-20 px-4 py-3'>


          <View className='flex-1 flex-row justify-center'>
            <TouchableOpacity onPress={handleOpenFilter}>
              <View className='flex-1 gap-2 flex-row justify-center'>
                <Ionicons name='filter' size={24} />
                <Text>Filter</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Drawer position='bottom' open={filterOpen} onClose={handleCloseFilter} height={SCREEN_HEIGHT * 0.7}>
        <Filter
          onClose={handleCloseFilter}
          selectedFilters={selectedFilters}
          onApplyFilters={handleApplyFilters}
          setSelectedFilters={setSelectedFilters}
        />
      </Drawer>
    </SafeAreaView>
  )
}