import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

export const useAuthenticated = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [token, setToken] = useState<string | null>(null);
    const [gToken, setGToken] = useState<string | null>(null);
    const [cData, setCData] = useState<string | null>(null);

    const checkAuthentication = useCallback(async () => {
        try {
            setIsLoading(true);
            const floranzaToken = await AsyncStorage.getItem("floranza-t-value");
            const floranzaGToken = await AsyncStorage.getItem("floranza-g-token");
            const floranzaCData = await AsyncStorage.getItem("floranza-c-data");

            setToken(floranzaToken);
            setGToken(floranzaGToken);
            setCData(floranzaCData);
            setIsAuthenticated(floranzaToken ? true : false);
        } catch (error) {
            setIsAuthenticated(false);
            setToken(null);
            setGToken(null);
        } finally {
            setIsLoading(false);
        }
    }, []); // Empty dependency array

    useFocusEffect(
        useCallback(() => {
            checkAuthentication();
        }, [checkAuthentication])
    );

    return {
        isAuthenticated,
        isLoading,
        token,
        gToken,
        cData,
        refetch: checkAuthentication,
    };
};