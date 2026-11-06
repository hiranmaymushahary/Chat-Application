import User from "../schema/user.js";
import crudRepository from "./crudRepository.js";

export const getUserByEmail = async (email) => {
    const user = await User.findOne({email});
    return user;
}

export const getUserByName = async (name) => {
    const user = await User.findOne({username : name});
    return user;
}
/* 
export const createUser = async(user) => {
    const newUser = await User.create(user);
    return newUser;
}

export const getUsers = async() => {
    const users = await User.find();
    return users;
}

export const getUserById = async(id) => {
    const user = await User.findById(id);
    return user;
}

export const deleteUser = async(id) => {
    const user = await User.findByIdAndDelete(id);
    return user;
}

export const updateUser = async(id) => {
    const user = await User.findByIdAndUpdate(id);
    return user;
}

*/

const crudMethods = crudRepository(User);

export default crudMethods;
