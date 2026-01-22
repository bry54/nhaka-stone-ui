'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Upload, X } from 'lucide-react';
import { ContributionType } from '@/types/contribution.types';
import { useAuth } from '@/auth/context/auth-context';
import api from '@/lib/api';
import { toast } from 'sonner';

const contributionSchema = z.object({
    contributorName: z.string().optional(),
    type: z.nativeEnum(ContributionType, {
        required_error: 'Please select a contribution type',
    }),
    textContent: z.string().optional(),
    mediaUrl: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
});

type ContributionFormValues = z.infer<typeof contributionSchema>;

interface AddContributionFormProps {
    memorialId: string;
    onSuccess?: () => void;
}

export function AddContributionForm({ memorialId, onSuccess }: AddContributionFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const { user } = useAuth();

    const form = useForm<ContributionFormValues>({
        resolver: zodResolver(contributionSchema),
        defaultValues: {
            contributorName: '',
            type: ContributionType.COMMENT,
            textContent: '',
            mediaUrl: '',
        },
        mode: 'onChange',
    });

    // Auto-fill contributor name if user is authenticated
    useEffect(() => {
        if (user) {
            form.setValue('contributorName', `${user.fullName}`);
        }
    }, [user, form]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
        setUploadProgress(0);
    };

    const handleSubmit = async (data: ContributionFormValues) => {
        try {
            // Validate that at least one content type is provided
            if (!selectedFile && !data.textContent && !data.mediaUrl) {
                toast.error('Please provide either a message, media file, or media URL');
                return;
            }

            setIsSubmitting(true);

            // If there's a file, upload it first
            if (selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);
                formData.append('memorialId', memorialId);
                formData.append('type', data.type);
                formData.append('textContent', data.textContent || '');
                if (data.contributorName) {
                    formData.append('contributorName', data.contributorName);
                }

                await api.post('/contribution/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = progressEvent.total
                            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                            : 0;
                        setUploadProgress(percentCompleted);
                    },
                });
            } else {
                // No file, just submit the data
                await api.post('/contribution', {
                    memorialId,
                    type: data.type,
                    textContent: data.textContent,
                    mediaUrl: data.mediaUrl,
                    contributorName: data.contributorName,
                });
            }

            toast.success('Contribution added successfully!');
            form.reset({
                contributorName: user ? user.fullName : '',
                type: ContributionType.COMMENT,
                textContent: '',
                mediaUrl: '',
            });
            removeFile();
            onSuccess?.();
        } catch (err: any) {
            console.error('Error adding contribution:', err);
            toast.error(err.response?.data?.message || 'Failed to add contribution. Please try again.');
        } finally {
            setIsSubmitting(false);
            setUploadProgress(0);
        }
    };

    const contributionTypes = [
        { value: ContributionType.BIOGRAPHY, label: 'Biography' },
        { value: ContributionType.COMMENT, label: 'Comment' },
        { value: ContributionType.STORY, label: 'Story' },
        { value: ContributionType.PRAYER, label: 'Prayer' },
        { value: ContributionType.IMAGE, label: 'Image' },
        { value: ContributionType.AUDIO, label: 'Audio' },
        { value: ContributionType.VIDEO, label: 'Video' },
    ];

    const selectedType = form.watch('type');
    const isMediaType = [ContributionType.IMAGE, ContributionType.AUDIO, ContributionType.VIDEO].includes(selectedType);

    const getAcceptedFileTypes = () => {
        switch (selectedType) {
            case ContributionType.IMAGE:
                return 'image/*';
            case ContributionType.AUDIO:
                return 'audio/*';
            case ContributionType.VIDEO:
                return 'video/*';
            default:
                return '';
        }
    };

    const getFileTypeLabel = () => {
        switch (selectedType) {
            case ContributionType.IMAGE:
                return 'image';
            case ContributionType.AUDIO:
                return 'audio';
            case ContributionType.VIDEO:
                return 'video';
            default:
                return 'file';
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3 p-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Heart className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">Add Your Contribution</CardTitle>
                        <CardDescription>
                            {user ? `Contributing as ${user.fullName}` : 'Share anonymously'}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        {!user && (
                            <FormField
                                control={form.control}
                                name="contributorName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Your Name (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Anonymous" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contribution Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {contributionTypes.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="textContent"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your Message</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Share your thoughts, memories, or prayers..."
                                            className="min-h-[120px] resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {isMediaType && (
                            <div className="space-y-4">
                                {/* File Upload */}
                                <div className="space-y-2">
                                    <FormLabel>Upload {getFileTypeLabel()}</FormLabel>
                                    <div className="border-2 border-dashed rounded-lg p-4 hover:border-primary/50 transition-colors">
                                        {selectedFile ? (
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        <Upload className="w-5 h-5 text-primary flex-shrink-0" />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium truncate">
                                                                {selectedFile.name}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={removeFile}
                                                        className="flex-shrink-0"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                                {uploadProgress > 0 && uploadProgress < 100 && (
                                                    <div className="w-full bg-accent/20 rounded-full h-2">
                                                        <div
                                                            className="bg-primary h-2 rounded-full transition-all"
                                                            style={{ width: `${uploadProgress}%` }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <label className="flex flex-col items-center gap-2 cursor-pointer">
                                                <Upload className="w-8 h-8 text-muted-foreground" />
                                                <div className="text-center">
                                                    <p className="text-sm font-medium">
                                                        Click to upload {getFileTypeLabel()}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        or drag and drop
                                                    </p>
                                                </div>
                                                <input
                                                    type="file"
                                                    accept={getAcceptedFileTypes()}
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>

                                {/* OR divider */}
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-background px-2 text-muted-foreground">Or</span>
                                    </div>
                                </div>

                                {/* Media URL */}
                                <FormField
                                    control={form.control}
                                    name="mediaUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Media URL</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="url"
                                                    placeholder="https://example.com/media.jpg"
                                                    {...field}
                                                    disabled={!!selectedFile}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting
                                ? uploadProgress > 0
                                    ? `Uploading... ${uploadProgress}%`
                                    : 'Submitting...'
                                : 'Submit Contribution'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
