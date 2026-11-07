import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema({
    
    name : {
        type : String,
        required : [true , 'Workspace name is required']
    },

    description : {
        type : String
    },

    members : [
        {
            memberId : {
                type : mongoose.Schema.ObjectId,
                ref : 'User'
            },

            role : {
                type : String,
                enum : ['admin' , 'member'],
                default : 'member'
            }
        }
    ],

    joinCode : {
        type : String,
        required : [true , 'Join code is required']
    },

    channels : [
        {
            type : mongoose.Schema.ObjectId,
            ref : 'Channel'
        }
    ]
});


const Workspace = mongoose.model('Workspace' , workspaceSchema)
export default Workspace;