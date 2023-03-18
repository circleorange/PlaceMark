import mongoose from "mongoose";
import { User } from "./user.js";

export const userMongoStore = {
  async getAllUsers() {
    const users = await User.find().lean();
    return users;
  },
  async getUserById(id) {
    if (id) {
      try {
        const user = await User.findOne({ _id: id }).lean();
        return user;
      } catch (error) {
        console.log("User ID not found");
        return null;
      }
    }
    return null;
  },
  async addUser(user) {
    const newUser = new User(user);
    const userObj = await newUser.save();
    const u = await this.getUserById(userObj._id);
    return u;
  },
  async getUserByEmail(email) {
    const user = await User.findOne({ email: email }).lean();
    return user;
  },
  async deleteUserById(id) {
    try {
      await User.deleteOne({ _id: id });
    } catch (error) {
      console.log("User ID not found");
    }
  },
  async deleteAll() {
    await User.deleteMany({});
  },
};