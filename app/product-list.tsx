import Drawer from '@/components/common/drawer'
import ProductCard from '@/components/common/product-card'
import Header from '@/components/layout/header'
import Categories from '@/components/screens/product-list/categories'
import { Filter, FilterOptions } from '@/components/screens/product-list/filter'
import { Sort } from '@/components/screens/product-list/sort'
import { media } from '@/constants/medias'
import useBreakPoints from '@/hooks/useBreajpoints'
import { Ionicons } from '@expo/vector-icons'
import AntDesign from '@expo/vector-icons/AntDesign'
import { FlashList } from '@shopify/flash-list'
import React, { useCallback, useState } from 'react'
import { Dimensions, RefreshControl, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type SortOption = 'trending' | 'recommended' | 'newly_launched' | 'price_low' | 'price_high'

const ProductList = () => {
  const [sortOpen, setSortOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const { isWidth } = useBreakPoints({ breakPoint: 475 })
  const [selectedSort, setSelectedSort] = useState<SortOption>('trending')
  const [selectedFilters, setSelectedFilters] = useState<FilterOptions>({
    sizes: [],
    materials: [],
    categories: [],
    priceRanges: []
  })

  const handleOpenSort = () => setSortOpen(true)
  const handleCloseSort = () => setSortOpen(false)
  const handleOpenFilter = () => setFilterOpen(true)
  const handleCloseFilter = () => setFilterOpen(false)

  const handleFilterToggle = (category: keyof FilterOptions, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }))
  }

  const handleClearFilters = () => {
    setSelectedFilters({
      sizes: [],
      materials: [],
      categories: [],
      priceRanges: []
    })
  }

  const handleApplyFilters = () => {
    console.log('Applied filters:', selectedFilters)
    handleCloseFilter()
  }

  const handleSortSelect = (value: SortOption) => {
    setSelectedSort(value)
  }

  const { height: SCREEN_HEIGHT } = Dimensions.get('window')
  const numColumns = isWidth ? 2 : 3

  const products = [
    { id: '1', name: 'Florista Kurti in Fox Georgette - Off-White', category: 'Kurti', price: 899, oldPrice: 1099, discount: 20, image: media.kurti },
    { id: '2', name: 'Elegant Silk Saree with Zari Border', category: 'Saree', price: 1499, oldPrice: 1999, discount: 25, image: media.saree },
    { id: '3', name: 'Cotton Anarkali Suit Set', category: 'Suit', price: 1299, oldPrice: 1699, discount: 23, image: media.dupattas },
    { id: '4', name: 'Printed Rayon Kurta with Dupatta', category: 'Kurta Set', price: 999, oldPrice: 1299, discount: 18, image: media.home_were },
    { id: '5', name: 'Designer Lehenga Choli with Embroidery', category: 'Lehenga', price: 2999, oldPrice: 3999, discount: 25, image: media.pree_book },
    { id: '6', name: 'Casual Cotton Dress - Pink Floral', category: 'Dress', price: 799, oldPrice: 999, discount: 20, image: media.saree }
  ]

  // 🔄 Pull-to-refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true)
    // Simulate API call
    setTimeout(() => {
      console.log('Reloading products...')
      setRefreshing(false)
    }, 1500)
  }, [])

  return (
    <SafeAreaView className='flex-1 bg-gray-50' edges={['top']}>
      <Header type='product_list' />
      <Categories />

      <FlashList
        data={products}
        numColumns={numColumns}
        key={numColumns}
        className='px-4 mt-2'
        renderItem={({ item }) => (
          <View className='flex-1 p-1'>
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#ED2353']}
            tintColor='#ED2353'
            title='Pull to refresh'
            titleColor='#ED2353'
          />
        }
      />

      <View className='w-full flex-row justify-between bg-white h-20 px-4 py-3'>
        <View className='flex-1 flex-row justify-center'>
          <TouchableOpacity onPress={handleOpenSort}>
            <View className='gap-2 items-center flex-row'>
              <AntDesign name='sort-ascending' size={20} color='black' />
              <Text>Sort</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View className='w-[.5px] h-8 bg-black/10' />

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
          onFilterToggle={handleFilterToggle}
          onClearFilters={handleClearFilters}
          onApplyFilters={handleApplyFilters}
        />
      </Drawer>
    </SafeAreaView>
  )
}

export default ProductList
