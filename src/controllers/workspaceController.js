import { StatusCodes } from 'http-status-codes';

import {               addChannelToWorkspaceService,addMemberToWorkspaceService,createWorkspaceService, 
       deleteWorkspaceService, 
       getWorkspaceByJoinCodeService, 
       getWorkspaceService,
       getWorkspaceUserIsMemberOfService, 
       updatedWorkspaceService} from '../services/workspaceService.js';
import {
    customErrorResponse,
    internalErrorResponse,
    successResponse
} from '../utils/common/responseObject.js';

export const createWorkspaceController = async (req, res) => {
    try {
        const response = await createWorkspaceService({
            ...req.body,
            owner: req.user
        });
        return res.status(StatusCodes.CREATED).json(successResponse(response , 'Workspace created succesfully'));
    } catch (error) {
        console.log(error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));
    }
};


export const getWorkspaceUserIsMemberOfController = async(req , res) => {
    try {
        const response = await getWorkspaceUserIsMemberOfService(req.user);
        return res.status(StatusCodes.OK)
        .json(successResponse(response , 'Workspace fetched Succesfully'))
    } catch (error) {
        console.log(error);

        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(internalErrorResponse(error));
    }
};

export const deleteWorkspaceController = async (req, res) => {
    try {
        const response = await deleteWorkspaceService(
            req.params.workspaceId,
            req.user
        );

        return res 
        .status(StatusCodes.OK)
        .json(successResponse(response , 'Workspace deleted Succesfully'));

    } catch (error) {
        console.log(error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));
    }
};

export const getWorkspaceController = async (req, res) => {
    try {
        const response = await getWorkspaceService(
            req.params.workspaceId,
            req.user
        );

        return res 
        .status(StatusCodes.OK)
        .json(successResponse(response , 'Workspace git it !!'));

    } catch (error) {
        console.log(error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));
    }
};

export const getWorkspaceByJoinCodeController = async (req, res) => {
    try {
        const response = await getWorkspaceByJoinCodeService(
            req.params.joinCode,
            req.user
        );

        return res 
        .status(StatusCodes.OK)
        .json(successResponse(response , 'Workspace fetched succesfully'));

    } catch (error) {
        console.log('Get workspace  join code controller error' , error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));
    }
};


export const updateWorkspaceController = async(req , res) => {
    try {
        const response = await updatedWorkspaceService(
            req.params.workspaceId,
            req.body,
            req.user
        );

        return res 
        .status(StatusCodes.OK)
        .json(successResponse(response , 'Workspace updated succesfully succesfully'));

    } catch (error) {
        console.log('update workspace controller error' , error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }

        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));
    }
}


export const addMemberToWorkspaceController = async (req, res) => {
    try {
        const response = await addMemberToWorkspaceService(
            req.params.workspaceId,
            req.body.memberId,
            req.body.role || 'member',
            req.user
        );
        return res
            .status(StatusCodes.OK)
            .json(
                successResponse(response, 'Member added to workspace successfully')
            );
    } catch (error) {
        console.log('add member to workspace controller error', error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));
    }
};



export const addChannelToWorkspaceController = async (req, res) => {
    try {
        const response = await addChannelToWorkspaceService(
            req.params.workspaceId,
            req.body.channelName,
            req.user

            
        );
        return res
            .status(StatusCodes.OK)
            .json(
                successResponse(response, 'Channel added to workspace successfully')
            );
    } catch (error) {
        console.log('add channel to workspace controller error', error);
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalErrorResponse(error));
    }
};