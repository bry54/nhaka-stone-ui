import { useCallback, useEffect, useState } from 'react';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { Loader2, Search, Calendar, FileText, Image, Video, Music, MessageSquare, Heart, BookOpen, Check, X, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router-dom';
import api from '@/lib/api';
import { IFetchOptions, IGetManyResponse } from '@/lib/generic-interfaces';
import { IContribution, ContributionType } from '@/types/contribution.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from '@/components/ui/dialog';

const getContributionIcon = (type: ContributionType) => {
  switch (type) {
    case ContributionType.BIOGRAPHY:
      return <BookOpen className="h-4 w-4" />;
    case ContributionType.COMMENT:
      return <MessageSquare className="h-4 w-4" />;
    case ContributionType.STORY:
      return <FileText className="h-4 w-4" />;
    case ContributionType.PRAYER:
      return <Heart className="h-4 w-4" />;
    case ContributionType.IMAGE:
      return <Image className="h-4 w-4" />;
    case ContributionType.AUDIO:
      return <Music className="h-4 w-4" />;
    case ContributionType.VIDEO:
      return <Video className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

const getContributionVariant = (type: ContributionType): 'primary' | 'secondary' | 'destructive' | 'outline' => {
  switch (type) {
    case ContributionType.BIOGRAPHY:
      return 'primary';
    case ContributionType.PRAYER:
      return 'secondary';
    case ContributionType.IMAGE:
    case ContributionType.VIDEO:
    case ContributionType.AUDIO:
      return 'outline';
    default:
      return 'secondary';
  }
};

export function MemorialsReviewContent() {
  const [searchParams] = useSearchParams();
  const memorialIdFromQuery = searchParams.get('memorialId');

  const [contributions, setContributions] = useState<IContribution[]>([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchInput, setSearchInput] = useState<string>('');
  const [selectedContribution, setSelectedContribution] = useState<IContribution | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'createdAt', desc: true },
  ]);

  const fetchContributions = useCallback(
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

        // Build filter URL
        let filterUrl = '/contribution?';

        // Add memorialId filter if provided
        if (memorialIdFromQuery) {
          filterUrl += `filter=memorialId||eq||${memorialIdFromQuery}&`;
        }

        // Add search filter if provided
        if (options.searchQuery) {
          filterUrl += `filter=textContent||cont||${options.searchQuery}&`;
        }

        const response = await api.get<IGetManyResponse<IContribution>>(
          filterUrl.slice(0, -1), // Remove trailing & or ?
          { params }
        );

        const { data, pageCount: newPageCount, total } = response.data;

        setContributions(data);
        setTotalContributions(total);
        setPageCount(newPageCount);
      } catch (err) {
        toast.error('Failed to fetch contributions. Please try again later.');
        console.error(err);
        setContributions([]);
        setTotalContributions(0);
        setPageCount(0);
      } finally {
        setIsLoading(false);
      }
    },
    [memorialIdFromQuery]
  );

  useEffect(() => {
    fetchContributions({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      sorting,
      searchQuery,
    });
  }, [fetchContributions, pagination.pageIndex, pagination.pageSize, sorting, searchQuery]);

  const handlePageChange = (newPageIndex: number) => {
    setPagination((prev) => ({ ...prev, pageIndex: newPageIndex }));
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setPagination((prev) => ({ ...prev, pageIndex: 0 })); // Reset to first page
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInitials = (name?: string) => {
    if (!name) return 'AN';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleViewDetails = (contribution: IContribution) => {
    setSelectedContribution(contribution);
    setIsModalOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedContribution) return;

    setIsProcessing(true);
    try {
      await api.patch(`/contribution/${selectedContribution.id}`, {
        isHidden: false,
      });

      toast.success('Contribution approved successfully');
      setIsModalOpen(false);

      // Refresh the list
      fetchContributions({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sorting,
        searchQuery,
      });
    } catch (err) {
      toast.error('Failed to approve contribution');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecline = async () => {
    if (!selectedContribution) return;

    setIsProcessing(true);
    try {
      await api.patch(`/contribution/${selectedContribution.id}`, {
        isHidden: true,
      });

      toast.success('Contribution declined successfully');
      setIsModalOpen(false);

      // Refresh the list
      fetchContributions({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sorting,
        searchQuery,
      });
    } catch (err) {
      toast.error('Failed to decline contribution');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderContribution = (contribution: IContribution) => {
    const contributorName =
      contribution.createdBy?.fullName ||
      contribution.contributorName ||
      'Anonymous';

    return (
      <Card
        key={contribution.id}
        className="hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => handleViewDetails(contribution)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Avatar className="h-10 w-10">
                <AvatarImage src={contribution.createdBy?.avatar} />
                <AvatarFallback>{getInitials(contributorName)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-sm truncate">{contributorName}</p>
                  <Badge variant={getContributionVariant(contribution.type)} className="gap-1">
                    {getContributionIcon(contribution.type)}
                    {contribution.type}
                  </Badge>
                  {contribution.isHidden && (
                    <Badge variant="destructive" className="text-xs">
                      Hidden
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(contribution.createdAt)}</span>
                  {contribution.memorial && (
                    <>
                      <span>•</span>
                      <span className="truncate">
                        Memorial: {contribution.memorial.deceasedPerson?.fullName}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {contribution.textContent && (
            <p className="text-sm text-foreground/90 line-clamp-3 mb-3">
              {contribution.textContent}
            </p>
          )}
          {contribution.mediaUrl && (
            <div className="mt-2">
              {contribution.type === ContributionType.IMAGE && (
                <img
                  src={contribution.mediaUrl}
                  alt="Contribution media"
                  className="rounded-md max-h-48 object-cover w-full"
                />
              )}
              {contribution.type === ContributionType.VIDEO && (
                <video
                  src={contribution.mediaUrl}
                  controls
                  className="rounded-md max-h-48 w-full"
                />
              )}
              {contribution.type === ContributionType.AUDIO && (
                <audio src={contribution.mediaUrl} controls className="w-full" />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (isLoading && contributions.length === 0) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-stretch gap-5 lg:gap-7.5">
      {/* Header with Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div>
          <h3 className="text-lg text-mono font-semibold">
            {totalContributions} {totalContributions === 1 ? 'Contribution' : 'Contributions'}
          </h3>
          {memorialIdFromQuery && (
            <p className="text-sm text-muted-foreground mt-1">
              Filtered by Memorial ID: {memorialIdFromQuery}
            </p>
          )}
        </div>

        {/* Search */}
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contributions..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              className="pl-9"
            />
          </div>
          <Button onClick={handleSearch} variant="outline">
            Search
          </Button>
        </div>
      </div>

      {/* Contributions List */}
      {!isLoading && contributions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
          <FileText className="h-12 w-12 mb-4 opacity-50" />
          <p className="text-lg font-medium">No contributions found</p>
          <p className="text-sm mt-1">
            {searchQuery
              ? 'Try adjusting your search criteria'
              : 'Contributions will appear here once they are created'}
          </p>
          {searchQuery && (
            <Button
              variant="ghost"
              onClick={() => {
                setSearchInput('');
                setSearchQuery('');
              }}
              className="mt-4"
            >
              Clear Search
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {contributions.map((contribution) => renderContribution(contribution))}
          </div>

          {/* Pagination */}
          {pageCount > 1 && (
            <div className="flex justify-center pt-5">
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
            </div>
          )}
        </>
      )}

      {/* Contribution Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedContribution && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Contribution Details
                </DialogTitle>
                <DialogDescription>
                  Review and manage this contribution
                </DialogDescription>
              </DialogHeader>

              <DialogBody className="space-y-4">
                {/* Contributor Info with Timestamp */}
                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={selectedContribution.createdBy?.avatar} />
                    <AvatarFallback>
                      {getInitials(
                        selectedContribution.createdBy?.fullName ||
                        selectedContribution.contributorName ||
                        'Anonymous'
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-base truncate">
                          {selectedContribution.createdBy?.fullName ||
                            selectedContribution.contributorName ||
                            'Anonymous'}
                        </p>
                        {selectedContribution.createdBy?.email && (
                          <p className="text-xs text-muted-foreground truncate">
                            {selectedContribution.createdBy.email}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <Badge variant={getContributionVariant(selectedContribution.type)} className="gap-1">
                          {getContributionIcon(selectedContribution.type)}
                          {selectedContribution.type}
                        </Badge>
                        {selectedContribution.isHidden && (
                          <Badge variant="destructive">Hidden</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDate(selectedContribution.createdAt)}</span>
                      </div>
                      {selectedContribution.memorial && (
                        <>
                          <span>•</span>
                          <span className="truncate">
                            Memorial: {selectedContribution.memorial.deceasedPerson?.fullName || 'Memorial'}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>


                {/* Text Content */}
                {selectedContribution.textContent && (
                  <div className="space-y-1.5">
                    <h4 className="font-semibold text-sm text-muted-foreground">Content</h4>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {selectedContribution.textContent}
                      </p>
                    </div>
                  </div>
                )}

                {/* Media Content */}
                {selectedContribution.mediaUrl && (
                  <div className="space-y-1.5">
                    <h4 className="font-semibold text-sm text-muted-foreground">Media</h4>
                    <div className="rounded-lg overflow-hidden border">
                      {selectedContribution.type === ContributionType.IMAGE && (
                        <img
                          src={selectedContribution.mediaUrl}
                          alt="Contribution media"
                          className="w-full h-auto"
                        />
                      )}
                      {selectedContribution.type === ContributionType.VIDEO && (
                        <video
                          src={selectedContribution.mediaUrl}
                          controls
                          className="w-full h-auto"
                        />
                      )}
                      {selectedContribution.type === ContributionType.AUDIO && (
                        <div className="p-3">
                          <audio src={selectedContribution.mediaUrl} controls className="w-full" />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Contribution ID */}
                <div className="space-y-1.5">
                  <h4 className="font-semibold text-sm text-muted-foreground">ID</h4>
                  <p className="text-xs font-mono text-muted-foreground break-all">
                    {selectedContribution.id}
                  </p>
                </div>
              </DialogBody>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isProcessing}
                >
                  Close
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDecline}
                  disabled={isProcessing}
                  className="gap-2"
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                  Decline
                </Button>
                <Button
                  onClick={handleApprove}
                  disabled={isProcessing}
                  className="gap-2"
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  Approve
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
