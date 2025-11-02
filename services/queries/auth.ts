import { fetcher } from "@/lib/utils"
import { AUTH } from "@/shared/urls/auth"
import { useMutation } from "@tanstack/react-query"

const useSigin = ()=>{
	return useMutation({
		mutationFn:(data:unknown)=>fetcher({
			url:AUTH.LOGIN,
			data:data,
			type:'post',
            authenticated:false
		}),
		onSuccess:(data)=>data,
		onError:(error)=>error
	})
}

const useSignup = ()=>{
	return useMutation({
		mutationFn:(data:unknown)=>fetcher({
			url:AUTH.SIGNUP,
			data:data,
			type:'post',
            authenticated:false
		}),
		onSuccess:(data)=>data,
	onError:(error)=>error
		})
}

const useResetPassword = ()=>{
	return useMutation({
		mutationFn:(data:unknown)=>fetcher({
			url:AUTH.RESET_PASSWORD,
			data:data,
			type:'post',
            authenticated:false
		}),
		onSuccess:(data)=>data,
		onError:(error)=>error
		})
}

const useVarifyToken = ()=>{
	return useMutation({
		mutationFn:(data:unknown)=>fetcher({
			url:`${AUTH.VARIFY_TOKEN}/${data}`,
			data:data,
			type:'get',
            authenticated:false
		}),
		onSuccess:(data)=>data,
		onError:(error)=>error
		})
}

const useChangePassword = ()=>{
	return useMutation({
		mutationFn:(data:any)=>fetcher({
			url:`${AUTH.CHANGE_PASSWORD}/${data?.token}`,
			data:data?.data,
			type:'post',
            authenticated:false
		}),
		onSuccess:(data)=>data,
		onError:(error)=>error
		})
}
const useGustToken = ()=>{
	return useMutation({
		mutationFn:()=>fetcher({
			url:`${AUTH.GUST_TOKEN}`,
			type:'get',
            authenticated:false
		}),
		onSuccess:(data)=>data,
		onError:(error)=>error
		})
}
const useLogout = ()=>{
	return useMutation({
		mutationFn:()=>fetcher({
			url:`${AUTH.LOGOUT}`,
			type:'post',
		}),
		onSuccess:(data)=>data,
		onError:(error)=>error
		})
}
export {
	useChangePassword,
	useResetPassword,
	useGustToken,
	useSigin,
	useSignup,
	useVarifyToken,
	useLogout
}
