'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, MessageSquare } from 'lucide-react';
import { IContribution, ContributionType } from '@/types/contribution.types';
import api from '@/lib/api';

interface ContributionsTableProps {
    memorialId: string;
    refreshTrigger?: number;
}

export function ContributionsTable({ memorialId, refreshTrigger }: ContributionsTableProps) {
    const [contributions, setContributions] = useState<IContribution[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchContributions = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await api.get(`/contribution?filter=memorialId||eq||${memorialId}`);

                // Handle different response formats
                const data = response.data;
                if (Array.isArray(data)) {
                    setContributions(data);
                } else if (data && Array.isArray(data.data)) {
                    setContributions(data.data);
                } else if (data && Array.isArray(data.contributions)) {
                    setContributions(data.contributions);
                } else {
                    console.warn('Unexpected response format:', data);
                    setContributions([]);
                }
            } catch (err: any) {
                console.error('Error fetching contributions:', err);
                setError('Failed to load contributions');
                setContributions([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchContributions();
    }, [memorialId, refreshTrigger]);

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

    const getContributorName = (contribution: IContribution) => {
        if (contribution.createdBy) {
            return `${contribution.createdBy.firstName} ${contribution.createdBy.lastName}`;
        }
        return contribution.contributorName || 'Anonymous';
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
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3 p-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">Contributions</CardTitle>
                        <CardDescription>
                            {contributions.length} {contributions.length === 1 ? 'contribution' : 'contributions'}
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
                                    <TableRow key={contribution.id}>
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
                                                <a
                                                    href={contribution.mediaUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-primary hover:underline"
                                                >
                                                    View Media
                                                </a>
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
                )}
            </CardContent>
        </Card>
    );
}
