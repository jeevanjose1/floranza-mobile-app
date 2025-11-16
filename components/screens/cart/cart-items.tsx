import QuantitySelector from '@/components/common/quandity-selector';
import { useAuthenticated } from '@/hooks/useAutheticated';
import { useAddToCart, useDeleteCart } from '@/services/queries/cart';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

// Define the expected structure for the item prop for better type safety
type CartItemData = {
    id: string | number;
    cart_id: string | number;
    slug: string;
    cart_qty: number;
    prd_var_value_id: string | number;
    product_id: string | number;
    name: string;
    attributeOption?: string;
    price: number;
    is_out_of_stock: boolean,
    image?: {
        mini: string;
    };
};

type CartItemsProps = {
    item: CartItemData;
};

const CartItems = ({ item }: CartItemsProps) => {
    // --- Hooks and State ---
    const prevQuantityRef = useRef<number>(item?.cart_qty || 0);
    const [quantity, setQuantity] = useState<number>(item?.cart_qty || 1);

    const { gToken: token } = useAuthenticated(); // Destructure and rename gToken to token
    const router = useRouter();

    const { mutateAsync: removeCartItem, isPending: isRemoving } = useDeleteCart(); // Rename for clarity
    const { mutateAsync: updateCartItem, error } = useAddToCart(); // Rename for clarity

    // --- Effects ---

    // Initialize and keep quantity state synchronized with prop, and update ref
    useEffect(() => {
        if (item?.cart_qty !== quantity) {
            setQuantity(item.cart_qty);
        }
        prevQuantityRef.current = item?.cart_qty || 0;
    }, [item?.cart_qty]);


    // --- Handlers ---

    const navigateToProduct = () => {
        router.push({ pathname: `/product-list`, params: { slug: item?.slug } });
    };

    const handleRemoveItem = () => {
        if (!token || isRemoving) return;

        removeCartItem({
            cart_id: item?.cart_id,
            token: token,
        });
    };

    const handleUpdateCartQuantity = useCallback((newCount: number) => {
        if (!token) return;

        const qtyChange = newCount > prevQuantityRef.current ? 1 : -1;

        const form_data = new FormData();
        const fields = [
            ["guest_token", token],
            ["prd_var_value_id", item?.prd_var_value_id],
            ["product_id", item?.product_id],
            ["qty", qtyChange.toString()],
        ];

        fields.forEach(([key, value]) => {
            form_data.append(key as string, value as string);
        });

        prevQuantityRef.current = newCount;

        updateCartItem(form_data, {
            onError: (err) => {
                console.error('Failed to update cart quantity:', err);
                // We might need to fetch the true cart state here, or rollback the state to prevQuantityRef.current
            },
        });
    }, [token, item?.prd_var_value_id, item?.product_id, updateCartItem]);

    // Main handler for the QuantitySelector component
    const handleQuantityChange = useCallback((newCount: number) => {
        // Only proceed if the count has actually changed and is valid (non-negative)
        if (newCount !== quantity && newCount >= 0) {

            // Update local state immediately for a responsive UI
            setQuantity(newCount);

            if (newCount === 0) {
                handleRemoveItem();
            } else {
                // Only call the update function if the new count is different from the previous successful count
                if (newCount !== prevQuantityRef.current) {
                    handleUpdateCartQuantity(newCount);
                }
            }
        }
    }, [quantity, handleRemoveItem, handleUpdateCartQuantity]);


    // --- Render ---

    // Guard clause if item is not fully loaded/valid (optional but good practice)
    //   if (!item || !item.id) {
    //     return null;
    //   }

    return (
        <View key={item.id} className="bg-white rounded-md p-4 shadow-sm mb-4">
            {/* Product Image and Details */}
            <TouchableOpacity onPress={navigateToProduct}>
                <View className="flex-row">
                    <Image
                        source={{ uri: item?.image?.mini }}
                        className="w-24 h-24 rounded-md"
                        resizeMode="cover"
                    />
                    <View className="flex-1 ml-4">
                        <Text className="text-lg font-semibold mb-1">{item.name}</Text>
                        {item?.attributeOption && (
                            <Text className="text-gray-600 text-sm mb-2">
                                Size: {item.attributeOption}
                            </Text>
                        )}
                        <Text className="text-lg font-bold text-primary">
                            ₹{item.price.toFixed(2)}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>

            {/* Controls: Quantity and Remove */}
            <View className="flex-row justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <QuantitySelector
                    quantity={quantity}
                    onQuantityChange={handleQuantityChange}

                    minQuantity={1}
                    maxQuantity={error?.data?.message == "the product is currently out of stock." ? quantity : 99}
                    showLabel={false}
                />

                <TouchableOpacity onPress={handleRemoveItem} className="px-4 py-2" disabled={isRemoving}>
                    <Ionicons name="trash" size={24} color={isRemoving ? 'lightgray' : 'gray'} />
                </TouchableOpacity>
            </View>
            {(item?.is_out_of_stock ||
                error?.data?.message ===
                "the product is currently out of stock.") && (
                    <Text className="mt-1 text-primary text-sm text-main italic">Out of stock</Text>
                )}
        </View>
    );
};

export default CartItems;