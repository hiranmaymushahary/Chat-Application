import {z} from 'zod';



export const createWorkspaceSchema = z.object({
    name: z.string({ required_error: 'Name is required' }).min(1, { message: 'Invalid name' }),
    
});

export const addMemberToWorkspaceSchema = z.object({
    memberId : z.string()
});

export const addChannelToWorkspaceSchema = z.object({
    channelName : z.string()
})