'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import { Loader2, MessageSquare, Calendar, User, FileText, Image as ImageIcon, Video, Music } from 'lucide-react';
import { IContribution, ContributionType } from '@/types/contribution.types';
import api from '@/lib/api';

interface ContributionsTableProps {
    memorialId: string;
    refreshTrigger?: number;
}

export function ContributionsTable({ memorialId, refreshTrigger }: ContributionsTableProps) {
    const [contributions, setContributions] = useState<IContribution[]>([]);
    const [totalContributions, setTotalContributions] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedContribution, setSelectedContribution] = useState<IContribution | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 10;

    useEffect(() => {
        const fetchContributions = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const params = new URLSearchParams({
                    page: (currentPage + 1).toString(),
                    limit: pageSize.toString(),
                    sort: 'createdAt,DESC',
                });

                const response = await api.get(
                    `/contribution?filter=memorialId||eq||${memorialId}`,
                    { params }
                );

                // Handle different response formats
                const data = response.data;
                if (Array.isArray(data)) {
                    setContributions(data);
                    setTotalContributions(data.length);
                    setPageCount(1);
                } else if (data && Array.isArray(data.data)) {
                    setContributions(data.data);
                    setTotalContributions(data.total || data.data.length);
                    setPageCount(data.pageCount || 1);
                } else if (data && Array.isArray(data.contributions)) {
                    setContributions(data.contributions);
                    setTotalContributions(data.total || data.contributions.length);
                    setPageCount(data.pageCount || 1);
                } else {
                    console.warn('Unexpected response format:', data);
                    setContributions([]);
                    setTotalContributions(0);
                    setPageCount(0);
                }
            } catch (err: any) {
                console.error('Error fetching contributions:', err);
                setError('Failed to load contributions');
                setContributions([]);
                setTotalContributions(0);
                setPageCount(0);
            } finally {
                setIsLoading(false);
            }
        };

        fetchContributions();
    }, [memorialId, refreshTrigger, currentPage]);

    const getContributionTypeBadge = (type: ContributionType) => {
        const variants: Record<ContributionType, 'primary' | 'secondary' | 'success' | 'info' | 'warning'> = {
            [ContributionType.BIOGRAPHY]: 'primary',
            [ContributionType.COMMENT]: 'secondary',
            [ContributionType.STORY]: 'info',
            [ContributionType.PRAYER]: 'success',
            [ContributionType.IMAGE]: 'warning',
            [ContributionType.AUDIO]: 'warning',
            [ContributionType.VIDEO]: 'warning',
        };

        const labels: Record<ContributionType, string> = {
            [ContributionType.BIOGRAPHY]: 'Biography',
            [ContributionType.COMMENT]: 'Comment',
            [ContributionType.STORY]: 'Story',
            [ContributionType.PRAYER]: 'Prayer',
            [ContributionType.IMAGE]: 'Image',
            [ContributionType.AUDIO]: 'Audio',
            [ContributionType.VIDEO]: 'Video',
        };

        return (
            <Badge variant={variants[type]} size="sm">
                {labels[type]}
            </Badge>
        );
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getContributorName = (contribution: IContribution) => {
        if (contribution.createdBy) {
            return `${contribution.createdBy.firstName} ${contribution.createdBy.lastName}`;
        }
        return contribution.contributorName || 'Anonymous';
    };

    const handleRowClick = (contribution: IContribution) => {
        setSelectedContribution(contribution);
        setIsModalOpen(true);
    };

    const handlePageChange = (newPageIndex: number) => {
        setCurrentPage(newPageIndex);
    };

    const renderMediaPreview = (contribution: IContribution) => {
        if (!contribution.mediaUrl) return null;

        switch (contribution.type) {
            case ContributionType.IMAGE:
                return (
                    <div className="mt-4">
                        <img
                            src={contribution.mediaUrl}
                            alt="Contribution media"
                            className="max-w-full h-auto rounded-lg border"
                        />
                    </div>
                );
            case ContributionType.VIDEO:
                return (
                    <div className="mt-4">
                        <video
                            src={contribution.mediaUrl}
                            controls
                            className="max-w-full h-auto rounded-lg border"
                        >
                            Your browser does not support the video tag.
                        </video>
                    </div>
                );
            case ContributionType.AUDIO:
                return (
                    <div className="mt-4">
                        <audio
                            src={contribution.mediaUrl}
                            controls
                            className="w-full"
                        >
                            Your browser does not support the audio tag.
                        </audio>
                    </div>
                );
            default:
                return (
                    <div className="mt-4">
                        <a
                            href={contribution.mediaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                        >
                            View Media
                        </a>
                    </div>
                );
        }
    };

    if (isLoading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                    <p>{error}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3 p-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">Contributions</CardTitle>
                            <CardDescription>
                                {totalContributions} {totalContributions === 1 ? 'contribution' : 'contributions'}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {contributions.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No contributions yet. Be the first to share a memory or message.</p>
                        </div>
                    ) : (
                        <>
                            <div className="border rounded-lg overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Contributor</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Content</TableHead>
                                            <TableHead className="text-right">Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {contributions.map((contribution) => (
                                            <TableRow
                                                key={contribution.id}
                                                onClick={() => handleRowClick(contribution)}
                                                className="cursor-pointer hover:bg-muted/50 transition-colors"
                                            >
                                                <TableCell className="font-medium">
                                                    {getContributorName(contribution)}
                                                </TableCell>
                                                <TableCell>
                                                    {getContributionTypeBadge(contribution.type)}
                                                </TableCell>
                                                <TableCell className="max-w-md">
                                                    {contribution.textContent ? (
                                                        <p className="line-clamp-2 text-sm text-muted-foreground">
                                                            {contribution.textContent}
                                                        </p>
                                                    ) : contribution.mediaUrl ? (
                                                        <span className="text-sm text-primary">
                                                            View Media
                                                        </span>
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground">No content</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right text-sm text-muted-foreground">
                                                    {formatDate(contribution.createdAt)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {pageCount > 1 && (
                                <div className="flex justify-center mt-4">
                                    <Pagination>
                                        <PaginationContent>
                                            <PaginationItem>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        if (currentPage > 0)
                                                            handlePageChange(currentPage - 1);
                                                    }}
                                                    disabled={currentPage === 0}
                                                >
                                                    Previous
                                                </Button>
                                            </PaginationItem>
                                            <PaginationItem>
                                                <span className="px-4 text-sm text-muted-foreground">
                                                    Page {currentPage + 1} of {pageCount}
                                                </span>
                                            </PaginationItem>
                                            <PaginationItem>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        if (currentPage < pageCount - 1)
                                                            handlePageChange(currentPage + 1);
                                                    }}
                                                    disabled={currentPage >= pageCount - 1}
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
                </CardContent>
            </Card>

            {/* Detailed Contribution Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    {selectedContribution && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <DialogTitle>Contribution Details</DialogTitle>
                                    {getContributionTypeBadge(selectedContribution.type)}
                                </div>
                                <DialogDescription>
                                    View full details of this contribution
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6 mt-4">
                                {/* Contributor Information */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm">
                                        <User className="w-4 h-4 text-muted-foreground" />
                                        <span className="font-medium">Contributor:</span>
                                        <span className="text-muted-foreground">
                                            {getContributorName(selectedContribution)}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                        <span className="font-medium">Posted:</span>
                                        <span className="text-muted-foreground">
                                            {formatDateTime(selectedContribution.createdAt)}
                                        </span>
                                    </div>
                                </div>

                                {/* Text Content */}
                                {selectedContribution.textContent && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-muted-foreground" />
                                            <span className="font-medium text-sm">Content:</span>
                                        </div>
                                        <div className="bg-muted/50 rounded-lg p-4">
                                            <p className="text-sm whitespace-pre-wrap">
                                                {selectedContribution.textContent}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Media Preview */}
                                {selectedContribution.mediaUrl && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            {selectedContribution.type === ContributionType.IMAGE && (
                                                <ImageIcon className="w-4 h-4 text-muted-foreground" />
                                            )}
                                            {selectedContribution.type === ContributionType.VIDEO && (
                                                <Video className="w-4 h-4 text-muted-foreground" />
                                            )}
                                            {selectedContribution.type === ContributionType.AUDIO && (
                                                <Music className="w-4 h-4 text-muted-foreground" />
                                            )}
                                            <span className="font-medium text-sm">Media:</span>
                                        </div>
                                        {renderMediaPreview(selectedContribution)}
                                    </div>
                                )}

                                {!selectedContribution.textContent && !selectedContribution.mediaUrl && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <p className="text-sm">No content available for this contribution.</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
