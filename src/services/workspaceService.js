import {v4 as uuidv4} from 'uuid';

import workspaceRepository from "../repositories/workspaceRepository.js"
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
}