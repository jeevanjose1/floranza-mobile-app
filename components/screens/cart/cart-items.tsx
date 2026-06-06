import QuantitySelector from '@/components/common/quandity-selector';
import { useAuthenticated } from '@/hooks/useAutheticated';
import { useAddToCart, useDeleteCart } from '@/services/queries/cart';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native';

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
    is_unlimited_qty: boolean,
    mainQty: number,
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

    const { gToken: token } = useAuthenticated();
    const router = useRouter();

    const { mutateAsync: removeCartItem, isPending: isRemoving } = useDeleteCart();
    const { mutateAsync: updateCartItem, isPending: isUpdating, error } = useAddToCart();

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
        router.push({ pathname: `/product-details`, params: { slug: item?.slug } });
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



        const form_data = {
            guest_token: token,
            prd_var_value_id: item?.prd_var_value_id,
            product_id: item?.product_id,
            qty: qtyChange.toString()
        }


        prevQuantityRef.current = newCount;

        updateCartItem(form_data, {
            onError: (err) => {
                // Rollback to previous quantity on error
                setQuantity(prevQuantityRef.current);
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

    // --- Calculate stock availability ---
    const isOutOfStock = item?.is_out_of_stock ||
        error?.data?.message === "the product is currently out of stock.";

    // Determine max quantity based on stock status
    const getMaxQuantity = () => {
        if (isOutOfStock) {
            // If out of stock, user can only maintain or decrease current quantity
            return quantity;
        }

        if (item?.is_unlimited_qty) {
            return 500; // Unlimited stock
        }

        // Limited stock - use mainQty as the maximum
        return item?.mainQty || 99;
    };

    const maxQuantity = getMaxQuantity();

    // --- Render ---

    return (
        <View key={item.id} className="bg-white rounded-md p-4 shadow-sm mb-4" style={{ position: 'relative' }}>
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
                            ₹{item.price.toLocaleString('en-IN', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}
                        </Text>
                        {/* Stock status indicator */}
                        {!item?.is_unlimited_qty && !isOutOfStock && item?.mainQty <= 10 && (
                            <Text className="text-orange-500 text-xs mt-1">
                                Only {item.mainQty} left in stock
                            </Text>
                        )}
                    </View>
                </View>
            </TouchableOpacity>

            {/* Controls: Quantity and Remove */}
            <View className="flex-row justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <QuantitySelector
                    quantity={quantity}
                    onQuantityChange={handleQuantityChange}
                    minQuantity={1}
                    maxQuantity={maxQuantity}
                    showLabel={false}
                />

                <TouchableOpacity
                    onPress={handleRemoveItem}
                    className="px-4 py-2"
                    disabled={isRemoving || isUpdating}
                >
                    <Ionicons
                        name="trash"
                        size={24}
                        color={isRemoving || isUpdating ? 'lightgray' : 'gray'}
                    />
                </TouchableOpacity>
            </View>

            {/* Out of stock warning */}
            {isOutOfStock && (
                <Text className="mt-1 text-primary text-sm italic">
                    Out of stock - You can only decrease quantity
                </Text>
            )}

            {/* Disabled overlay while updating */}
            {isUpdating && (
                <View
                    style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(255,255,255,0.65)',
                        borderRadius: 6,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    pointerEvents="box-only"
                >
                    <ActivityIndicator size="small" color="#ED2353" />
                </View>
            )}
        </View>
    );
};

export default CartItems;