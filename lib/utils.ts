import instance, { base_url } from "@/services/instance";
import { FetcherType } from "@/shared/types/common";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";





export const queryFilter = (filter: object) => {
  //@ts-ignore
  const filterEntries = Object.entries(filter).filter(([_, value]) => {
    return (
      value !== undefined && value !== null && value !== "" && value !== "all"
    );
  });
  if (filterEntries.length === 0) {
    return "";
  }
  const filterString = filterEntries
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return `?${filterString}`;
};
const cache = new Map<string, any>();

const cacheTimestamps = new Map<string, number>();

export const fetcher = async ({
  url,
  data,
  authenticated = true,
  type = "get",
  headers,
  onUploadProgress,
  cacheKey,
  cacheTime = 0,
}: FetcherType) => {
  const key = cacheKey ?? `${type}:${url}:${JSON.stringify(data)}`;
  
  // Check for cached data
  if (type === "get" && cacheTime > 0) {
    const cached = cache.get(key);
    const timestamp = cacheTimestamps.get(key);

    if (cached && timestamp && Date.now() - timestamp < cacheTime) {
      return cached;
    }
  }

  try {
    const config = {
      method: type,
      url: authenticated ? url : `${base_url}${url}`,
      data,
      headers,
      onUploadProgress,
    };
    const response = authenticated
      ? await instance(config as any)
      : await axios(config as any);

    // Cache result if applicable
    if (type === "get" && cacheTime > 0) {
      cache.set(key, response.data);
      cacheTimestamps.set(key, Date.now());
    }

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response ?? error;
    }

    throw new Error("Unexpected error occurred");
  }
};

export const generate_pagination = (currentPage: number, lastPage: number) => {
  if (lastPage <= 5) {
    return Array.from({ length: lastPage }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, 5, "ellipsis", lastPage];
  }

  if (currentPage >= lastPage - 2) {
    return [
      1,
      "ellipsis",
      lastPage - 4,
      lastPage - 3,
      lastPage - 2,
      lastPage - 1,
      lastPage,
    ];
  }

  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    lastPage,
  ];
};

export function capitalize_first_letters(sentence: string) {
  return sentence
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export const is_authenticated = async () => {
   const token = await AsyncStorage.getItem("floranza-t-value");

  return token ? true : false;
};

export const calculate_product_price = (item: any, index?: number) => {
  const isVariation = item?.is_variation;

  if (isVariation) {
    const variation = item?.variations?.[index ? index : 0];
    const salePrice = Number(variation?.sale_price) || 0;
    const regPrice = Number(variation?.reg_price) || 0;

    if (regPrice == 0) {
      return {
        min: salePrice,
        max: 0,
      };
    }

    if (regPrice <= salePrice) {
      return {
        min: salePrice,
        max: 0,
      };
    }

    return {
      min: salePrice,
      max: regPrice,
    };

  } else {
    const salePrice = Number(item?.sale_price) || 0;
    const regPrice = Number(item?.reg_price) || 0;

    if (regPrice == 0) {
      return {
        min: salePrice,
        max: 0,
      };
    }
    if (salePrice >= regPrice) {
      return {
        min: salePrice,
        max: 0,
      };
    }
    return {
      min: salePrice,
      max: regPrice,
    };
  }
};

export function calculate_discount(regularPrice: number, salePrice: number) {
  if (regularPrice <= 0) {
    return false;
  }
  const discount = ((regularPrice - salePrice) / regularPrice) * 100;
  return Math.round(discount * 100) / 100; // Round to 2 decimal places
}


//gtag 

