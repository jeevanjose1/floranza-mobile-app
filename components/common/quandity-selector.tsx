import { Ionicons } from '@expo/vector-icons'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'

type QuantitySelectorProps = {
    quantity: number
    onQuantityChange: (quantity: number) => void
    minQuantity?: number
    maxQuantity?: number
    showLabel?: boolean
}

const QuantitySelector = ({ 
    quantity, 
    onQuantityChange, 
    minQuantity = 1, 
    maxQuantity = 99,
    showLabel = true 
    
    
}: QuantitySelectorProps) => {
    
    const handleIncrement = () => {
        if (quantity < maxQuantity) {
            onQuantityChange(quantity + 1)
        }
    }

    const handleDecrement = () => {
        if (quantity > minQuantity) {
            onQuantityChange(quantity - 1)
        }
    }

    const handleTextChange = (text: string) => {
        // Remove any non-numeric characters
        const numericValue = text.replace(/[^0-9]/g, '')
        
        if (numericValue === '') {
            onQuantityChange(minQuantity)
            return
        }

        const parsedValue = parseInt(numericValue, 10)
        
        // Validate the input
        if (!isNaN(parsedValue)) {
            if (parsedValue < minQuantity) {
                onQuantityChange(minQuantity)
            } else if (parsedValue > maxQuantity) {
                onQuantityChange(maxQuantity)
            } else {
                onQuantityChange(parsedValue)
            }
        }
    }

    return (
        <View>
            {showLabel && (
                <Text className="font-sam-medium text-base  mb-3">
                    Quantity
                </Text>
            )}
            <View className='flex-row items-center'>
                <TouchableOpacity 
                    onPress={handleDecrement}
                    disabled={quantity <= minQuantity}
                    className={`w-12 h-10 rounded-lg border bg-white items-center justify-center ${
                        quantity <= minQuantity ? 'border-gray-200 opacity-50' : 'border-gray-300'
                    }`}
                >
                    <Ionicons 
                        name="remove" 
                        size={20} 
                        color={quantity <= minQuantity ? '#D1D5DB' : '#374151'} 
                    />
                </TouchableOpacity>
                
                <View className='mx-4'>
                    <TextInput
                        value={quantity?.toString()}
                        onChangeText={handleTextChange}
                        keyboardType="numeric"
                        maxLength={2}
                        className='w-16 h-10 text-center font-sam-bold text-lg py-1 border border-gray-300 rounded-lg bg-white'
                    />
                </View>
                
                <TouchableOpacity 
                    onPress={handleIncrement}
                    disabled={quantity >= maxQuantity}
                    className={`w-12 h-10 rounded-lg border items-center justify-center ${
                        quantity >= maxQuantity 
                            ? 'border-gray-200 bg-gray-100 opacity-50' 
                            : 'border-primary bg-primary/5'
                    }`}
                >
                    <Ionicons 
                        name="add" 
                        size={20} 
                        color={quantity >= maxQuantity ? '#D1D5DB' : '#ED2353'} 
                        
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default QuantitySelector