'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, CheckCircle2, Globe, QrCode as QrCodeIcon } from 'lucide-react';
import { IMemorial } from '@/types/memorial.types';
import { ContributionsTable } from './contributions-table';
import { AddContributionForm } from './add-contribution-form';

interface MemorialViewProps {
    memorial: IMemorial;
}

export function MemorialView({ memorial }: MemorialViewProps) {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleContributionSuccess = () => {
        // Trigger refresh of contributions table
        setRefreshTrigger((prev) => prev + 1);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="space-y-8">
            {/* Memorial Information Section */}
            <Card className="overflow-hidden">
                <CardHeader className="p-0">
                    {/* Status Badges */}
                    <div className="flex items-center justify-between gap-2 p-3 bg-gradient-to-r from-accent/30 to-accent/10">
                        <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                                size="sm"
                                variant={memorial.isConfirmed ? 'primary' : 'secondary'}
                                className="gap-1"
                            >
                                <CheckCircle2 className="w-3 h-3" />
                                {memorial.isConfirmed ? 'Confirmed' : 'Pending'}
                            </Badge>

                            <Badge
                                size="sm"
                                variant={memorial.isPublic ? 'primary' : 'outline'}
                                className="gap-1"
                            >
                                <Globe className="w-3 h-3" />
                                {memorial.isPublic ? 'Public' : 'Private'}
                            </Badge>

                            <Badge
                                size="sm"
                                variant={memorial.qrCode?.isActive ? 'primary' : 'destructive'}
                                className="gap-1"
                            >
                                <QrCodeIcon className="w-3 h-3" />
                                {memorial.qrCode?.isActive ? 'QR Active' : 'QR Inactive'}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-6">
                    {/* Deceased Person Information - Compact Layout */}
                    {memorial.deceasedPerson && (
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            {/* Image Placeholder */}
                            <div className="flex-shrink-0">
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 border-2 border-accent/20 flex items-center justify-center overflow-hidden">
                                    {/* TODO: Add deceased person image */}
                                    <div className="text-center text-muted-foreground">
                                        <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-accent/30 flex items-center justify-center">
                                            <span className="text-2xl font-bold">
                                                {memorial.deceasedPerson.fullName.charAt(0)}
                                            </span>
                                        </div>
                                        <p className="text-xs">Photo</p>
                                    </div>
                                </div>
                            </div>

                            {/* Information */}
                            <div className="flex-1 space-y-3">
                                {/* Title and Name */}
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">{memorial.title}</p>
                                    <h2 className="text-2xl md:text-3xl font-bold text-primary">
                                        {memorial.deceasedPerson.fullName}
                                    </h2>
                                </div>

                                {/* Dates and Location - Inline */}
                                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                        <div>
                                            <span className="text-muted-foreground">Born: </span>
                                            <span className="font-medium">
                                                {formatDate(memorial.deceasedPerson.dateOfBirth)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                        <div>
                                            <span className="text-muted-foreground">Passed: </span>
                                            <span className="font-medium">
                                                {formatDate(memorial.deceasedPerson.dateOfDeath)}
                                            </span>
                                        </div>
                                    </div>

                                    {memorial.deceasedPerson.placeOfDeath && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-muted-foreground" />
                                            <div>
                                                <span className="text-muted-foreground">Place: </span>
                                                <span className="font-medium">
                                                    {memorial.deceasedPerson.placeOfDeath}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground mb-1">{memorial.summary || 'No summary available'}</p>

                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Contributions Section with Tabs */}
            <Tabs defaultValue="view" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="view">View Contributions</TabsTrigger>
                    <TabsTrigger value="add">Add Contribution</TabsTrigger>
                </TabsList>

                <TabsContent value="view" className="mt-6">
                    <ContributionsTable memorialId={memorial.id} refreshTrigger={refreshTrigger} />
                </TabsContent>

                <TabsContent value="add" className="mt-6">
                    <AddContributionForm
                        memorialId={memorial.id}
                        onSuccess={handleContributionSuccess}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
