import { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Column,
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  RowSelectionState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Download, Settings2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { IFetchOptions, IGetManyResponse } from '@/lib/generic-interfaces';
import { PurchaseData } from '@/types/purchase.types';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardFooter,
  CardHeader,
  CardTable,
  CardTitle,
  CardToolbar,
} from '@/components/ui/card';
import { DataGrid, useDataGrid } from '@/components/ui/data-grid';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridColumnVisibility } from '@/components/ui/data-grid-column-visibility';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import {
  DataGridTable,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from '@/components/ui/data-grid-table';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface IColumnFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
}

interface InvoicingProps {
  userId?: string;
}

const Invoicing = ({ userId }: InvoicingProps = {}) => {
  const [purchases, setPurchases] = useState<PurchaseData[]>([]);
  const [totalPurchases, setTotalPurchases] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [rowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'createdAt', desc: true },
  ]);

  const fetchPurchases = useCallback(async (options: Partial<IFetchOptions>) => {
    setIsLoading(true);
    try {
      const params: Record<string, any> = {
        page: (options.pageIndex ?? 0) + 1,
        limit: options.pageSize ?? 5,
      };

      // Add sorting
      if (options.sorting && options.sorting.length > 0) {
        const sortField = options.sorting[0].id;
        const sortOrder = options.sorting[0].desc ? 'DESC' : 'ASC';
        //params.sort = `${sortField}|${sortOrder}`;
      }

      // Add user filter if userId is provided
      if (userId) {
        params['filter.customer.id'] = `$eq:${userId}`;
      }

      const response = await api.get<IGetManyResponse<PurchaseData>>(
        '/memorial-purchase',
        { params }
      );

      setPurchases(response.data.data);
      setTotalPurchases(response.data.total);
      setPageCount(response.data.pageCount);
    } catch (err) {
      toast.error('Failed to fetch purchases');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchPurchases({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      sorting,
    });
  }, [fetchPurchases, pagination.pageIndex, pagination.pageSize, sorting]);

  const getStatusBadge = (status: string): { label: string; variant: keyof BadgeProps['variant'] } => {
    switch (status) {
      case 'completed':
        return { label: 'Paid', variant: 'success' };
      case 'pending':
        return { label: 'Upcoming', variant: 'warning' };
      case 'failed':
        return { label: 'Declined', variant: 'destructive' };
      default:
        return { label: status, variant: 'default' };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const ColumnInputFilter = <TData, TValue>(
    { column }: IColumnFilterProps<TData, TValue>
  ) => {
    return (
      <Input
        placeholder="Filter..."
        value={(column.getFilterValue() as string) ?? ''}
        onChange={(event) => column.setFilterValue(event.target.value)}
        size="sm"
        className="max-w-40"
      />
    );
  };

  const columns = useMemo<ColumnDef<PurchaseData>[]>(
    () => [
      {
        accessorKey: 'id',
        accessorFn: (row) => row.id,
        header: () => <DataGridTableRowSelectAll />,
        cell: ({ row }) => <DataGridTableRowSelect row={row} />,
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
        size: 48,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'orderId',
        accessorFn: (row) => row.orderId,
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Order ID"
            filter={<ColumnInputFilter column={column} />}
            column={column}
          />
        ),
        cell: (info) => {
          return info.row.original.orderId;
        },
        enableSorting: true,
        size: 210,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'status',
        accessorFn: (row) => row.payment.status,
        header: ({ column }) => (
          <DataGridColumnHeader title="Status" column={column} />
        ),
        cell: (info) => {
          const statusInfo = getStatusBadge(info.row.original.payment.status);
          return (
            <Badge variant={statusInfo.variant} appearance="light">
              {statusInfo.label}
            </Badge>
          );
        },
        enableSorting: true,
        size: 150,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'orderDate',
        accessorFn: (row) => row.orderDate,
        header: ({ column }) => (
          <DataGridColumnHeader title="Date" column={column} />
        ),
        cell: (info) => {
          return formatDate(info.row.original.orderDate);
        },
        enableSorting: true,
        size: 170,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'customer',
        accessorFn: (row) => row.customer.fullName,
        header: ({ column }) => (
          <DataGridColumnHeader title="Customer" column={column} />
        ),
        cell: (info) => {
          return info.row.original.customer.fullName;
        },
        enableSorting: true,
        size: 170,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'amount',
        accessorFn: (row) => row.payment.totalAmount,
        header: ({ column }) => (
          <DataGridColumnHeader title="Amount" column={column} />
        ),
        cell: (info) => {
          return formatCurrency(
            info.row.original.payment.totalAmount,
            info.row.original.payment.currency
          );
        },
        enableSorting: true,
        size: 160,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'actions',
        header: () => '',
        enableSorting: false,
        cell: () => {
          return (
            <Button mode="link" underlined="dashed">
              Download
            </Button>
          );
        },
        size: 90,
      },
    ],
    [],
  );

  useEffect(() => {
    const selectedRowIds = Object.keys(rowSelection);

    if (selectedRowIds.length > 0) {
      toast(`Total ${selectedRowIds.length} are selected.`, {
        description: `Selected row IDs: ${selectedRowIds}`,
        action: {
          label: 'Undo',
          onClick: () => console.log('Undo'),
        },
      });
    }
  }, [rowSelection]);

  const table = useReactTable({
    columns,
    data: purchases,
    pageCount,
    getRowId: (row: PurchaseData) => row.id || row.orderId,
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
  });

  const Toolbar = () => {
    const { table } = useDataGrid();

    return (
      <CardToolbar>
        <Button variant="outline">
          <Download />
          Download PDF
        </Button>
        <DataGridColumnVisibility
          table={table}
          trigger={
            <Button variant="outline">
              <Settings2 />
              Columns
            </Button>
          }
        />
      </CardToolbar>
    );
  };

  if (isLoading && purchases.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Billing and Invoicing</CardTitle>
        </CardHeader>
        <CardTable>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        </CardTable>
      </Card>
    );
  }

  return (
    <DataGrid
      table={table}
      recordCount={totalPurchases}
      tableLayout={{
        columnsPinnable: true,
        columnsMovable: true,
        columnsVisibility: true,
        cellBorder: true,
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Billing and Invoicing</CardTitle>
          <Toolbar />
        </CardHeader>
        <CardTable>
          <ScrollArea>
            <DataGridTable />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardTable>
        <CardFooter>
          <DataGridPagination />
        </CardFooter>
      </Card>
    </DataGrid>
  );
};

export { Invoicing };
