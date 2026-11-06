import express from 'express';
import { PORT } from './config/serverConfig.js';

const app = express();

app.get('/ping' , (req , res) => {
    return res.status(200).json({message : 'pong'});
});

app.listen(PORT , () =>{
    console.log(`Server is running on the port ${PORT}`);
})