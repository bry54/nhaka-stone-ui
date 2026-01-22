import { z } from 'zod';

export const memorialConfigSchema = z.object({
    title: z.string().min(3, { message: 'Memorial title must be at least 3 characters' }),
    isPublic: z.boolean(),
    deceasedPerson: z.object({
        fullName: z.string().min(2, { message: 'Full name is required' }),
        dateOfBirth: z.string().min(1, { message: 'Date of birth is required' }),
        dateOfDeath: z.string().min(1, { message: 'Date of death is required' }),
        placeOfDeath: z.string().min(2, { message: 'Place of death is required' }),
    }),
});

export type MemorialConfigFormValues = z.infer<typeof memorialConfigSchema>;
