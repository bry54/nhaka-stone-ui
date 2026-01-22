'use client';

import { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Container } from '@/components/common/container';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { IMemorial } from '@/types/memorial.types';
import { MemorialView } from './components';
import { ConfigureMemorialForm, MemorialConfigFormValues } from '../configure-memorial/components';
import api from '@/lib/api';
import { toast } from 'sonner';

export function MemorialPortalPage() {
    const { id } = useParams<{ id: string }>();

    const [memorial, setMemorial] = useState<IMemorial | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch memorial data
    useEffect(() => {
        const fetchMemorial = async () => {
            if (!id) {
                setError('Memorial ID is required');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const response = await api.get(`/memorial/public/${id}`);
                setMemorial(response.data);
            } catch (err: any) {
                console.error('Error fetching memorial:', err);
                setError(
                    err.response?.data?.message ||
                    'Failed to load memorial. Please check the ID and try again.'
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchMemorial();
    }, [id]);

    // Check if memorial is configured
    const isConfigured = memorial?.deceasedPerson?.fullName ? true : false;

    // Handle configuration submission
    const handleConfigureSubmit = async (data: MemorialConfigFormValues) => {
        if (!id) return;

        try {
            setIsSubmitting(true);

            await api.patch(`/memorial/${id}`, {
                title: data.title,
                isPublic: data.isPublic,
                deceasedPerson: data.deceasedPerson,
            });

            toast.success('Memorial configured successfully!');

            // Refresh memorial data to switch to memorial view
            const response = await api.get(`/memorial/public/${id}`);
            setMemorial(response.data);
        } catch (err: any) {
            console.error('Error updating memorial:', err);
            toast.error(
                err.response?.data?.message ||
                'Failed to configure memorial. Please try again.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex grow flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/20">
            <main className="grow py-12 lg:py-20" role="content">
                <Container>
                    {/* Loading State */}
                    {isLoading && (
                        <Card className="max-w-2xl mx-auto">
                            <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
                                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                                <p className="text-lg text-muted-foreground">Loading memorial...</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Error State */}
                    {!isLoading && error && (
                        <div className="max-w-2xl mx-auto space-y-4">
                            <Alert variant="destructive">
                                <AlertIcon>
                                    <AlertCircle className="w-5 h-5" />
                                </AlertIcon>
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                            <div className="flex justify-center">
                                <Button variant="outline" onClick={() => window.location.href = '/'}>
                                    Return to Home
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* CASE 1: Memorial Not Configured - Show Configuration Form */}
                    {!isLoading && !error && memorial && !isConfigured && (
                        <Fragment>
                            <div className="text-center mb-8">
                                <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                                    Configure Your Memorial
                                </h1>
                                <p className="text-lg text-muted-foreground">
                                    Complete the following steps to set up your memorial
                                </p>
                            </div>

                            <ConfigureMemorialForm
                                memorial={memorial}
                                onSubmit={handleConfigureSubmit}
                                isLoading={isSubmitting}
                            />
                        </Fragment>
                    )}

                    {/* CASE 2: Memorial Configured - Show Memorial View with Contributions */}
                    {!isLoading && !error && memorial && isConfigured && (
                        <MemorialView memorial={memorial} />
                    )}
                </Container>
            </main>
        </div>
    );
}
