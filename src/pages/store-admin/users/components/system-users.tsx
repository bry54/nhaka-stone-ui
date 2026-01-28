'use client';

import { useMemo, useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';

function ActionsCell({
  row,
  onView,
  onEdit,
  onDelete
}: {
  row: Row<IUser>;
  onView: (user: IUser) => void;
  onEdit: (user: IUser) => void;
  onDelete: (user: IUser) => void;
}) {
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
        onClick={() => onView(row.original)}
        title="View"
      >
        <Eye className="size-3.5" />
      </Button>
      <Button
        className="size-7 bg-amber-500 hover:bg-amber-600 text-white transition-colors"
        mode="icon"
        onClick={() => onEdit(row.original)}
        title="Edit"
      >
        <Pencil className="size-3.5" />
      </Button>
      <Button
        className="size-7 bg-red-500 hover:bg-red-600 text-white transition-colors"
        mode="icon"
        onClick={() => onDelete(row.original)}
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

export interface SystemUsersRef {
  openAddUserSheet: () => void;
}

const SystemUsers = forwardRef<SystemUsersRef>((_props, ref) => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<IUser | null>(null);
  const [newUserData, setNewUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    location: '',
    allowAccess: true,
  });
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

  const handleViewUser = (user: IUser) => {
    setSelectedUser(user);
    setIsViewSheetOpen(true);
  };

  const handleEditUser = (user: IUser) => {
    setEditFormData(user);
    setIsEditSheetOpen(true);
  };

  const handleDeleteUser = async (user: IUser) => {
    toast.custom(
      (t) => (
        <Alert variant="mono" icon="warning">
          <AlertIcon>
            <Trash2 className="size-5" />
          </AlertIcon>
          <AlertTitle>Delete {user.firstName} {user.lastName}?</AlertTitle>
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.dismiss(t)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={async () => {
                toast.dismiss(t);
                try {
                  await api.delete(`/user/${user.id}`);
                  toast.success('User deleted successfully');
                  fetchUsers({
                    pageIndex: pagination.pageIndex,
                    pageSize: pagination.pageSize,
                    sorting,
                    searchQuery,
                  });
                } catch (err) {
                  toast.error('Failed to delete user');
                  console.error(err);
                }
              }}
            >
              Delete
            </Button>
          </div>
        </Alert>
      ),
      {
        position: 'top-center',
        duration: Infinity,
      }
    );
  };

  const handleSaveEdit = async () => {
    if (!editFormData) return;

    try {
      await api.patch(`/user/${editFormData.id}`, editFormData);
      toast.success('User updated successfully');
      setIsEditSheetOpen(false);
      fetchUsers({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sorting,
        searchQuery,
      });
    } catch (err) {
      toast.error('Failed to update user');
      console.error(err);
    }
  };

  const handleAddUser = () => {
    setIsAddSheetOpen(true);
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    openAddUserSheet: handleAddUser,
  }));

  const handleSaveNewUser = async () => {
    if (!newUserData.firstName || !newUserData.lastName || !newUserData.email || !newUserData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await api.post('/user', newUserData);
      toast.success('User created successfully');
      setIsAddSheetOpen(false);
      setNewUserData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        location: '',
        allowAccess: true,
      });
      fetchUsers({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sorting,
        searchQuery,
      });
    } catch (err) {
      toast.error('Failed to create user');
      console.error(err);
    }
  };

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
        cell: ({ row }) => (
          <ActionsCell
            row={row}
            onView={handleViewUser}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />
        ),
        enableSorting: false,
        size: 200,
        meta: {
          headerClassName: '',
        },
      },
    ],
    [handleViewUser, handleEditUser, handleDeleteUser],
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
    <>
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

      {/* View User Sheet */}
      <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
        <SheetContent className="sm:max-w-[540px]">
          <SheetHeader>
            <SheetTitle>User Details</SheetTitle>
            <SheetDescription>
              View user information
            </SheetDescription>
          </SheetHeader>
          {selectedUser && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b">
                <div className="size-16 rounded-full shrink-0 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-xl font-semibold text-primary ring-2 ring-primary/10">
                  {selectedUser.firstName.charAt(0)}{selectedUser.lastName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.firstName} {selectedUser.lastName}</h3>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-500">First Name</Label>
                  <p className="text-sm font-medium mt-1">{selectedUser.firstName}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Last Name</Label>
                  <p className="text-sm font-medium mt-1">{selectedUser.lastName}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Email</Label>
                  <p className="text-sm font-medium mt-1">{selectedUser.email}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Role</Label>
                  <Badge variant="outline" className="capitalize mt-1">{selectedUser.role}</Badge>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Location</Label>
                  <p className="text-sm font-medium mt-1">{selectedUser.location || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Access Status</Label>
                  <div className="flex items-center gap-1.5 mt-1">
                    {selectedUser.allowAccess ? (
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
                </div>
                <div>
                  <Label className="text-xs text-gray-500">User ID</Label>
                  <p className="text-sm font-mono text-gray-600 mt-1">{selectedUser.shortId}</p>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Edit User Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent className="sm:max-w-[540px]">
          <SheetHeader>
            <SheetTitle>Edit User</SheetTitle>
            <SheetDescription>
              Update user information
            </SheetDescription>
          </SheetHeader>
          {editFormData && (
            <div className="mt-6 space-y-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={editFormData.firstName}
                    onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={editFormData.lastName}
                    onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={editFormData.location || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="allowAccess"
                    checked={editFormData.allowAccess}
                    onChange={(e) => setEditFormData({ ...editFormData, allowAccess: e.target.checked })}
                    className="size-4"
                  />
                  <Label htmlFor="allowAccess">Allow Access</Label>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsEditSheetOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  className="flex-1"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Add User Sheet */}
      <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
        <SheetContent className="sm:max-w-[540px]">
          <SheetHeader>
            <SheetTitle>Add New User</SheetTitle>
            <SheetDescription>
              Create a new user account
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="newFirstName">First Name *</Label>
                <Input
                  id="newFirstName"
                  value={newUserData.firstName}
                  onChange={(e) => setNewUserData({ ...newUserData, firstName: e.target.value })}
                  className="mt-1"
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <Label htmlFor="newLastName">Last Name *</Label>
                <Input
                  id="newLastName"
                  value={newUserData.lastName}
                  onChange={(e) => setNewUserData({ ...newUserData, lastName: e.target.value })}
                  className="mt-1"
                  placeholder="Enter last name"
                />
              </div>
              <div>
                <Label htmlFor="newEmail">Email *</Label>
                <Input
                  id="newEmail"
                  type="email"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  className="mt-1"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="newPassword">Password *</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newUserData.password}
                  onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                  className="mt-1"
                  placeholder="Enter password"
                />
              </div>
              <div>
                <Label htmlFor="newLocation">Location</Label>
                <Input
                  id="newLocation"
                  value={newUserData.location}
                  onChange={(e) => setNewUserData({ ...newUserData, location: e.target.value })}
                  className="mt-1"
                  placeholder="Enter location"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="newAllowAccess"
                  checked={newUserData.allowAccess}
                  onChange={(e) => setNewUserData({ ...newUserData, allowAccess: e.target.checked })}
                  className="size-4"
                />
                <Label htmlFor="newAllowAccess">Allow Access</Label>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddSheetOpen(false);
                  setNewUserData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    location: '',
                    allowAccess: true,
                  });
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveNewUser}
                className="flex-1"
              >
                Create User
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
});

SystemUsers.displayName = 'SystemUsers';

export { SystemUsers };
