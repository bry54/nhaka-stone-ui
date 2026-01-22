import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { useCallback, useEffect, useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { PurchaseData } from '@/types/purchase.types';
import { IFetchOptions } from '@/lib/generic-interfaces';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { QrCode, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assuming Button component exists
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination';
import { OrderDetailsDialog } from './order-details-dialog';

interface MyOrdersProps {
  onTotalOrdersChange: (total: number) => void;
}

export function MyOrders({ onTotalOrdersChange }: MyOrdersProps) {
  const [orders, setOrders] = useState<PurchaseData[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);


  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'orderDate', desc: true },
  ]);

  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchOrders = useCallback(async (options: IFetchOptions) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: (options.pageIndex + 1).toString(),
        limit: options.pageSize.toString(),
      });

      if (options.sorting.length > 0) {
        const order = options.sorting[0].desc ? 'DESC' : 'ASC';
        params.append('sort', `${options.sorting[0].id},${order}`);
      }

      if (options.searchQuery) {
        const searchPayload = {
          $or: [
            { orderId: { $contL: options.searchQuery } },
            // Note: complex nested search might vary by backend implementation.
            // Assuming flat search or specific handling on backend for now.
          ],
        };
        params.append('s', JSON.stringify(searchPayload));
      }

      const response = await api.get('/memorial-purchase?join=memorials', { params });

      // Handle generic response shape { data, total, page, pageCount, count }
      const { data, pageCount: newPageCount, total } = response.data;

      setOrders(data);
      setTotalOrders(total);
      setPageCount(newPageCount);
    } catch (err) {
      toast.error('Failed to fetch orders.');
      console.error(err);
      setTotalOrders(0);
      setPageCount(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      sorting,
      searchQuery,
    });
  }, [
    fetchOrders,
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
    searchQuery,
  ]);

  useEffect(() => {
    onTotalOrdersChange(totalOrders);
  }, [totalOrders, onTotalOrdersChange]);

  const handlePageChange = (newPageIndex: number) => {
    setPagination(prev => ({ ...prev, pageIndex: newPageIndex }));
  };

  const handleOrderClick = (order: PurchaseData) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  if (isLoading && orders.length === 0) {
    return <div className="flex justify-center py-10"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
  }

  if (!isLoading && orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
        <p>No orders found.</p>
        <Button variant="ghost" onClick={() => fetchOrders({ pageIndex: 0, pageSize: pagination.pageSize, sorting, searchQuery: '' })}>Refresh</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 lg:gap-9">
        {orders.map((order) => (
          <div className="col-span-1" key={order.orderId}>
            <Card
              className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
              onClick={() => handleOrderClick(order)}
            >
              <CardHeader className="justify-start bg-muted/70 gap-9 h-auto py-5 flex-row flex-wrap">
                <div className="flex flex-col gap-1.5 min-w-[100px]">
                  <span className="text-xs font-normal text-secondary-foreground">
                    Order ID
                  </span>
                  <span className="text-sm font-medium text-mono">{order.orderId}</span>
                </div>
                <div className="flex flex-col gap-1.5 min-w-[120px]">
                  <span className="text-xs font-normal text-secondary-foreground">
                    Order placed
                  </span>
                  <span className="text-sm font-medium text-mono">
                    {format(new Date(order.orderDate), 'dd MMMM, yyyy')}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 min-w-[100px]">
                  <span className="text-xs font-normal text-secondary-foreground">
                    Total
                  </span>
                  <span className="text-sm font-medium text-mono">
                    ${order.payment?.totalAmount?.toFixed(2) || order.summary?.total?.toFixed(2) || '0.00'}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 min-w-[150px]">
                  <span className="text-xs font-normal text-secondary-foreground">
                    Ship to
                  </span>
                  <span className="text-sm font-medium text-mono">
                    {order.delivery?.fullName || 'N/A'}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 min-w-[120px]">
                  <span className="text-xs font-normal text-secondary-foreground">
                    Status
                  </span>
                  <Badge variant={order.payment?.status === 'completed' ? 'success' : 'secondary'}>
                    {order.payment?.status || 'Pending'}
                  </Badge>
                </div>
                <div className="flex flex-col gap-1.5 min-w-[120px]">
                  <span className="text-xs font-normal text-secondary-foreground">
                    Memorials
                  </span>
                  <div className="flex flex-col text-xs">
                    <span className="text-foreground font-medium">
                      Configured: {order.memorials?.filter(m => m.isConfirmed).length || 0} / {order.item?.quantity || 0}
                    </span>
                    <span className="text-muted-foreground">
                      Available: {(order.item?.quantity || 0) - (order.memorials?.filter(m => m.isConfirmed).length || 0)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5 lg:p-7.5 space-y-5">
                <div className="flex items-center flex-wrap justify-between gap-4.5 p-2 pe-5">
                  <div className="flex items-center gap-3.5">
                    <Card className="flex items-center justify-center bg-gray-900 dark:bg-gray-800 h-[70px] w-[90px] shadow-none border-0">
                      <QrCode className="text-white h-8 w-8" />
                    </Card>

                    <div className="flex flex-col gap-1">
                      <Link
                        to="#"
                        className="hover:text-primary text-sm font-medium text-mono leading-5.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {order.item?.productName || 'Unknown Product'}
                      </Link>

                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-normal text-secondary-foreground uppercase">
                          Qty:
                          <span className="text-xs font-medium text-foreground ml-1">
                            {order.item?.quantity || 1}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center flex-wrap gap-1.5">
                      <span className="text-sm font-semibold text-mono">
                        ${order.item?.unitPrice?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  if (pagination.pageIndex > 0) handlePageChange(pagination.pageIndex - 1);
                }}
                disabled={pagination.pageIndex === 0}
              >
                Previous
              </Button>
            </PaginationItem>
            <PaginationItem>
              <span className="px-4 text-sm text-muted-foreground">Page {pagination.pageIndex + 1} of {pageCount}</span>
            </PaginationItem>
            <PaginationItem>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  if (pagination.pageIndex < pageCount - 1) handlePageChange(pagination.pageIndex + 1);
                }}
                disabled={pagination.pageIndex >= pageCount - 1}
              >
                Next
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Order Details Dialog */}
      <OrderDetailsDialog
        order={selectedOrder}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
