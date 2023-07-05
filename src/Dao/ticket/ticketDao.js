import { Ticket } from "../models/ticketModel.js";

export const ticketDAO = {
  createTicket: async (purchaser, amount) => {
    try {
      const code = "TICKET_" + Date.now();
      const ticket = new Ticket({ code, purchaser, amount });
      await ticket.save();
      return ticket;
    } catch (error) {
        throw error
    }
  },
};
