import userDAO from "../Dao/user/user.js";
import EErrors from "../services/errors/enums.js";
import CustomError from "../services/errors/CustomError.js";

export const userRepository = {
  getUserByEmail: async (email) => {
    try {
      return await userDAO.getUserByEmail({ email: email });
    } catch (error) {
      throw new CustomError({
        name: "Database Error",
        cause: "Failed to get user by email",
        code: EErrors.DATABASE_ERROR,
        message:"Error in communication with repository database get User By Email "
      })
  }},
  createUser: async (first_name, last_name, age, email, password, role) => {
    try {
      return await userDAO.createUser(first_name, last_name, age, email, password, role)
    } catch (error) {
      throw new CustomError({
        name: "Database Error",
        cause: "Failed to create User",
        code: EErrors.DATABASE_ERROR,
        message:"Error in communication with repository database create User "
      })
    
  }},
  getUserByResetToken: async (resetToken) => {
    try {
      return await userDAO.getUserByResetToken({ resetToken: resetToken });
    } catch (error) {
      throw new CustomError({
        name: "Database Error",
        cause: "Failed to get user by reset token",
        code: EErrors.DATABASE_ERROR,
        message: "Error in communication with repository database get User By Reset Token",
      });
    }
  },
};
