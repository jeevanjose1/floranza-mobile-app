import { fetcher } from "@/lib/utils";
import { PAYMENT } from "@/shared/urls/payment";
import { useMutation, useQuery } from "@tanstack/react-query";

const useRazorpayStatus = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      fetcher({
        url: `${PAYMENT.RAZORPAY}/${payload}`,
        type: "get",
        data: payload,
      }),
    onSuccess: (response) => {
      return response;
    },
    onError: (error: any) => {
      return error;
    },
  });
};

const useGetPaymentDetails = (payload: string) => {
  return useQuery({
    queryKey: ["PYAMENT_DETAILS", payload],
    queryFn: () =>
      fetcher({
        type: "get",
        url: `${PAYMENT.PAYMENT_DETAILS}/${payload}`,
        authenticated: false,
      }),
  });
};

const usePhonePeStatus = () => {
  return useMutation({
    mutationFn: (payload: string) =>
      fetcher({
        url: `${PAYMENT.PHONEPE}/${payload}`,
        type: "get",
        data: payload,
      }),
    onSuccess: (response) => {
      return response;
    },
    onError: (error: any) => {
      return error;
    },
  });
};

export { useGetPaymentDetails, usePhonePeStatus, useRazorpayStatus };
