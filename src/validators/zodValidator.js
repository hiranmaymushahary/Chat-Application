import { StatusCodes } from 'http-status-codes';

import { customErrorResponse } from '../utils/common/responseObject.js';

export const validate = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync(req.body);
            next();
        } catch (error) {
            console.log('Validation error in zod validator', error);
            let explanation = [];

            const issueList = error.issues || error.errors;

            if (issueList) {
                issueList.forEach((key) => {
                    explanation.push(key.message);
                });
            }

            return res.status(StatusCodes.BAD_REQUEST).json(
                customErrorResponse({
                    message: `Validation error : ${explanation[0]}`,
                    explanation: explanation
                })
            );
        }
    };
};