import { StatusCodes } from 'http-status-codes';
import {v4 as uuidv4} from 'uuid';

import channelRepository from '../repositories/channelRepository.js';
import userRepository from '../repositories/userRepository.js';
import workspaceRepository  from "../repositories/workspaceRepository.js";
import ClientError from '../utils/errors/clientError.js';
import ValidationError from '../utils/errors/validationError.js';



const isUserAdminOfWorkspace = (workspace, userId) => {
    console.log(workspace.members, userId);
    const response = workspace.members.find(
        (member) =>
            (member.memberId.toString() == userId ||
                member.memberId._id.toString() == userId) &&
            member.role === 'admin'
    );
    console.log(response);
    return response;
};

const isUserMemberOfWorkspace = (workspace , userId) => {
    return workspace.members.find(
            (member) => member.memberId.toString() == userId)
}

const isChannelAlreadyPartOfWorkspace = (workspace , channelName) => {
    return workspace.channels.find(
        (channel) => channel.name.toLowerCase() == channelName.toLowerCase());
}



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
        throw error;
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
        console.log(workspace.members , userId)
        const isAllowed = isUserAdminOfWorkspace(workspace , userId);

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


export const getWorkspaceService = async (workspaceId , userId) => {
    try {
        const workspace = await workspaceRepository.getById(workspaceId);
        if(!workspace){
            throw new ClientError({
                explanation : 'Invalid data sent from the client',
                message : 'Workspace not found',
                statusCode : StatusCodes.NOT_FOUND
            })
        }

        const isMember = isUserMemberOfWorkspace(workspace , userId);
        if(!isMember){
            throw new ClientError({
                explanation : 'User is not a member of workspace',
                message : 'User is not a member of workspace',
                statusCode : StatusCodes.UNAUTHORIZED
            })
        }
        return workspace;
    } catch (error) {
        console.log('Get workspace service error' , error);
        throw error;
    }
}


export const getWorkspaceByJoinCodeService = async(joinCode , userId) => {
    try {
        const workspace = await workspaceRepository.getWorkspaceByJoinCode(joinCode);
        if(!workspace){
            throw new ClientError({
                explanation : 'Invalid data sent from the client',
                message : 'Workspace not found',
                statusCode : StatusCodes.NOT_FOUND
            })
        }

        const isMember = isUserMemberOfWorkspace(workspace , userId);
        if(!isMember){
            throw new ClientError({
                explanation : 'User is not a member of workspace',
                message : 'User is not a member of workspace',
                statusCode : StatusCodes.UNAUTHORIZED
            })
        }
        return workspace
        
    } catch (error) {
        console.log('Get workspace by join code error' , error);
        throw error;
    }
}

export const updatedWorkspaceService = async(workspaceId , workspaceData , userId) => {
    try {
        const workspace = await workspaceRepository.getById(workspaceId);
        if(!workspaceId){
            throw new ClientError({
                explanation : 'User is not a member of workspace',
                message : 'workspace not found',
                statusCode : StatusCodes.NOT_FOUND
            })
        }

        const isAdmin = isUserAdminOfWorkspace(workspace , userId);
        if(!isAdmin){
            throw new ClientError({
                explanation : 'User is not admin of workspace',
                message : 'User is not a admin of workspace',
                statusCode : StatusCodes.UNAUTHORIZED
            })
        }

        const updatedWorkspace = await workspaceRepository.update(workspaceId ,
            workspaceData
        )

        return updatedWorkspace;
    } catch (error) {
        console.log('Update workspace service error' , error);
        throw error;
    }
}

export const addMemberToWorkspaceService = async(workspaceId , memberId , role , userId) => {
    try {
        const workspace = await workspaceRepository.getById(workspaceId);
        if(!workspace){
            throw new ClientError({
                explanation : 'Invalid data sent form the client',
                message : 'Workspace not found',
                statusCode : StatusCodes.NOT_FOUND
            })
        }

        const isAdmin = isUserAdminOfWorkspace(workspace , userId);
        if(!isAdmin){
            throw new ClientError({
                explanation : 'User is not admin of workspace',
                message : 'User is not admin of workspace',
                statusCode : StatusCodes.UNAUTHORIZED
            })
        }

        const isValidUser = await userRepository.getById(memberId);
        if(!isValidUser){
            throw new ClientError({
                explanation : 'Invalid data sent from the client',
                message : 'User  not found',
                statusCode : StatusCodes.NOT_FOUND
            })
        }

        const isMember = isUserMemberOfWorkspace(workspace , memberId);
        if(!isMember){
            throw new ClientError({
                explanation : 'User is already a member of workspace',
                message : 'User is  already member of workspace',
                statusCode : StatusCodes.UNAUTHORIZED
            })
        }

        const response = await workspaceRepository.addMemberToWorkspace(workspaceId , memberId , role);
        return response;

    } catch (error) {
        console.log('Add memeber to workspace service error' , error);
        throw error;
    }
}


export const addChannelToWorkspaceService = async(workspaceId , channelName , userId) => {
    try {
        const workspace = await workspaceRepository.getWorkspaceDetailsById(workspaceId);
        if(!workspace){
            throw new ClientError({
                explanation : 'User is not a member of workspace',
                message : 'workspace not found',
                statusCode : StatusCodes.NOT_FOUND
            })
        }

        const isAdmin = isUserAdminOfWorkspace(workspace , userId);
        if(!isAdmin){
            throw new ClientError({
                explanation : 'User is not a admin of workspace',
                message : 'User is not a admon of workspace',
                statusCode : StatusCodes.UNAUTHORIZED
            })
        }

        const isChannelIsPresent = isChannelAlreadyPartOfWorkspace(
            workspace,
            channelName
        );

        if(isChannelIsPresent){
            throw new ClientError ({
                explanation : 'User is not a admin of workspace',
                message : 'Channel is already part of workspace',
                statusCode : StatusCodes.FORBIDDEN
            })
        }

        const respone = await workspaceRepository.addChannelToWorkspace(
            workspaceId,
            channelName
        );

        return respone;


    } catch (error) {
        console.log('Add channel to workspace service error' , error);
        throw error;
    }
}