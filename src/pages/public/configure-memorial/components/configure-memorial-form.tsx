'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, ArrowRight, CheckCircle2, Heart, User, Calendar, MapPin } from 'lucide-react';
import { memorialConfigSchema, MemorialConfigFormValues } from './memorial-config.schema';
import { IMemorial } from '@/types/memorial.types';

interface ConfigureMemorialFormProps {
    memorial?: IMemorial;
    onSubmit: (data: MemorialConfigFormValues) => Promise<void>;
    isLoading?: boolean;
}

export function ConfigureMemorialForm({ memorial, onSubmit, isLoading }: ConfigureMemorialFormProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 3;

    const form = useForm<MemorialConfigFormValues>({
        resolver: zodResolver(memorialConfigSchema),
        defaultValues: {
            title: memorial?.title || '',
            isPublic: memorial?.isPublic ?? true,
            deceasedPerson: {
                fullName: memorial?.deceasedPerson?.fullName || '',
                dateOfBirth: memorial?.deceasedPerson?.dateOfBirth || '',
                dateOfDeath: memorial?.deceasedPerson?.dateOfDeath || '',
                placeOfDeath: memorial?.deceasedPerson?.placeOfDeath || '',
            },
        },
        mode: 'onChange',
    });

    const handleNext = async () => {
        let fieldsToValidate: (keyof MemorialConfigFormValues)[] = [];

        if (currentStep === 1) {
            fieldsToValidate = ['title'];
        } else if (currentStep === 2) {
            fieldsToValidate = ['deceasedPerson'];
        }

        const isValid = await form.trigger(fieldsToValidate);

        if (isValid && currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleFormSubmit = async (data: MemorialConfigFormValues) => {
        await onSubmit(data);
    };

    return (
        <div className="max-w-3xl mx-auto">
            {/* Progress Indicator */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    {[1, 2, 3].map((step) => (
                        <div key={step} className="flex items-center flex-1">
                            <div
                                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${step <= currentStep
                                        ? 'border-primary bg-primary text-primary-foreground'
                                        : 'border-muted bg-background text-muted-foreground'
                                    }`}
                            >
                                {step < currentStep ? (
                                    <CheckCircle2 className="w-5 h-5" />
                                ) : (
                                    <span className="font-semibold">{step}</span>
                                )}
                            </div>
                            {step < totalSteps && (
                                <div
                                    className={`flex-1 h-1 mx-2 transition-all ${step < currentStep ? 'bg-primary' : 'bg-muted'
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>Memorial Info</span>
                    <span>Deceased Person</span>
                    <span>Privacy Settings</span>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                    {/* Step 1: Memorial Title */}
                    {currentStep === 1 && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Heart className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle>Memorial Information</CardTitle>
                                        <CardDescription>Give your memorial a meaningful title</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Memorial Title</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g., In Loving Memory of John Doe"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                This will be the main title displayed on the memorial page
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 2: Deceased Person Details */}
                    {currentStep === 2 && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                        <User className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle>Deceased Person Details</CardTitle>
                                        <CardDescription>Enter information about your loved one</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="deceasedPerson.fullName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="deceasedPerson.dateOfBirth"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    Date of Birth
                                                </FormLabel>
                                                <FormControl>
                                                    <Input type="date" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="deceasedPerson.dateOfDeath"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    Date of Death
                                                </FormLabel>
                                                <FormControl>
                                                    <Input type="date" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="deceasedPerson.placeOfDeath"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4" />
                                                Place of Death
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="City, Country" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 3: Privacy Settings */}
                    {currentStep === 3 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Privacy Settings</CardTitle>
                                <CardDescription>Control who can view this memorial</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="isPublic"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">Public Memorial</FormLabel>
                                                <FormDescription>
                                                    Allow anyone with the link to view this memorial
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                                    <h4 className="font-semibold text-sm">Review Your Information</h4>
                                    <div className="space-y-1 text-sm">
                                        <p><strong>Title:</strong> {form.watch('title')}</p>
                                        <p><strong>Name:</strong> {form.watch('deceasedPerson.fullName')}</p>
                                        <p><strong>Born:</strong> {form.watch('deceasedPerson.dateOfBirth')}</p>
                                        <p><strong>Passed:</strong> {form.watch('deceasedPerson.dateOfDeath')}</p>
                                        <p><strong>Place:</strong> {form.watch('deceasedPerson.placeOfDeath')}</p>
                                        <p><strong>Visibility:</strong> {form.watch('isPublic') ? 'Public' : 'Private'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handlePrevious}
                            disabled={currentStep === 1 || isLoading}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Previous
                        </Button>

                        {currentStep < totalSteps ? (
                            <Button type="button" onClick={handleNext} disabled={isLoading}>
                                Next
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Saving...' : 'Complete Configuration'}
                                <CheckCircle2 className="w-4 h-4 ml-2" />
                            </Button>
                        )}
                    </div>
                </form>
            </Form>
        </div>
    );
}
