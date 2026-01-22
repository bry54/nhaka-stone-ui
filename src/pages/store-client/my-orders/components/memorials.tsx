import { useCallback, useEffect, useState } from 'react';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { IFetchOptions } from '@/lib/generic-interfaces';
import { Button } from '@/components/ui/button.tsx';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination.tsx';
import { MemorialItem } from '../../components/common/memorial-item';


interface MemorialsListProps {
  memorialPurchaseId: string
}

export function Memorials({ memorialPurchaseId }: MemorialsListProps) {
  const [memorials, setMemorials] = useState<any[]>([]);
  const [totalMemorials, setTotalMemorials] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMemorial, setSelectedMemorial] = useState<any | null>(null);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'createdAt', desc: true },
  ]);

  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchMemorials = useCallback(async (options: IFetchOptions) => {
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

      const response = await api.get(
        `/memorial?filter=memorialPurchaseId||eq||${memorialPurchaseId}`,
        { params },
      );

      // Handle generic response shape { data, total, page, pageCount, count }
      const { data, pageCount: newPageCount, total } = response.data;

      setMemorials(data);
      setTotalMemorials(total);
      setPageCount(newPageCount);
    } catch (err) {
      toast.error('Failed to fetch memorials. Please try again later.');
      console.error(err);
      setTotalMemorials(0);
      setPageCount(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMemorials({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      sorting,
      searchQuery,
    });
  }, [
    fetchMemorials,
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
    searchQuery,
  ]);

  const handlePageChange = (newPageIndex: number) => {
    setPagination((prev) => ({ ...prev, pageIndex: newPageIndex }));
  };

  const renderItem = (item: any, index: number) => (
    <MemorialItem
      key={item.id}
      memorial={item}
    />
  );

  if (isLoading && memorials.length === 0) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (!isLoading && memorials.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
        <p>No orders found.</p>
        <Button
          variant="ghost"
          onClick={() =>
            fetchMemorials({
              pageIndex: 0,
              pageSize: pagination.pageSize,
              sorting,
              searchQuery: '',
            })
          }
        >
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <span className="text-lg font-medium text-mono">Memorials</span>

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
                    if (pagination.pageIndex > 0)
                      handlePageChange(pagination.pageIndex - 1);
                  }}
                  disabled={pagination.pageIndex === 0}
                >
                  Previous
                </Button>
              </PaginationItem>
              <PaginationItem>
                <span className="px-4 text-sm text-muted-foreground">
                  Page {pagination.pageIndex + 1} of {pageCount}
                </span>
              </PaginationItem>
              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination.pageIndex < pageCount - 1)
                      handlePageChange(pagination.pageIndex + 1);
                  }}
                  disabled={pagination.pageIndex >= pageCount - 1}
                >
                  Next
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-2">
        {memorials.map((item, index) => {
          return renderItem(item, index);
        })}
      </div>
    </div>
  );
}
