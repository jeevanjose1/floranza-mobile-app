import { fetcher, is_authenticated } from "@/lib/utils"
import { ACCOUNT } from "@/shared/urls/account"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

const useListAdderss = (enabled=true)=>{
    return useQuery({
        queryKey:['ADDRESS'],
        queryFn:()=>fetcher({
            url:ACCOUNT.ADDRESS_COMMON,
            type:'get'
            
        }),
        enabled:enabled
    })
}

const useListOrder = ()=>{
    return useQuery({
        queryKey:['ORDER'],
        queryFn:()=>fetcher({
            url:ACCOUNT.ORDER_LIST,
            type:'get'
            
        }),
    })
}
const useAddAddress = ()=>{
    const query = useQueryClient()
    return useMutation({
        mutationFn:(payload:any)=>fetcher({
            url:ACCOUNT.ADDRESS_COMMON,
            type:'post',
            data:payload
        }),
        onSuccess:(response)=>{
            query.invalidateQueries({queryKey:['ADDRESS']})
            return response
        },
        onError:(error:any)=>{
            return error
        }
    })
}


const useAccountDetails = ()=>{
    return useQuery({
        queryKey:['ACCOUNT'],
        queryFn:()=>fetcher({
            url:ACCOUNT.ACCOUNT_COMMON,
            type:'get'
        }),
        enabled:is_authenticated()
    })
}
const useEditAccount = ()=>{
    const query = useQueryClient()
    return useMutation({
        mutationFn:(payload:any)=>fetcher({
            url:ACCOUNT.ACCOUNT_COMMON,
            type:'post',
            data:payload
        }),
        onSuccess:(response)=>{
            query.invalidateQueries({queryKey:['ACCOUNT']})
            return response
        },
        onError:(error:any)=>{
            return error
        }
    })
}

export {
    useAccountDetails,
    useAddAddress,
    useListAdderss,
    useEditAccount,
    useListOrder
}