import { StatusCodes } from "http-status-codes";

class ValidationError extends Error {
    constructor(errorDetails, message) {
        super(message);
        this.name = 'ValidationError';
        this.statusCode = StatusCodes.BAD_REQUEST;

        let explanation = [];

        if (Array.isArray(errorDetails.error)) {
            explanation = errorDetails.error;
        } else if (typeof errorDetails.error === 'object' && errorDetails.error !== null) {
            Object.keys(errorDetails.error).forEach((key) => {
                explanation.push(errorDetails.error[key].message || errorDetails.error[key]);
            });
        } else {
            explanation.push(message);
        }

        this.explanation = explanation;
    }
}

export default ValidationError;