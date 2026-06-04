import Drawer from "@/components/common/drawer"
import ProductCard from "@/components/common/product-card"
import Header from "@/components/layout/header"
import { Filter, FilterOptions } from "@/components/screens/search/filter"
import useBreakPoints from "@/hooks/useBreajpoints"
import { useDebounce } from "@/hooks/useDebounce"
import { calculate_discount, calculate_product_price } from "@/lib/utils"
import { useGetProductsSearchInfinity } from "@/services/queries/product"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
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
    isRefetching,
    isLoading
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

  // Empty state when no search query
  const renderInitialState = () => (
    <View className='flex-1 justify-center items-center px-8'>
      <Ionicons name='search' size={80} color='#D1D5DB' />
      <Text className='mt-6 text-xl font-semibold text-gray-800'>Start Searching</Text>
      <Text className='mt-2 text-center text-gray-500 text-base'>
        Enter a product name to search through our catalog
      </Text>
    </View>
  )

  // Loading state
  const renderLoadingState = () => (
    <View className='flex-1 justify-center items-center'>
      <ActivityIndicator size='large' color='#ED2353' />
      <Text className='mt-4 text-gray-600 text-base'>Searching products...</Text>
    </View>
  )

  // Empty results state
  const renderEmptyResults = () => (
    <View className='flex-1 justify-center items-center px-8'>
      <MaterialCommunityIcons name='package-variant-closed' size={80} color='#D1D5DB' />
      <Text className='mt-6 text-xl font-semibold text-gray-800'>No Results Found</Text>
      <Text className='mt-2 text-center text-gray-500 text-base'>
        We couldn't find any products matching "{searchQuery}". Try different keywords or adjust your filters.
      </Text>
      {(selectedFilters.sizes.length > 0 || 
        selectedFilters.materials.length > 0 || 
        selectedFilters.priceRanges.length > 0) && (
        <TouchableOpacity 
          onPress={() => setSelectedFilters({ sizes: [], materials: [], priceRanges: [] })}
          className='mt-4 px-6 py-3 border-2 border-primary rounded-lg'
        >
          <Text className='text-primary font-semibold'>Clear Filters</Text>
        </TouchableOpacity>
      )}
    </View>
  )

  // Determine what to render
  const renderContent = () => {
    // No search query - show initial state
    if (!searchQuery) {
      return renderInitialState()
    }

    // Loading initial search results
    if (isLoading) {
      return renderLoadingState()
    }

    // No results found
    if (filterd_data.length === 0) {
      return renderEmptyResults()
    }

    // Show results
    return (
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
    )
  }

  return (
    <SafeAreaView className='flex-1 bg-gray-50' edges={['top']}>
      <Header title='Search' type="account" />
      
      {/* Search Header */}
      <View className="bg-white px-4 shadow-sm">
        <View className="flex-row items-center bg-gray-100 rounded-md px-4 py-1">
          <Ionicons size={20} name="search" color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-3 text-base text-gray-800"
            placeholder="Search products..."
            placeholderTextColor="#9CA3AF"
            value={textInput}
            onChangeText={handleChangeText}
          />
          {textInput.length > 0 && (
            <Pressable onPress={clearSearch} className="p-1">
              <Ionicons size={20} name="close" color="#9CA3AF" />
            </Pressable>
          )}
        </View>
        <View className="pt-2 pb-3">
          {searchQuery && filterd_data.length > 0 && (
            <Text className="text-sm text-gray-600">
              {filterd_data.length} {filterd_data.length === 1 ? 'result' : 'results'} found
            </Text>
          )}
        </View>
      </View>

      {/* Product List or Empty State */}
      <View className="flex-1">
        {renderContent()}

        {/* Filter Button - Only show when there are results or searching */}
        {(searchQuery && filterd_data.length > 0) && (
          <View className='w-full flex-row justify-between bg-white h-20 px-4 py-3'>
            <View className='flex-1 flex-row justify-center'>
              <TouchableOpacity onPress={handleOpenFilter}>
                <View className='flex-1 gap-2 flex-row justify-center items-center'>
                  <Ionicons name='filter' size={24} />
                  <Text className='text-base'>Filter</Text>
                  {(selectedFilters.sizes.length > 0 || 
                    selectedFilters.materials.length > 0 || 
                    selectedFilters.priceRanges.length > 0) && (
                    <View className='bg-primary rounded-full w-5 h-5 items-center justify-center'>
                      <Text className='text-white text-xs font-bold'>
                        {selectedFilters.sizes.length + selectedFilters.materials.length + selectedFilters.priceRanges.length}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
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