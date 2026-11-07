import { StatusCodes } from "http-status-codes";

import { signUpService } from "../services/userService.js";
import { customErrorResponse,
     internalErrorResponse, 
     succesResponse } from "../utils/common/responseObject.js";


export const signUp = async(req , res) => {
    try {
        const user = await signUpService(req.body);

        return res
        .status(StatusCodes.CREATED)
        .json(succesResponse(user , 'User created succesfully'));
    } catch (error) {
        console.log('User controller error' , error);
        
        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }

        if (error.name === 'ValidationError') {
            return res.status(StatusCodes.BAD_REQUEST).json(customErrorResponse(error));
        }

        return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(internalErrorResponse(error));
    }
};