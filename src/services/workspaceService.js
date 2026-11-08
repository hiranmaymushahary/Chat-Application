import { StatusCodes } from 'http-status-codes';
import {v4 as uuidv4} from 'uuid';

import channelRepository from '../repositories/channelRepository.js';
import workspaceRepository from "../repositories/workspaceRepository.js"
import ClientError from '../utils/errors/clientError.js';
import ValidationError from '../utils/errors/validationError.js';

export const createWorkspaceService = async(workspaceData) => {

   try {
    const joinCode = uuidv4().substring(0,6).toUpperCase();

    const response = await workspaceRepository.create({
        name : workspaceData.name,
        description : workspaceData.description,
        joinCode
    });

    await workspaceRepository.addMemberToWorkspace(
        response._id,
        workspaceData.owner,
        'admin'
    );

    const updatedWorkspce = await 
    workspaceRepository.addChannelToWorkspace(response._id , 'general');
    return updatedWorkspce;
     
   } catch (error) {

    console.log('create workspace service error' , error);

    if (error.name === 'ValidationError') {
        throw new ValidationError(
            { error: error.errors },
            error.message
        );
    }

    // Catch both MongoServerError and MongooseError wrapping E11000 duplicate keys
    if (error.code === 11000 || (error.name === 'MongooseError' && error.message.includes('exist'))) {
        throw new ValidationError(
            {
                error: ['A workspace with same details  already exist']
            },
            'A workspace with same details  already exist'
        );
    }
    throw error;
    
   }
};


export const getWorkspaceUserIsMemberOfService = async(userId) => {
    try {
        const response = await workspaceRepository.fetchAllWorkspaceByMemberId(userId);
        return response;
    } catch (error) {
        console.log('Get workspace user is member of service error' , error);
    }
};

export const deleteWorkspaceService = async (workspaceId, userId) => {
    try {
        const workspace = await workspaceRepository.getById(workspaceId);

        if(!workspace){
            throw new ClientError({
                explanation : 'User is not a admin in this .',
                message : 'Workspace is not found',
                statusCode : StatusCodes.NOT_FOUND
            });

        }
        const isAllowed = workspace.members.find(
            (member) => member.memberId.toString() == userId && member.role === 'admin'
        );

        if (isAllowed) {
            await channelRepository.deleteMany(workspace.channels);

            const response = await workspaceRepository.delete(workspaceId);
            return response;
        }

        throw new ClientError({
            explanation : 'User is not a admin in this .',
            message : 'User is not allowed to delete the workspace',
            statusCode : StatusCodes.UNAUTHORIZED
        })

    } catch (error) {
        console.log(error);
        throw error;
    }
};