import React, { useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAuthenticated } from "@/hooks/useAutheticated";
import { useListAdderss } from "@/services/queries/account";
import { indianStates } from "@/shared/others/others";
import { Address } from "./types";

interface AddressManagerProps {
  selectedAddress: Address | null;
  onSelectAddress: (address: Address) => void;
}

const getStateName = (stateCode: string) =>
  indianStates.find((s) => s.code === stateCode)?.name || stateCode;

const getShippingLabel = (option: string) =>
  option === "dtdc" ? "DTDC" : "India Post";

// ---------------------------------------------------------------------------
// LOGGED IN — shows only the API address from the account
// ---------------------------------------------------------------------------
const AuthenticatedAddressManager = ({
  selectedAddress,
  onSelectAddress,
}: AddressManagerProps) => {
  const router = useRouter();
  const { isAuthenticated } = useAuthenticated();
  const { data: addressData, isLoading } = useListAdderss(isAuthenticated);

  const apiAddress: Address | null = React.useMemo(() => {
    if (!addressData?.data?.fname) return null;
    return {
      id: "api-address",
      fullName: addressData.data.fname || "",
      country: addressData.data.country || "IN",
      streetAddress: addressData.data.address_1 || "",
      addressLine2: addressData.data.address_2 || "",
      city: addressData.data.city || "",
      state: addressData.data.state || "",
      postcode: addressData.data.postcode || "",
      phone: addressData.data.phone || "",
      email: addressData.data.email || "",
      shippingOption: "standard",
    };
  }, [addressData]);

  // Auto-select the API address as soon as it loads
  useEffect(() => {
    if (apiAddress && !selectedAddress) {
      onSelectAddress(apiAddress);
    }
  }, [apiAddress]);

  return (
    <View className="bg-white rounded-lg p-6 shadow-sm mb-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold">Delivery Address</Text>
        {apiAddress && (
          <TouchableOpacity
            onPress={() => router.push({ pathname: "/add-address", params: { isEdit: 1 } })}
          >
            <Text className="text-primary font-semibold">Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <View className="items-center py-8">
          <ActivityIndicator size="small" color="#ED2353" />
          <Text className="text-gray-600 mt-2">Loading address...</Text>
        </View>
      ) : apiAddress ? (
        <AddressCard
          address={apiAddress}
          isSelected={true}
          onPress={() => {}}
          showEdit={false}
        />
      ) : (
        <View className="items-center py-8">
          <Ionicons name="location-outline" size={48} color="#9CA3AF" />
          <Text className="text-gray-600 mt-2">No address on your account</Text>
          <TouchableOpacity
            onPress={() => router.push("/add-address")}
            className="mt-4 bg-primary rounded-lg px-6 py-2"
          >
            <Text className="text-white font-semibold">Add Address</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// ---------------------------------------------------------------------------
// GUEST — shows the locally saved address or prompts to add one
// ---------------------------------------------------------------------------
const GuestAddressManager = ({
  selectedAddress,
  onSelectAddress,
}: AddressManagerProps) => {
  const router = useRouter();
  const [localAddress, setLocalAddress] = React.useState<Address | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const loadLocalAddress = useCallback(async () => {
    try {
      setIsLoading(true);
      const raw = await AsyncStorage.getItem("@user_address");
      if (raw) {
        const parsed = JSON.parse(raw);
        const address: Address = { ...parsed, id: parsed.id || "local-address" };
        setLocalAddress(address);
        // Auto-select if nothing selected yet
        if (!selectedAddress) {
          onSelectAddress(address);
        }
      } else {
        setLocalAddress(null);
      }
    } catch (e) {
      console.error("Error loading local address:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadLocalAddress();
    }, [loadLocalAddress])
  );

  return (
    <View className="bg-white rounded-lg p-6 shadow-sm mb-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold">Delivery Address</Text>
        {localAddress && (
          <TouchableOpacity
            onPress={() => router.push({ pathname: "/add-address", params: { isEdit: 1 } })}
          >
            <Text className="text-primary font-semibold">Edit</Text>
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <View className="items-center py-8">
          <ActivityIndicator size="small" color="#ED2353" />
          <Text className="text-gray-600 mt-2">Loading address...</Text>
        </View>
      ) : localAddress ? (
        <AddressCard
          address={localAddress}
          isSelected={true}
          onPress={() => {}}
          showEdit={false}
        />
      ) : (
        <View className="items-center py-8">
          <Ionicons name="location-outline" size={48} color="#9CA3AF" />
          <Text className="text-gray-600 mt-2">No address added yet</Text>
          <TouchableOpacity
            onPress={() => router.push("/add-address")}
            className="mt-4 bg-primary rounded-lg px-6 py-2"
          >
            <Text className="text-white font-semibold">Add Address</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// ---------------------------------------------------------------------------
// MAIN EXPORT — picks the right manager based on auth state
// ---------------------------------------------------------------------------
const AddressManager = (props: AddressManagerProps) => {
  const { isAuthenticated } = useAuthenticated();
  return isAuthenticated ? (
    <AuthenticatedAddressManager {...props} />
  ) : (
    <GuestAddressManager {...props} />
  );
};

// ---------------------------------------------------------------------------
// ADDRESS CARD
// ---------------------------------------------------------------------------
const AddressCard = ({
  address,
  isSelected,
  onPress,
  showEdit = true,
}: {
  address: Address;
  isSelected: boolean;
  onPress: () => void;
  showEdit?: boolean;
}) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={showEdit ? 0.7 : 1}
      className={`p-4 rounded-lg border ${
        isSelected ? "border-primary bg-blue-50" : "border-gray-200 bg-white"
      }`}
    >
      <View className="flex-row items-start justify-between mb-2">
        <Text className="font-bold text-base flex-1">{address.fullName}</Text>
        {showEdit && (
          <TouchableOpacity
            onPress={() =>
              router.push({ pathname: "/add-address", params: { isEdit: 1 } })
            }
          >
            <FontAwesome name="edit" size={20} color="black" />
          </TouchableOpacity>
        )}
      </View>
      <Text className="text-gray-600 text-sm mb-1">{address.streetAddress}</Text>
      {address.addressLine2 ? (
        <Text className="text-gray-600 text-sm mb-1">{address.addressLine2}</Text>
      ) : null}
      <Text className="text-gray-600 text-sm mb-1">
        {address.city}, {getStateName(address.state)} - {address.postcode}
      </Text>
      <Text className="text-gray-600 text-sm mb-1">Phone: {address.phone}</Text>
      <Text className="text-gray-600 text-sm mb-2">Email: {address.email}</Text>
      <View className="flex-row items-center mt-2">
        <Ionicons name="car-outline" size={16} color="#6B7280" />
        <Text className="text-gray-600 text-sm ml-1">
          {getShippingLabel(address.shippingOption)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default AddressManager;
