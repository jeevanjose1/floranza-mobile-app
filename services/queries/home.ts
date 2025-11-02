import { fetcher } from "@/lib/utils";
import { HOME } from "@/shared/urls/home";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

const useGetSlide = () => {
  return useQuery({
    queryKey: ["SLIDE"],
    queryFn: () =>
      fetcher({
        type: "get",
        url: HOME.SLIDE,
        authenticated: false,
      }),
  });
};
const useGetLatestProducts = () => {
  return useInfiniteQuery({
    queryKey: ["LATEST_PRODUCTS"],
    queryFn: ({ pageParam = 1 }) =>
      fetcher({
        type: "get",
        url: `${HOME.LATEST_PRODUCTS}?page=${pageParam}`,
        authenticated: false,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const has_more = lastPage?.data?.next_page_url;
      if (has_more) {
        return allPages.length + 1;
      }
      return undefined;
    },
  });
};
const useGetFeaturedProducts = () => {
  return useQuery({
    queryKey: ["FEATURED_PRODUCTS"],
    queryFn: () =>
      fetcher({
        type: "get",
        url: HOME.FEATURED_PRODUCTS,
        authenticated: false,
      }),
  });
};

const useGetMostSelleingProducts = () => {
  return useInfiniteQuery({
    queryKey: ["MOST_SELLING_PRODUCTS"],
    queryFn: ({ pageParam = 1 }) =>
      fetcher({
        type: "get",
        url: `${HOME.MOST_SELLING}?page=${pageParam}`,
        authenticated: false,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const has_more = lastPage?.data?.next_page_url;
      if (has_more) {
        return allPages.length + 1;
      }
      return undefined;
    },
  });
};
const useGetCatogeries = () => {
  return useQuery({
    queryKey: ["CATOGERIES"],
    queryFn: () =>
      fetcher({
        type: "get",
        url: HOME.CATOGERIES,
        authenticated: false,
      }),
  });
};

export {
  useGetCatogeries, useGetFeaturedProducts, useGetLatestProducts, useGetMostSelleingProducts, useGetSlide
};

