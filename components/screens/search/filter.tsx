// ============= FilterDrawer.tsx =============
import { Checkbox } from 'expo-checkbox';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export type FilterOptions = {
    sizes: string[]
    materials: string[]
    categories: string[]
    priceRanges: string[]
}

type FilterSection = 'sizes' | 'materials' | 'categories' | 'priceRanges' | null

interface FilterDrawerProps {
    onClose: () => void
    selectedFilters: FilterOptions
    onFilterToggle: (category: keyof FilterOptions, value: string) => void
    onClearFilters: () => void
    onApplyFilters: () => void
}

// const Checkbox = ({ checked }: { checked: boolean }) => (
//     <View className={`w-5 h-5 rounded border-2 items-center justify-center ${checked ? 'bg-blue-600 border-blue-600' : 'border-gray-400'}`}>
//         {checked && <Ionicons name="checkmark" size={16} color="white" />}
//     </View>
// )

export const Filter: React.FC<FilterDrawerProps> = ({
    onClose,
    selectedFilters,
    onFilterToggle,
    onClearFilters,
    onApplyFilters
}) => {
    const [activeFilterSection, setActiveFilterSection] = useState<FilterSection>('sizes')

    const filterData = {
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
        materials: ['Cotton', 'Polyester', 'Silk', 'Wool', 'Linen', 'Denim', 'Leather'],
        categories: ['T-Shirts', 'Shirts', 'Jeans', 'Trousers', 'Jackets', 'Dresses', 'Shoes'],
        priceRanges: ['Under ₹500', '₹500 - ₹1000', '₹1000 - ₹2000', '₹2000 - ₹5000', 'Above ₹5000']
    }

    const filterTitles = {
        sizes: 'Size',
        materials: 'Material',
        categories: 'Category',
        priceRanges: 'Price Range'
    }

    const handleFilterSectionClick = (section: keyof FilterOptions) => {
        setActiveFilterSection(activeFilterSection === section ? null : section)
    }

    const handleClose = () => {
        setActiveFilterSection(null)
        onClose()
    }

    return (
        
            <View className='flex-1'>
                {/* Header */}
                <View className='flex-row items-center justify-between p-4 border-b border-gray-200'>
                    <Text className='text-lg font-bold'>Filters</Text>
                    <TouchableOpacity onPress={onClearFilters}>
                        <Text className=' font-semibold underline'>Clear All</Text>
                    </TouchableOpacity>
                </View>

                {/* Filter Content - Two Column Layout */}
                <View className='flex-1 flex-row'>
                    {/* Left Side - Filter Titles */}
                    <View className='w-2/5 border-r border-gray-200 bg-gray-50'>
                        <ScrollView>
                            {(Object.keys(filterTitles) as Array<keyof FilterOptions>).map((key) => (
                                <TouchableOpacity
                                    key={key}
                                    onPress={() => handleFilterSectionClick(key)}
                                    className={`p-4 border-b border-gray-200 ${activeFilterSection === key ? 'bg-white' : ''}`}
                                >
                                    <Text className={`text-base ${activeFilterSection === key ? 'font-semibold' : ''}`}>
                                        {filterTitles[key]}
                                    </Text>
                                    {selectedFilters[key].length > 0 && (
                                        <Text className='text-xs text-blue-600 mt-1'>
                                            {selectedFilters[key].length} selected
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Right Side - Filter Values */}
                    <View className='flex-1'>
                        <ScrollView className='p-4'>
                            {activeFilterSection && (
                                <>
                                    {filterData[activeFilterSection].map((value) => (
                                        <TouchableOpacity
                                            key={value}
                                            onPress={() => onFilterToggle(activeFilterSection, value)}
                                            className='flex-row items-center justify-between py-3 border-b border-gray-100'
                                        >
                                            <Text className='text-base flex-1'>{value}</Text>

                                            <Checkbox value={selectedFilters[activeFilterSection].includes(value)} className='scale-75' color={'#ED2353'} />
                                        </TouchableOpacity>
                                    ))}
                                </>
                            ) }
                        </ScrollView>
                    </View>
                </View>

                {/* Bottom Actions */}
                <View className='flex-row p-2 h-24 border-t-[1px] border-black/5 gap-3'>
                    <TouchableOpacity
                        onPress={handleClose}
                        className='flex-1 py-2 rounded-lg items-center'
                    >
                        <Text className='font-semibold text-gray-800'>CLOSE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onApplyFilters}
                        className='flex-1 py-2 rounded-lg items-center'
                    >
                        <Text className='font-semibold '>APPLY</Text>
                    </TouchableOpacity>
                </View>
            </View>
  
    )
}

