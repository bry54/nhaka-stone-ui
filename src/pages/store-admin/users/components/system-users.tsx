'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { RiCheckboxCircleFill } from '@remixicon/react';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  RowSelectionState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Search, Settings2, X, Loader2, Eye, Pencil, Trash2, Copy, FileText, Check, XCircle } from 'lucide-react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import api from '@/lib/api';
import { IFetchOptions, IGetManyResponse } from '@/lib/generic-interfaces';
import { IUser } from '@/auth/lib/models';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTable,
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
import { Badge } from '@/components/ui/badge';

function ActionsCell({ row }: { row: Row<IUser> }) {
  const { copyToClipboard } = useCopyToClipboard();

  const handleCopyId = () => {
    copyToClipboard(String(row.original.id));
    const message = `User ID successfully copied: ${row.original.id}`;
    toast.custom(
      (t) => (
        <Alert
          variant="mono"
          icon="success"
          close={false}
          onClose={() => toast.dismiss(t)}
        >
          <AlertIcon>
            <RiCheckboxCircleFill />
          </AlertIcon>
          <AlertTitle>{message}</AlertTitle>
        </Alert>
      ),
      {
        position: 'top-center',
      },
    );
  };

  return (
    <div className="flex items-center gap-0.5">
      <Button
        className="size-7 bg-blue-500 hover:bg-blue-600 text-white transition-colors"
        mode="icon"
        onClick={() => { }}
        title="View"
      >
        <Eye className="size-3.5" />
      </Button>
      <Button
        className="size-7 bg-amber-500 hover:bg-amber-600 text-white transition-colors"
        mode="icon"
        onClick={() => { }}
        title="Edit"
      >
        <Pencil className="size-3.5" />
      </Button>
      <Button
        className="size-7 bg-red-500 hover:bg-red-600 text-white transition-colors"
        mode="icon"
        onClick={() => { }}
        title="Delete"
      >
        <Trash2 className="size-3.5" />
      </Button>
      <Button
        className="size-7 bg-green-500 hover:bg-green-600 text-white transition-colors"
        mode="icon"
        onClick={handleCopyId}
        title="Copy ID"
      >
        <Copy className="size-3.5" />
      </Button>
      <Button
        className="size-7 bg-purple-500 hover:bg-purple-600 text-white transition-colors"
        mode="icon"
        onClick={() => { }}
        title="View Invoices"
      >
        <FileText className="size-3.5" />
      </Button>
    </div>
  );
}

const SystemUsers = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'firstName', desc: false },
  ]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = useCallback(
    async (options: IFetchOptions) => {
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

        let url = '/user';
        if (options.searchQuery) {
          url += `?filter=firstName||cont||${options.searchQuery}&filter=lastName||cont||${options.searchQuery}&filter=email||cont||${options.searchQuery}`;
        }

        const response = await api.get<IGetManyResponse<IUser>>(
          url,
          { params }
        );

        const { data, pageCount: newPageCount, total } = response.data;

        setUsers(data);
        setTotalUsers(total);
        setPageCount(newPageCount);
      } catch (err) {
        toast.error('Failed to fetch users. Please try again later.');
        console.error(err);
        setUsers([]);
        setTotalUsers(0);
        setPageCount(0);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchUsers({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      sorting,
      searchQuery,
    });
  }, [fetchUsers, pagination.pageIndex, pagination.pageSize, sorting, searchQuery]);

  const columns = useMemo<ColumnDef<IUser>[]>(
    () => [
      {
        accessorKey: 'id',
        accessorFn: (row) => row.id,
        header: () => <DataGridTableRowSelectAll />,
        cell: ({ row }) => <DataGridTableRowSelect row={row} />,
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
        size: 51,
        meta: {
          cellClassName: '',
        },
      },
      {
        id: 'firstName',
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        header: ({ column }) => (
          <DataGridColumnHeader title="User" column={column} />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-full shrink-0 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-sm font-semibold text-primary ring-2 ring-primary/10">
              {row.original.firstName.charAt(0)}{row.original.lastName.charAt(0)}
            </div>
            <div className="flex flex-col">
              <Link
                className="font-semibold text-sm text-gray-900 hover:text-primary transition-colors"
                to="#"
              >
                {row.original.firstName} {row.original.lastName}
              </Link>
              <Link
                className="text-xs text-gray-500 hover:text-primary transition-colors"
                to="#"
              >
                {row.original.email}
              </Link>
            </div>
          </div>
        ),
        enableSorting: true,
        size: 300,
        meta: {
          headerClassName: '',
        },
      },

      {
        id: 'role',
        accessorFn: (row) => row.role,
        header: ({ column }) => (
          <DataGridColumnHeader title="Role" column={column} />
        ),
        cell: ({ row }) => (
          <Badge variant="outline" className="capitalize font-medium">
            {row.original.role}
          </Badge>
        ),
        enableSorting: true,
        size: 150,
        meta: {
          headerClassName: '',
        },
      },
      {
        id: 'location',
        accessorFn: (row) => row.location,
        header: ({ column }) => (
          <DataGridColumnHeader title="Location" column={column} />
        ),
        cell: ({ row }) => (
          <span className="text-sm text-gray-600">
            {row.original.location || 'N/A'}
          </span>
        ),
        enableSorting: true,
        size: 150,
        meta: {
          headerClassName: '',
        },
      },
      {
        id: 'allowAccess',
        accessorFn: (row) => row.allowAccess,
        header: ({ column }) => (
          <DataGridColumnHeader title="Access" column={column} />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5">
            {row.original.allowAccess ? (
              <>
                <Check className="size-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">Allowed</span>
              </>
            ) : (
              <>
                <XCircle className="size-4 text-red-600" />
                <span className="text-sm font-medium text-red-700">Denied</span>
              </>
            )}
          </div>
        ),
        enableSorting: true,
        size: 150,
        meta: {
          headerClassName: '',
        },
      },
      {
        id: 'ordersValue',
        accessorFn: (row) => row.id,
        header: ({ column }) => (
          <DataGridColumnHeader title="Orders Value" column={column} />
        ),
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900">$600</span>
            <span className="text-xs text-gray-500">6 orders</span>
          </div>
        ),
        enableSorting: false,
        size: 150,
        meta: {
          headerClassName: '',
        },
      },

      {
        id: 'actions',
        header: ({ column }) => (
          <DataGridColumnHeader title="Actions" column={column} />
        ),
        cell: ({ row }) => <ActionsCell row={row} />,
        enableSorting: false,
        size: 200,
        meta: {
          headerClassName: '',
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    columns,
    data: users,
    pageCount: pageCount,
    getRowId: (row: IUser) => String(row.id),
    state: {
      pagination,
      sorting,
      rowSelection,
    },
    columnResizeMode: 'onChange',
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const Toolbar = () => {
    const { table } = useDataGrid();

    return (
      <CardToolbar>
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

  if (isLoading && users.length === 0) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <DataGrid
      table={table}
      recordCount={totalUsers}
      tableLayout={{
        columnsPinnable: true,
        columnsMovable: true,
        columnsVisibility: true,
        cellBorder: true,
      }}
    >
      <Card>
        <CardHeader>
          <CardHeading>
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
                <Input
                  placeholder="Search Clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ps-9 w-40"
                />
                {searchQuery.length > 0 && (
                  <Button
                    mode="icon"
                    variant="ghost"
                    className="absolute end-1.5 top-1/2 -translate-y-1/2 h-6 w-6"
                    onClick={() => setSearchQuery('')}
                  >
                    <X />
                  </Button>
                )}
              </div>
            </div>
          </CardHeading>
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

export { SystemUsers };
