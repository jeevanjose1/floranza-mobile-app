import { fetcher, queryFilter } from "@/lib/utils";
import { PRODUCT, WISHLIST } from "@/shared/urls/products";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const useGetProductList = (payload: any) => {
  return useQuery({
    queryKey: ["PRODUCTS_LIST", payload],
    queryFn: () =>
      fetcher({
        type: "get",
        url: `${PRODUCT.PRODUCT_LIST}/${payload.slug}${queryFilter(
          payload?.filter
        )}`,
        authenticated: false,
      }),
  });
};

const useGetProductsInfinity = (payload: any) => {
  return useInfiniteQuery({
    queryKey: ["PRODUCTS_LIST_INFINITE", payload],
    queryFn: ({ pageParam = 1 }) =>
      fetcher({
        type: "get",
        url: `${PRODUCT.PRODUCT_LIST}/${payload.slug}${queryFilter({
          ...payload?.filter,
          page: pageParam
        })}`,
        authenticated: false,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {

      const has_more = lastPage?.data?.pagination?.next_page_url;
      if (has_more) {
        return allPages.length + 1;
      }
      return undefined;
    },
  });
};

const useGetProductListSearch = (payload: any) => {
  return useQuery({
    queryKey: ["PRODUCTS_LIST_SEARCH", payload],
    queryFn: () =>
      fetcher({
        type: "get",
        url: `${PRODUCT.SEARCH}/${queryFilter(
          payload?.filter
        )}`,
        authenticated: false,
      }),
  });
};

const useGetProductsSearchInfinity = (payload: any) => {
  return useInfiniteQuery({
    queryKey: ["PRODUCTS_LIST_SEARCH_INFINITY", payload],
    queryFn: ({ pageParam = 1 }) =>
      fetcher({
        type: "get",
        url: `${PRODUCT.SEARCH}/${queryFilter(
          payload?.filter
        )}`,
        authenticated: false,
      }),
    initialPageParam: 1,
    enabled:payload.enabled,
    getNextPageParam: (lastPage, allPages) => {

      const has_more = lastPage?.data?.pagination?.next_page_url;
      if (has_more) {
        return allPages.length + 1;
      }
      return undefined;
    },
  });
};

const useGetProductDetails = (payload: any) => {
  return useQuery({
    queryKey: ["PRODUCT_DETAILS", payload],
    queryFn: () =>
      fetcher({
        type: "get",
        url: `${PRODUCT.PRODUCT_DETAILS}/${payload}`,
        authenticated: false,
      }),

    // staleTime: 1000 * 60 * 5, // 5 minutes

    // retry: false,
  });
};

const useGetWishlist = (payload: any) => {
  return useQuery({
    queryKey: ["WISHLIST", payload],
    queryFn: () =>
      fetcher({
        type: "get",
        url: `${WISHLIST.LIST}/${queryFilter(
          payload?.filter
        )}`,
      }),
  });
};

const useAddWishlist = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) =>
      fetcher({
        url: `${WISHLIST.ADD}/`,
        type: "post",
        data: payload
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ['WISHLIST'] })
      return response;
    },
    onError: (error: any) => {
      return error;
    },
  });
};

const useDeleteWishlist = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) =>
      fetcher({
        url: `${WISHLIST.DELETE}/${payload}`,
        type: "delete",
      }),
    onSuccess: (response) => {
      query.invalidateQueries({ queryKey: ['WISHLIST'] })
      return response;
    },
    onError: (error: any) => {
      return error;
    },
  });
};
export {
  useAddWishlist,
  useDeleteWishlist,
  useGetProductDetails,
  useGetProductList,
  useGetProductListSearch,
  useGetProductsInfinity,
  useGetProductsSearchInfinity,
  useGetWishlist
};

