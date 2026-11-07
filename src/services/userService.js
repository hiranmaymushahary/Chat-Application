import userRepository from "../repositories/userRepository.js";
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