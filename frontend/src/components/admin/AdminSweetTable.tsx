import { Sweet } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { EditSweetButton } from './SweetFormDialog';
import { RestockDialog } from './RestockDialog';
import { useDeleteSweet } from '@/hooks/useSweets';
import { Trash2, Package, AlertTriangle, Loader2 } from 'lucide-react';

interface AdminSweetTableProps {
  sweets: Sweet[] | undefined;
  isLoading: boolean;
}

export const AdminSweetTable = ({ sweets, isLoading }: AdminSweetTableProps) => {
  const deleteMutation = useDeleteSweet();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!sweets || sweets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
          <Package className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="font-display text-xl font-semibold text-foreground">
          No sweets yet
        </h3>
        <p className="mt-2 text-muted-foreground">
          Add your first sweet to get started
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Sweet</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-center">Stock</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sweets.map((sweet) => (
            <TableRow key={sweet.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  {sweet.imageUrl ? (
                    <img
                      src={sweet.imageUrl}
                      alt={sweet.name}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-foreground">{sweet.name}</p>
                    {sweet.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {sweet.description}
                      </p>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{sweet.category}</Badge>
              </TableCell>
              <TableCell className="text-right font-semibold">
                ₹{Number(sweet.price).toFixed(2)}
              </TableCell>
              <TableCell className="text-center">
                {sweet.quantity === 0 ? (
                  <Badge variant="destructive" className="gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Out
                  </Badge>
                ) : sweet.quantity <= 5 ? (
                  <Badge className="bg-warning text-warning-foreground">
                    {sweet.quantity}
                  </Badge>
                ) : (
                  <Badge className="bg-success text-success-foreground">
                    {sweet.quantity}
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <RestockDialog sweet={sweet} />
                  <EditSweetButton sweet={sweet} />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete {sweet.name}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete
                          the sweet from your inventory.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate(sweet.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
