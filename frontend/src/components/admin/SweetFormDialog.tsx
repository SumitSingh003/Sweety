import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useCreateSweet, useUpdateSweet } from '@/hooks/useSweets';
import { Sweet, SweetFormData } from '@/types';
import { Plus, Pencil } from 'lucide-react';

const sweetSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  category: z.string().min(1, 'Category is required').max(50, 'Category too long'),
  description: z.string().max(500, 'Description too long').optional(),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
  quantity: z.coerce.number().int().min(0, 'Quantity cannot be negative'),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

interface SweetFormDialogProps {
  sweet?: Sweet;
  trigger?: React.ReactNode;
}

export const SweetFormDialog = ({ sweet, trigger }: SweetFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const createMutation = useCreateSweet();
  const updateMutation = useUpdateSweet();
  const isEditing = !!sweet;

  const form = useForm<SweetFormData>({
    resolver: zodResolver(sweetSchema),
    defaultValues: {
      name: sweet?.name || '',
      category: sweet?.category || '',
      description: sweet?.description || '',
      price: sweet?.price || 0,
      quantity: sweet?.quantity || 0,
      imageUrl: sweet?.imageUrl || '',
    },
  });

  const onSubmit = async (data: SweetFormData) => {
    const submitData = {
      ...data,
      imageUrl: data.imageUrl || null,
      description: data.description || null,
    };

    if (isEditing) {
      await updateMutation.mutateAsync({ id: sweet.id, data: submitData });
    } else {
      await createMutation.mutateAsync(submitData as SweetFormData);
    }
    setOpen(false);
    form.reset();
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2 gradient-warm shadow-warm">
            <Plus className="h-4 w-4" />
            Add Sweet
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {isEditing ? 'Edit Sweet' : 'Add New Sweet'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Chocolate Truffle" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Chocolates" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Delicious handmade chocolate..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="gradient-warm"
              >
                {isPending ? 'Saving...' : isEditing ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export const EditSweetButton = ({ sweet }: { sweet: Sweet }) => {
  return (
    <SweetFormDialog
      sweet={sweet}
      trigger={
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Pencil className="h-4 w-4" />
        </Button>
      }
    />
  );
};
