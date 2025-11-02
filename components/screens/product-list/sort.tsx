import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

type SortOption = 'trending' | 'recommended' | 'newly_launched' | 'price_low' | 'price_high'

interface SortDrawerProps {
    onClose: () => void
    selectedSort: SortOption
    onSortSelect: (value: SortOption) => void
}

const RadioButton = ({ selected }: { selected: boolean }) => (
    <View className='w-5 h-5 rounded-full border-2 border-primary items-center justify-center'>
        {selected && <View className='w-3 h-3 rounded-full bg-primary' />}
    </View>
)

export const Sort: React.FC<SortDrawerProps> = ({
    onClose,
    selectedSort,
    onSortSelect
}) => {
    const sortOptions = [
        { label: 'Trending', value: 'trending' as SortOption },
        { label: 'Recommended', value: 'recommended' as SortOption },
        { label: 'Newly Launched', value: 'newly_launched' as SortOption },
        { label: 'Price: Low to High', value: 'price_low' as SortOption },
        { label: 'Price: High to Low', value: 'price_high' as SortOption }
    ]

    return (
            <View className='p-4'>
                <Text className='text-lg font-bold mb-4'>Sort By</Text>
                <View>
                    {sortOptions.map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            onPress={() => onSortSelect(option.value)}
                            className='flex-row items-center justify-between py-4 border-b border-gray-200'
                        >
                            <Text className='text-base'>{option.label}</Text>
                            <RadioButton selected={selectedSort === option.value} />
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
    )
}
