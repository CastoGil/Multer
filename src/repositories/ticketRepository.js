import { ticketDAO } from "../Dao/ticket/ticketDao.js";
import EErrors from "../services/errors/enums.js";
import CustomError from "../services/errors/CustomError.js";

export const ticketRepository = {
  createTicket: async (purchaser, amount) => {
    try {
      return await ticketDAO.createTicket(purchaser, amount)
    } catch (error) {
      throw new CustomError({
        name: "Database Error",
        cause: "Failed to create Ticket",
        code: EErrors.DATABASE_ERROR,
        message:"Error in communication with repository database create ticket"
      })
  }
}}
