import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sweetsApi } from '@/lib/api';
import { Sweet, SweetFormData } from '@/types';
import { toast } from 'sonner';

export const useSweets = (searchQuery?: string, categoryFilter?: string) => {
  return useQuery({
    queryKey: ['sweets', searchQuery, categoryFilter],
    queryFn: async (): Promise<Sweet[]> => {
      const hasFilters =
        (searchQuery && searchQuery.trim().length > 0) ||
        (categoryFilter && categoryFilter !== 'all');

      if (hasFilters) {
        const { data } = await sweetsApi.search({
          query: searchQuery,
          category: categoryFilter === 'all' ? undefined : categoryFilter,
        });
        return data;
      }

      const { data } = await sweetsApi.list();
      return data;
    },
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<string[]> => {
      const { data } = await sweetsApi.list();
      const uniqueCategories = [...new Set(data.map((item) => item.category))];
      return uniqueCategories;
    },
  });
};

export const useCreateSweet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sweetData: SweetFormData) => {
      const { data } = await sweetsApi.create(sweetData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Sweet created successfully!');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || 'Failed to create sweet';
      toast.error(message);
    },
  });
};

export const useUpdateSweet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SweetFormData> }) => {
      const { data: updated } = await sweetsApi.update(id, data);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Sweet updated successfully!');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || 'Failed to update sweet';
      toast.error(message);
    },
  });
};

export const useDeleteSweet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await sweetsApi.remove(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Sweet deleted successfully!');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || 'Failed to delete sweet';
      toast.error(message);
    },
  });
};

export const usePurchaseSweet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sweetId, quantity }: { sweetId: string; quantity: number }) => {
      const { data } = await sweetsApi.purchase(sweetId, quantity);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      toast.success('Purchase successful! 🍬');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || 'Purchase failed';
      toast.error(message);
    },
  });
};

export const useRestockSweet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sweetId, quantity }: { sweetId: string; quantity: number }) => {
      const { data } = await sweetsApi.restock(sweetId, quantity);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sweets'] });
      toast.success('Restock successful!');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || 'Restock failed';
      toast.error(message);
    },
  });
};
