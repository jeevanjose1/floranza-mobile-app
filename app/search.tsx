import Drawer from "@/components/common/drawer"
import ProductCard from "@/components/common/product-card"
import Header from "@/components/layout/header"
import { Filter, FilterOptions } from "@/components/screens/search/filter"
import { media } from "@/constants/medias"
import useBreakPoints from "@/hooks/useBreajpoints"
import { Ionicons } from "@expo/vector-icons"
import { FlashList } from "@shopify/flash-list"
import { useCallback, useState } from "react"
import { Dimensions, Pressable, RefreshControl, Text, TextInput, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

// Mock product data
const products = [
  { id: '1', name: 'Florista Kurti in Fox Georgette - Off-White', category: 'Kurti', price: 899, oldPrice: 1099, discount: 20, image: media.kurti },
  { id: '2', name: 'Elegant Silk Saree with Zari Border', category: 'Saree', price: 1499, oldPrice: 1999, discount: 25, image: media.saree },
  { id: '3', name: 'Cotton Anarkali Suit Set', category: 'Suit', price: 1299, oldPrice: 1699, discount: 23, image: media.dupattas },
  { id: '4', name: 'Printed Rayon Kurta with Dupatta', category: 'Kurta Set', price: 999, oldPrice: 1299, discount: 18, image: media.home_were },
  { id: '5', name: 'Designer Lehenga Choli with Embroidery', category: 'Lehenga', price: 2999, oldPrice: 3999, discount: 25, image: media.pree_book },
  { id: '6', name: 'Casual Cotton Dress - Pink Floral', category: 'Dress', price: 799, oldPrice: 999, discount: 20, image: media.saree }
]

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<FilterOptions>({
    sizes: [],
    materials: [],
    categories: [],
    priceRanges: []
  })
  const [refreshing, setRefreshing] = useState(false)
  const handleOpenFilter = () => setFilterOpen(true)
  const handleCloseFilter = () => setFilterOpen(false)
  const { height: SCREEN_HEIGHT } = Dimensions.get('window')

  const { isWidth } = useBreakPoints({ breakPoint: 475 })

  const numColumns = isWidth ? 2 : 3

  const handleSearch = (text: string) => {
    setSearchQuery(text)
    if (text.trim() === "") {
      setFilteredProducts(products)
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(text.toLowerCase()) ||
        product.category.toLowerCase().includes(text.toLowerCase())
      )
      setFilteredProducts(filtered)
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    setFilteredProducts(products)
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

  const handleFilterToggle = (category: keyof FilterOptions, value: string) => {
     setSelectedFilters(prev => ({
       ...prev,
       [category]: prev[category].includes(value)
         ? prev[category].filter(item => item !== value)
         : [...prev[category], value]
     }))
   }

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    // Simulate API call
    setTimeout(() => {
      console.log('Reloading products...')
      setRefreshing(false)
    }, 1500)
  }, [])

  return (
    <SafeAreaView className='flex-1 ' edges={[ 'top']}>
      <Header title='Search' type="account" />
      {/* Search Header */}
      <View className="bg-white px-4   shadow-sm">
        <View className="flex-row items-center bg-gray-100 rounded-md px-4 py-1">
          <Ionicons size={20} name="search" color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-3 text-base text-gray-800"
            placeholder="Search products..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={clearSearch} className="p-1">
              <Ionicons size={20} name="close" color="#9CA3AF" />
            </Pressable>
          )}
        </View>
        <View className=" pt-2 pb-3">
        <Text className="text-sm text-gray-600">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'} found
        </Text>
      </View>
      </View>

      {/* Results Count */}
      

      {/* Product List */}
      <View className="flex-1 ">
        <FlashList
          data={products}
          numColumns={numColumns}
          key={numColumns}
          className='px-3 mt-2'
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
          onFilterToggle={handleFilterToggle}
          onClearFilters={handleClearFilters}
          onApplyFilters={handleApplyFilters}
        />
      </Drawer>
    </SafeAreaView>
  )
}