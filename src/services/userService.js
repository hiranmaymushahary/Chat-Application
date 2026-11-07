import bcrypt from 'bcrypt';
import { StatusCodes } from "http-status-codes";

import userRepository from "../repositories/userRepository.js";
import { createJWT } from "../utils/common/authUtils.js";
import ClientError from "../utils/errors/clientError.js";
import ValidationError from "../utils/errors/validationError.js";

export const signUpService = async (data) => {
    try {
        const user = await userRepository.create(data);
        return user;
    } catch (error) {
        console.log('User service error', error);

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
                    error: ['A user with same email or username already exist']
                },
                'A user with same email or username already exist'
            );
        }

        throw error;
    }
};


export const signInService = async(data) => {
    try {
        const user = await userRepository.getByEmail(data.email);
        if(!user){
            throw new ClientError({
                explanation : 'Invalid data sent from the client',
                message : 'No user registered with this mail',
                statusCode : StatusCodes.NOT_FOUND
            })
        }

        // match the incoming password with the hashed password

        const isMatch = bcrypt.compareSync(data.password , user.password);

        if(!isMatch){
            throw new ClientError({
                explanation : 'Invalid data sent from the client',
                message : 'Invalid password please try again',
                statusCode : StatusCodes.BAD_REQUEST
            });
        }

        return {
            username : user.username,
            avatar : user.avatar,
            email : user.email,
            token : createJWT({id : user._id , email : user.email})
        }
    } catch (error) {
        console.log('User service error' , error);
        throw error;
    }
}