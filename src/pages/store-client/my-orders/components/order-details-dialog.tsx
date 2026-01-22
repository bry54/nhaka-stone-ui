import { format } from 'date-fns';
import { PurchaseData } from '@/types/purchase.types';
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Memorials } from './memorials';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRef } from 'react';


interface OrderDetailsDialogProps {
  order: PurchaseData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailsDialog({ order, open, onOpenChange }: OrderDetailsDialogProps) {
  if (!order) return null;

  const configuredMemorials = order.memorials?.filter(m => m.isConfirmed) || [];
  const availableMemorials = (order.item?.quantity || 0) - configuredMemorials.length;
  const parentRef = useRef<any | null>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="mx-auto grow w-full max-w-[1320px] flex flex-col px-10 gap-0 overflow-hidden [&>button]:hidden"
        variant="fullscreen"
      >
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
            <span>
              Order ID:{' '}
              <span className="font-mono font-medium text-foreground">
                {order.orderId}
              </span>
            </span>
            <span>•</span>
            <span>{format(new Date(order.orderDate), 'dd MMMM, yyyy')}</span>
            <span>•</span>
            <span>{order.payment?.status}</span>
            <span>•</span>
            <span>
              $
              {order.payment?.totalAmount?.toFixed(2) ||
                order.summary?.total?.toFixed(2) ||
                '0.00'}
            </span>
          </div>
        </DialogHeader>
        <ScrollArea
          className="grow py-0 mb-5 ps-0 pe-3 -me-7"
          viewportRef={parentRef}
        >
          <DialogBody className="space-y-6">
            {order?.id && <Memorials memorialPurchaseId={order.id} />}
          </DialogBody>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
