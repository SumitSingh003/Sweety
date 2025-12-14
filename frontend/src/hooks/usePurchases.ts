import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PurchaseHistory } from '@/types';

export const usePurchases = (userId?: string) => {
  return useQuery({
    queryKey: ['purchases', userId],
    queryFn: async (): Promise<PurchaseHistory[]> => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('purchase_history')
        .select(`
          *,
          sweet:sweets(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PurchaseHistory[];
    },
    enabled: !!userId,
  });
};
