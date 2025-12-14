import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Sweet, SweetFormData } from '@/types';
import { toast } from 'sonner';

export const useSweets = (searchQuery?: string, categoryFilter?: string) => {
  return useQuery({
    queryKey: ['sweets', searchQuery, categoryFilter],
    queryFn: async (): Promise<Sweet[]> => {
      let query = supabase
        .from('sweets')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      if (categoryFilter && categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Sweet[];
    },
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<string[]> => {
      const { data, error } = await supabase
        .from('sweets')
        .select('category')
        .order('category');

      if (error) throw error;
      
      const uniqueCategories = [...new Set(data.map(item => item.category))];
      return uniqueCategories;
    },
  });
};

export const useCreateSweet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sweetData: SweetFormData) => {
      const { data, error } = await supabase
        .from('sweets')
        .insert([sweetData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Sweet created successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create sweet: ${error.message}`);
    },
  });
};

export const useUpdateSweet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SweetFormData> }) => {
      const { data: updated, error } = await supabase
        .from('sweets')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Sweet updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update sweet: ${error.message}`);
    },
  });
};

export const useDeleteSweet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('sweets')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Sweet deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete sweet: ${error.message}`);
    },
  });
};

export const usePurchaseSweet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sweetId, userId }: { sweetId: string; userId: string }) => {
      const { data, error } = await supabase.rpc('purchase_sweet', {
        p_sweet_id: sweetId,
        p_user_id: userId,
      });

      if (error) throw error;
      
      const result = data as { success: boolean; error?: string; message?: string };
      if (!result.success) {
        throw new Error(result.error || 'Purchase failed');
      }
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      toast.success('Purchase successful! 🍬');
    },
    onError: (error: Error) => {
      toast.error(`Purchase failed: ${error.message}`);
    },
  });
};

export const useRestockSweet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sweetId, quantity }: { sweetId: string; quantity: number }) => {
      const { data, error } = await supabase.rpc('restock_sweet', {
        p_sweet_id: sweetId,
        p_quantity: quantity,
      });

      if (error) throw error;
      
      const result = data as { success: boolean; error?: string; message?: string };
      if (!result.success) {
        throw new Error(result.error || 'Restock failed');
      }
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      toast.success('Restock successful!');
    },
    onError: (error: Error) => {
      toast.error(`Restock failed: ${error.message}`);
    },
  });
};
