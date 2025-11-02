
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode, useState } from "react";

type Props = { children: ReactNode };

export default function QueryProvider({ children }: Props) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions:{
      queries:{
        refetchOnWindowFocus: false, 
         staleTime: 0,
        gcTime: 0, 
      },
      
    }
  }));

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
