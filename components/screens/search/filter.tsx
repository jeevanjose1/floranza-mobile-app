// ============= FilterDrawer.tsx =============
import { useFilterAttributes, useFilterMaterial } from '@/services/queries/common';
import Checkbox from 'expo-checkbox';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export type FilterOptions = {
    sizes: string[]
    materials: string[]
    priceRanges: string[]
}

type FilterSection = 'sizes' | 'materials' | 'priceRanges' | null

interface FilterDrawerProps {
    onClose: () => void
    selectedFilters: FilterOptions
    setSelectedFilters: (filters: FilterOptions) => void
    onApplyFilters: (filters?: FilterOptions) => void
}

export const Filter: React.FC<FilterDrawerProps> = ({
    onClose,
    selectedFilters,
    onApplyFilters,
    setSelectedFilters
}) => {
    const [activeFilterSection, setActiveFilterSection] = useState<FilterSection>('sizes')
    const [draftFilters, setDraftFilters] = useState<FilterOptions>(selectedFilters)

    // Sync local draft when incoming selectedFilters change (e.g., when reopening drawer)
    useEffect(() => {
        setDraftFilters(selectedFilters)
    }, [selectedFilters])

    const { data: attributes } = useFilterAttributes()
    const { data: materiels } = useFilterMaterial()
    

    // Extract attribute options (sizes) from the first attribute
    const attributes_datas = attributes?.data?.data?.[0]?.attribute_options?.map((item: any) => {
        return { name: item?.name, value: item?.order_code }
    })

    const materials_datas = materiels?.data?.data?.map((item: any) => {
        return { name: item?.name, value: item?.slug }
    })

    const filterData = {
        sizes: attributes_datas || [],
        materials: materials_datas || [],
        priceRanges: [
            { name: '₹500 - ₹1000', value: '500-1000' },
            { name: '₹1000 - ₹2000', value: '1000-2000' },
            { name: '₹2000 - ₹5000', value: '2000-5000' },
        ]
    }

    const filterTitles = {
        sizes: 'Size',
        materials: 'Material',
        priceRanges: 'Price Range'
    }

    const handleFilterSectionClick = (section: keyof FilterOptions) => {
        setActiveFilterSection(activeFilterSection === section ? null : section)
    }

    const handleClose = () => {
        setActiveFilterSection(null)
        onClose()
    }

    const handleApply = () => {
        setSelectedFilters(draftFilters)
        onApplyFilters?.(draftFilters)
        
        setActiveFilterSection(null)
        onClose()
    }

    const handleClearLocal = () => {
        setDraftFilters({ sizes: [], materials: [], priceRanges: [] })
    }

    const handleToggleLocal = (category: keyof FilterOptions, value: string) => {
        setDraftFilters((prev) => {
            const values = prev[category]
            const exists = values.includes(value)

            // Single-select behavior for all categories
            const nextValues = exists ? [] : [value]
            return { ...prev, [category]: nextValues }
        })
    }

    return (
        <View className='flex-1'>
            {/* Header */}
            <View className='flex-row items-center justify-between p-4 border-b border-gray-200'>
                <Text className='text-lg font-bold'>Filters</Text>
                <TouchableOpacity onPress={handleClearLocal}>
                    <Text className='font-semibold underline'>Clear All</Text>
                </TouchableOpacity>
            </View>

            {/* Filter Content - Two Column Layout */}
            <View className='flex-1 flex-row'>
                {/* Left Side - Filter Titles */}
                <View className='w-2/5 border-r border-gray-200 bg-gray-50'>
                    <ScrollView
                        className='flex-1'
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flexGrow: 1 }}
                        nestedScrollEnabled
                        keyboardShouldPersistTaps='handled'
                    >
                        {(Object.keys(filterTitles) as Array<keyof FilterOptions>).map((key) => (
                            <TouchableOpacity
                                key={key}
                                onPress={() => handleFilterSectionClick(key)}
                                className={`p-4 border-b border-gray-200 ${activeFilterSection === key ? 'bg-white' : ''}`}
                            >
                                <Text className={`text-base ${activeFilterSection === key ? 'font-semibold' : ''}`}>
                                    {filterTitles[key]}
                                </Text>
                    {draftFilters[key].length > 0 && (
                                    <Text className='text-xs text-blue-600 mt-1'>
                            {draftFilters[key].length} selected
                                    </Text>
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Right Side - Filter Values */}
                <View className='flex-1'>
                    <ScrollView
                        className='flex-1'
                        contentContainerStyle={{ padding: 16, paddingBottom: 50 }}
                        showsVerticalScrollIndicator={true}
                        nestedScrollEnabled
                        keyboardShouldPersistTaps='handled'
                    >
                        {activeFilterSection && (
                            <>
                                {filterData[activeFilterSection].map((item: any) => (
                        <TouchableOpacity
                            key={item.value}
                            onPress={() => handleToggleLocal(activeFilterSection, item.value)}
                                        className='flex-row items-center justify-between py-3 border-b border-gray-100'
                                    >
                                        <Text className='text-base flex-1'>{item.name}</Text>
                                        <Checkbox
                                value={draftFilters[activeFilterSection].includes(item.value)} 
                                            className='scale-75'
                                            color={'#ED2353'}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </>
                        )}
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
                    onPress={handleApply}
                    className='flex-1 py-2 rounded-lg items-center'
                >
                    <Text className='font-semibold'>APPLY</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}