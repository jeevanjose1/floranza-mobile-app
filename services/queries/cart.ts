import { fetcher, queryFilter } from "@/lib/utils";
import { CART } from "@/shared/urls/cart";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const useViewCart = (payload: any) => {
  return useQuery({
    queryKey: ["CART", payload],
    queryFn: () =>
      fetcher({
        url: `${CART.VIEW_CART}/${payload?.token}/${queryFilter(payload.filter)}`,
        type: "get",
      }),
  });
};
const useAddToCart = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) =>
      fetcher({
        url: CART.ADD_TO_CART,
        type: "post",
        data: payload,
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["CART"] });

      return response;
    },
    onError: (error: any) => {
      return error;
    },
  });
};
const useDeleteCart = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) =>
      fetcher({
        url: `${CART.DELETE_CART}/${payload.cart_id}/${payload.token}`,
        type: "get",
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["CART"] });
      return response;
    },
    onError: (error: any) => {
      return error;
    },
  });
};
const useOutOfStock = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) =>
      fetcher({
        url: CART.OUT_OF_STOCK,
        type: "post",
        data: payload,
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ["PRODUCTS_LIST"] });
      query.invalidateQueries({ queryKey: ["PRODUCT_DETAILS"] });

      return response;
    },
    onError: (error: any) => {
      return error;
    },
  });
};

const useCheckoutCart = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      fetcher({
        url: `${CART.CHECKOUT}/${payload.token}`,
        type: "post",
        data: payload?.data
      }),
    onSuccess: (response) => {
      return response;
    },
    onError: (error: any) => {
      return error;
    },
  });
};
const useApplyCoupon = () => {
  const query = useQueryClient();
  
  return useMutation({
    mutationKey:['APPLY_COUPON'],
    mutationFn: (payload: any) =>
      fetcher({
        url: `${CART.APPLY_COUPON}/${payload.coupon_code}`,
        type: "get",
        data: payload?.data
      }),
    onSuccess: (response) => {
      // query.invalidateQueries({ queryKey: ["CART"] });

      return response;
    },
    onError: (error: any) => {
      return error;
    },
  });
};
export { useAddToCart, useOutOfStock, useViewCart, useDeleteCart, useCheckoutCart, useApplyCoupon };
