import Drawer from '@/components/common/drawer'
import ProductCard from '@/components/common/product-card'
import Header from '@/components/layout/header'
import Categories from '@/components/screens/product-list/categories'
import { Filter, FilterOptions } from '@/components/screens/product-list/filter'
import { Sort } from '@/components/screens/product-list/sort'
import useBreakPoints from '@/hooks/useBreajpoints'
import { calculate_discount, calculate_product_price } from '@/lib/utils'
import { useGetProductsInfinity } from '@/services/queries/product'
import { Ionicons } from '@expo/vector-icons'
import { FlashList } from '@shopify/flash-list'
import { useLocalSearchParams } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { ActivityIndicator, Dimensions, RefreshControl, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type SortOption = 'trending' | 'recommended' | 'newly_launched' | 'price_low' | 'price_high'

const ProductList = () => {
  const [sortOpen, setSortOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const { slug } = useLocalSearchParams()
  

  const { isWidth } = useBreakPoints({ breakPoint: 475 })
  const [selectedSort, setSelectedSort] = useState<SortOption>('trending')
  const [selectedFilters, setSelectedFilters] = useState<FilterOptions>({
    sizes: [],
    materials: [],
    priceRanges: []
  })
  
  const {
    data: product,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching
  } = useGetProductsInfinity({ slug,filter: {
      material: selectedFilters?.materials[0],
      size: selectedFilters?.sizes[0],
      min_price: selectedFilters.priceRanges?.[0]?.split('-')[0],
      max_price: selectedFilters.priceRanges?.[0]?.split('-')[1],
    }, })

  const catogery = product?.pages?.[0]?.data?.category || {}
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

  const handleCloseSort = () => setSortOpen(false)
  const handleOpenFilter = () => setFilterOpen(true)
  const handleCloseFilter = () => setFilterOpen(false)

  

  const handleApplyFilters = () => {
    handleCloseFilter()
  }

  const handleSortSelect = (value: SortOption) => {
    setSelectedSort(value)
  }

  const { height: SCREEN_HEIGHT } = Dimensions.get('window')
  const numColumns = isWidth ? 2 : 3

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const renderFooter = () => {
    if (!isFetchingNextPage) return null
    return (
      <View className='py-4 items-center'>
        <ActivityIndicator size='large' color='#ED2353' />
      </View>
    )
  }

  return (
    <SafeAreaView className='flex-1 bg-gray-50' edges={['top']}>
      <Header type='product_list' title={catogery?.name} />
      <Categories />

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
        {/* <View className='flex-1 flex-row justify-center'>
          <TouchableOpacity onPress={handleOpenSort}>
            <View className='gap-2 items-center flex-row'>
              <AntDesign name='sort-ascending' size={20} color='black' />
              <Text>Sort</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View className='w-[.5px] h-8 bg-black/10' /> */}

        <View className='flex-1 flex-row justify-center'>
          <TouchableOpacity onPress={handleOpenFilter}>
            <View className='flex-1 gap-2 flex-row justify-center'>
              <Ionicons name='filter' size={24} />
              <Text>Filter</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <Drawer position='bottom' open={sortOpen} onClose={handleCloseSort}>
        <Sort onClose={handleCloseSort} selectedSort={selectedSort} onSortSelect={handleSortSelect} />
      </Drawer>

      <Drawer position='bottom' open={filterOpen} onClose={handleCloseFilter} height={SCREEN_HEIGHT * 0.9}>
        <Filter
          onClose={handleCloseFilter}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          onApplyFilters={handleApplyFilters}
        />
      </Drawer>
    </SafeAreaView>
  )
}

export default ProductList