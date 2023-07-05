import nodemailer from "nodemailer";
import { getLogger } from "../utils.js";
const logger = getLogger();
// Función para enviar el correo electrónico//
export const sendPasswordResetEmail = async (to, resetPasswordLink) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "casto782@gmail.com",
        pass: "wtjzdeeieyqrkadf",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    const mailOptions = {
      from: "casto782@gmail.com",
      to: to,
      subject: "Restablecimiento de contraseña",
      html: `
        <p>Se ha solicitado un restablecimiento de contraseña para tu cuenta.</p>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${resetPasswordLink}">${resetPasswordLink}</a>
        <p>Si no has solicitado este restablecimiento, puedes ignorar este correo electrónico.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    logger.info("Correo electrónico enviado con éxito");
  } catch (error) {
   logger.warning("Error al enviar el correo electrónico", error);
  }
};