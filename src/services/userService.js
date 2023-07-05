import userRepository from '../Dao/user/user.js';

export const userService = {
  getUserByEmail: async (email) => {
    return await userRepository.getUserByEmail(email);
  },
  getUserById: async (uid)=>{
    return await userRepository.getUserById(uid)
  },
  createUser: async (first_name, last_name, age, email, password, role) => {
    return await userRepository.createUser(first_name, last_name, age, email, password, role);
  },
  getUserByResetToken: async (resetToken) => {
    return await userRepository.getUserByResetToken(resetToken);
  },
};






