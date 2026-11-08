import { StatusCodes } from "http-status-codes";
import jwt from 'jsonwebtoken';

import { JWT_SECRET } from "../config/serverConfig.js";
import userRepository from "../repositories/userRepository.js";
import { customErrorResponse, 
    internalErrorResponse } from "../utils/common/responseObject.js";

export const isAuthenticated = async (req, res, next) => {
    try {
        // 1. Fixed typo in header key: 'x-access-token'
        const token = req.headers['x-access-token'];

        if (!token) {
            return res.status(StatusCodes.FORBIDDEN).json(
                customErrorResponse({
                    explanation: 'Invalid data sent from client',
                    message: 'No auth token provided'
                })
            );
        }

        const response = jwt.verify(token, JWT_SECRET);

        if (!response) {
            return res.status(StatusCodes.FORBIDDEN).json(
                customErrorResponse({
                    explanation: 'Invalid data sent from client',
                    message: 'Invalid auth token provided'
                })
            );
        }

        // Attach verified user payload to request and proceed
        const user = await userRepository.getById(response.id);
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json(
                customErrorResponse({
                    explanation: 'Invalid user token',
                    message: 'User does not exist'
                })
            );
        }
        req.user = user.id;
        next();
        
    } catch (error) {
        console.log('Auth middleware error', error);
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(StatusCodes.FORBIDDEN).json(
                customErrorResponse({
                    explanation: 'Invalid data sent from client',
                    message: 'Invalid auth token provided'
                })
            );
        }

       
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
            internalErrorResponse(error)
        );
    }
};