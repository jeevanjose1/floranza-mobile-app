import { fetcher } from "@/lib/utils";
import { COMMON } from "@/shared/urls/common";
import { FILTER } from "@/shared/urls/products";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const useGetNavigation = () => {
  return useQuery({
    queryKey: ["NAVIGATION"],
    queryFn: () =>
      fetcher({
        type: "get",
        url: COMMON.NAV,
        authenticated: false,
      }),
  });
};
const useGetCountry = () => {
  return useQuery({
    queryKey: ["COUNTRY"],
    queryFn: () => axios.get(COMMON.COUNTRY)

  });
};
const useGetAttributes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      fetcher({
        type: "get",
        url: FILTER.ATTRIBUTES,
        authenticated: false,
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(["ATTRIBUTES"], (old: any[] = []) => [
        ...old,
        data,
      ]);
    },
  });
};

const useGetMaterials = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      fetcher({
        type: "get",
        url: FILTER.MATERIALS,
        authenticated: false,
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(["MATERIALS"], (old: any[] = []) => [
        ...old,
        data,
      ]);
    },
  });
};
const useGetCatogeries = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      fetcher({
        type: "get",
        url: FILTER.CATOGERIES,
        authenticated: false,
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(["CATOGERIES"], (old: any[] = []) => [
        ...old,
        data,
      ]);
    },
  });
};
const useTrackOrder = () => {

  return useMutation({
    mutationFn: (data: string) =>
      fetcher({
        type: "get",
        url: `${COMMON.TRACK}/${data}`,
        authenticated: false,
      }),
    onSuccess: (data) => {
      return data
    },
    onError: (error) => error
  });
};

const useFilterCatogery = () => {
  return useQuery({
    queryKey: ["FILTER_CATOGERY"],
    queryFn: () =>
      fetcher({
        type: "get",
        url: FILTER.CATOGERIES,
        authenticated: false,
      }),
  });
};

const useFilterMaterial = () => {
  return useQuery({
    queryKey: ["FILTER_MATERIAL"],
    queryFn: () =>
      fetcher({
        type: "get",
        url: FILTER.MATERIALS,
        authenticated: false,
      }),
  });
};

const useFilterAttributes = () => {
  return useQuery({
    queryKey: ["FILTER_Attributes"],
    queryFn: () =>
      fetcher({
        type: "get",
        url: FILTER.ATTRIBUTES,
        authenticated: false,
      }),
  });
};
export {
  useFilterAttributes,
  useFilterCatogery,
  useFilterMaterial,
  useGetAttributes,
  useGetCatogeries,
  useGetCountry,
  useGetMaterials,
  useGetNavigation,
  useTrackOrder
};

