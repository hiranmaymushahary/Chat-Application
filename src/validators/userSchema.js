import { z } from 'zod';

export const userSignUpSchema = z.object({
    email: z
        .string({ message: 'Email Required' })
        .email({ message: 'Invalid email' }),
    password: z
        .string({ message: 'Password Required' }),
    username: z
        .string({ message: 'Username Required' })
        .min(3, { message: 'String must contain at least 3 character(s)' })
});