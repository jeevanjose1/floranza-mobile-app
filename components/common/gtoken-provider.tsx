import { useAuthenticated } from "@/hooks/useAutheticated";
import { useGustToken } from "@/services/queries/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

type Props = { children: any }

const GtokenProvider = ({ children }: Props) => {
    const { mutateAsync: add_token } = useGustToken();
    const { gToken } = useAuthenticated();

    useEffect(() => {


        if (!gToken) {
            add_token().then(async (response) => {
                try {
                    const token = await AsyncStorage.getItem('floranza-g-token')
                    if(!token){
                    await AsyncStorage.setItem('floranza-g-token', response?.data?.guest_token);

                    }
                } catch (e) {
                    // saving error
                }
            });
        }
    }, []);
    return children
}

export default GtokenProvider