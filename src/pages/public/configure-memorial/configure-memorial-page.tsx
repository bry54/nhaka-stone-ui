'use client';

import { Fragment, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Container } from '@/components/common/container';
import { Alert, AlertDescription, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { ConfigureMemorialForm, MemorialConfigFormValues } from './components';
import { IMemorial } from '@/types/memorial.types';
import api from '@/lib/api';
import { toast } from 'sonner';

export function ConfigureMemorialPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [memorial, setMemorial] = useState<IMemorial | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);

  // Fetch memorial data on mount
  useEffect(() => {
    const fetchMemorial = async () => {
      if (!id) {
        setError('Memorial ID is required');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await api.get(`/memorial/${id}`);
        setMemorial(response.data);

        // Check if already configured
        if (response.data.deceasedPerson?.fullName) {
          setIsConfigured(true);
        }
      } catch (err: any) {
        console.error('Error fetching memorial:', err);
        setError(err.response?.data?.message || 'Failed to load memorial. Please check the ID and try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemorial();
  }, [id]);

  const handleSubmit = async (data: MemorialConfigFormValues) => {
    if (!id) return;

    try {
      setIsSubmitting(true);

      await api.patch(`/memorial/${id}`, {
        title: data.title,
        isPublic: data.isPublic,
        deceasedPerson: data.deceasedPerson,
      });

      toast.success('Memorial configured successfully!');
      setIsConfigured(true);

      // Refresh memorial data
      const response = await api.get(`/memorials/${id}`);
      setMemorial(response.data);
    } catch (err: any) {
      console.error('Error updating memorial:', err);
      toast.error(err.response?.data?.message || 'Failed to configure memorial. Please try again.');
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
                <Button variant="outline" onClick={() => navigate('/')}>
                  Return to Home
                </Button>
              </div>
            </div>
          )}

          {/* Success State - Already Configured */}
          {!isLoading && !error && isConfigured && memorial && (
            <div className="max-w-2xl mx-auto space-y-6">
              <Alert variant="success" className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                <AlertIcon>
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                </AlertIcon>
                <AlertTitle className="text-green-900 dark:text-green-100">Memorial Configured Successfully!</AlertTitle>
                <AlertDescription className="text-green-800 dark:text-green-200">
                  Your memorial has been configured and is now ready to be viewed.
                </AlertDescription>
              </Alert>

              <Card>
                <CardContent className="py-8 space-y-4">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold">{memorial.title}</h2>
                    <p className="text-lg text-muted-foreground">{memorial.deceasedPerson.fullName}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Date of Birth</p>
                      <p className="font-medium">{new Date(memorial.deceasedPerson.dateOfBirth).toLocaleDateString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Date of Death</p>
                      <p className="font-medium">{new Date(memorial.deceasedPerson.dateOfDeath).toLocaleDateString()}</p>
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <p className="text-sm text-muted-foreground">Place of Death</p>
                      <p className="font-medium">{memorial.deceasedPerson.placeOfDeath}</p>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4 pt-6">
                    <Button onClick={() => setIsConfigured(false)}>
                      Edit Configuration
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/')}>
                      Return to Home
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Form State - Not Yet Configured */}
          {!isLoading && !error && !isConfigured && memorial && (
            <Fragment>
              <div className="text-center mb-8">
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">Configure Your Memorial</h1>
                <p className="text-lg text-muted-foreground">
                  Complete the following steps to set up your memorial
                </p>
              </div>

              <ConfigureMemorialForm
                memorial={memorial}
                onSubmit={handleSubmit}
                isLoading={isSubmitting}
              />
            </Fragment>
          )}
        </Container>
      </main>
    </div>
  );
}
