import { useQuery } from '@tanstack/react-query';
import { sweetsApi } from '@/lib/api';
import { PurchaseHistory } from '@/types';

export const usePurchases = (enabled: boolean) => {
  return useQuery({
    queryKey: ['purchases'],
    queryFn: async (): Promise<PurchaseHistory[]> => {
      const { data } = await sweetsApi.purchases();
      return data;
    },
    enabled,
  });
};
