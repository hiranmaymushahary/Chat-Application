import bcrypt from 'bcrypt';
import mongoose from 'mongoose';


const userSchema = new mongoose.Schema(
    {
        email : {
            type : String,
            required : [true , 'Email is required'],
            unique : [true , 'Email already exist'],
            match : [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please fill a valid email address'
            ]
        },

        password : {
            type : String,
            required : [true , 'Password is required'],

        },


        username : {
            type : String,
            required : [true , 'Username is required'],
            unique : [true , 'Username already exist'],
            minLength : [3 , 'username must be atleast 3 characters'],
        },

        avatar : {
            type : String
        }
    },
    {timestamps : true}
);

userSchema.pre('save' , function saveUser(){
    const user = this;

    const SALT = bcrypt.genSaltSync(9);
    const hashedPassword = bcrypt.hashSync(user.password , SALT);
    user.password = hashedPassword;

    user.avatar = `https://robohash.org/${user.username}`;
    
})

const User = mongoose.model('User' , userSchema);

export default User;