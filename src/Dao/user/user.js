import { userModel } from "../models/user.js";
const userDAO = {
  getUserByEmail: async (email) => {
    return await userModel.findOne({ email });
  },
  getUserById: async (uid) => {
    return await userModel.findById(uid);
  },
  createUser: async (first_name, last_name, age, email, password, role) => {
    const user = new userModel({
      first_name,
      last_name,
      age,
      email,
      password,
      role,
    });
    return await user.save();
  },
  getUserByResetToken: async (resetToken) => {
    return await userModel.findOne({ resetToken: resetToken });
  },
};

export default userDAO;
