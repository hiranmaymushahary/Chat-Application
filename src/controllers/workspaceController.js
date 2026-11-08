import { StatusCodes } from 'http-status-codes';

import { createWorkspaceService, 
    deleteWorkspaceService,    getWorkspaceUserIsMemberOfService } from '../services/workspaceService.js';
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