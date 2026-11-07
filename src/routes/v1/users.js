import express from 'express';

import { signUp } from '../../controllers/userController.js';
import { userSignUpSchema } from '../../validators/userSchema.js';
import { validate } from '../../validators/zodValidator.js';

const router = express.Router();

/*
router.get('/' , (req , res) => {
    return res.status(200).json({message : 'Get/users'});
} );
*/

router.post('/signup' , validate(userSignUpSchema) , signUp)
export default router;