import { userService } from "../../services/userService.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import passport from "passport";
import path from "path";
import fs from "fs";
import UserDto from "../../Dto/userDto.js";
dotenv.config();
import { generateUserError } from "../../services/errors/info.js";
import CustomError from "../../services/errors/CustomError.js";
import EErrors from "../../services/errors/enums.js";
import { getLogger } from "../../utils.js";
import { sendPasswordResetEmail } from "../../config/nodemailer.config.js";
const logger = getLogger();
const jwtSecret = process.env.JWT_SECRET;

const showRegisterForm = (req, res) => {
  res.render("register");
};
const processRegisterForm = async (req, res, next) => {
  try {
    const { first_name, last_name, age, email, password } = req.body;
    const requiredFields = [
      "first_name",
      "last_name",
      "age",
      "email",
      "password",
    ];

    const isValidUser = requiredFields.every((field) =>
      req.body.hasOwnProperty(field)
    );

    if (!isValidUser) {
      const errorMessage = generateUserError(req.body);
      return next(
        new CustomError({
          name: "User creation error",
          cause: errorMessage,
          message: "Error trying to create User",
          code: EErrors.INVALID_TYPES_ERROR,
        })
      );
    }

    const existingUser = await userService.getUserByEmail(email);

    if (existingUser) {
      logger.info("El usuario ya está registrado");
      return res.render("register", { error: "El usuario ya está registrado" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await userService.createUser(
      first_name,
      last_name,
      age,
      email,
      hashedPassword,
      "usuario"
    );

    const userDto = new UserDto(
      user.first_name,
      user.last_name,
      user.email,
      user.age,
      user.role
    );
    logger.info(userDto);

    req.login(user, (err) => {
      if (err) return next(err);

      const tokenPayload = {
        Id: user._id,
        first_name: user.first_name,
        role: user.role,
        email: user.email,
      };

      const token = jwt.sign(tokenPayload, jwtSecret);
      res.cookie("token", token, { httpOnly: true, sameSite: true });

      //actualizamos last_connection al inicio de sesion
      user.last_connection = new Date();
      user.save();

      res.redirect("/api/products");
    });
  } catch (error) {
    if (error instanceof CustomError) {
      next(error);
    } else {
      next(
        new CustomError({
          name: "Database Error",
          message: "An error occurred while communicating with the database.",
          cause: error,
          code: EErrors.DATABASE_ERROR,
        })
      );
    }
  }
};

const showLoginForm = (req, res) => {
  res.render("login");
};
const processLoginForm = async (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    async (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.render("login", { error: info.message });
      }
      try {
        const token = jwt.sign(
          {
            Id: user._id,
            first_name: user.first_name,
            role: user.role,
            email: user.email,
          },
          jwtSecret
        );
        res.cookie("token", token, { httpOnly: true });
        //actualizamos last_connection al inicio de sesion
        user.last_connection = new Date();
        user.save();

        res.redirect("/api/products");
      } catch (error) {
        logger.warn(error);
        res.status(500).send("Error interno del servidor");
      }
    }
  )(req, res, next);
};
const showPasswordResetRequestForm = (req, res) => {
  res.render("password-reset-request");
};
const processPasswordResetRequest = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.render("login", { error: "El usuario no existe" });
    }

    const resetToken = jwt.sign({ userId: user._id }, jwtSecret, {
      expiresIn: "1h",
    });
    // Guardar el token en la base de datos para el usuario
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000; //
    await user.save();

    // Enviar el correo con el enlace de restablecimiento de contraseña
    const resetPasswordLink = `${req.protocol}://${req.get(
      "host"
    )}/auth/password/reset/${resetToken}`;

    await sendPasswordResetEmail(user.email, resetPasswordLink);
    res.render("login", {
      success:
        "Se ha enviado un correo con las instrucciones para restablecer la contraseña",
    });
  } catch (error) {
    logger.error(error);
    res.render("login", { error: "Error en el servidor" });
  }
};

const showPasswordResetExpiredPage = (req, res) => {
  res.render("password-reset-expired");
};

const showPasswordResetForm = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await userService.getUserByResetToken(token);
    if (!user) {
      return res.render("password-reset-expired");
    }
    res.render("password-reset", { token });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const processPasswordReset = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = await userService.getUserByResetToken(token);
    if (!user) {
      return res.render("password-reset-expired");
    }
    if (user.resetTokenExpiration < Date.now()) {
      return res.render("password-reset-expired");
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (isPasswordMatch) {
      return res.render("password-reset", {
        token,
        error: "La nueva contraseña no puede ser igual a la contraseña actual.",
      });
    }
    user.password = await bcrypt.hash(password, 10);
    user.resetToken = null;
    user.resetTokenExpiration = null;
    await user.save();

    res.redirect("/auth/login?resetSuccess=true");
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const closeSession = async (req, res) => {
  res.clearCookie("token");
  res.clearCookie("role");
  req.logout(function (err) {
    if (err) return next(err);
    req.session.destroy(function (err) {
      if (err) return next(err);
      res.redirect("/auth/login");
    });
  });
};
const changeUserRoleController = async (req, res, next) => {
  try {
    const { uid } = req.params;
    const user = await userService.getUserById(uid);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    const requiredDocuments = [
      "identification",
      "addressProof",
      "accountProof",
    ];
    const uploadedDocuments = user.documents.map(
      (document) => document.name.split(" ")[0]
    );
    const missingDocuments = requiredDocuments.filter(
      (document) => !uploadedDocuments.includes(document)
    );

    if (user.role === "usuario" && missingDocuments.length > 0) {
      return res.status(400).render("changeUserRole", {
        error: "El usuario no ha terminado de procesar su documentación. Por favor, cargue los siguientes documentos: " + missingDocuments.join(", "),
        success: false,
        missingDocuments,
        userDto: null
      });
    }

    // Cambiar el rol del usuario
    if (user.role === "usuario") {
      user.role = "premium";
      await user.save();
    }

    const userDto = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
      role: user.role,
    };

    res.render("changeUserRole", {
      error: null,
      success: true,
      missingDocuments,
      userDto
    });
  } catch (error) {
    if (error instanceof CustomError) {
      next(error);
    } else {
      next(
        new CustomError({
          name: "Database Error",
          message: "An error occurred while communicating with the database.",
          cause: error,
          code: EErrors.DATABASE_ERROR,
        })
      );
    }
  }
};

const loadDocuments = async (req, res) => {
  const uid = req.params.uid;
  const { profileImage, identification, addressProof, accountProof } = req.files;
  try {
    const user = await userService.getUserById(uid);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Verificar si los documentos ya han sido cargados
    const uploadedDocuments = user.documents.map(document => document.name);
    const requiredDocuments = ["identification", "addressProof", "accountProof"];
    const missingDocuments = requiredDocuments.filter(document => !uploadedDocuments.includes(document));

    if (missingDocuments.length === 0) {
      return res.status(400).json({ error: "Los documentos ya han sido cargados" });
    }

    // Manejar los archivos de la imagen de perfil
    if (profileImage && profileImage.length > 0) {
      const profileImagePath = `src/uploads/profiles/${profileImage[0].filename}`;
      fs.renameSync(profileImage[0].path, profileImagePath);
      const profileImageDocument = {
        name: "profileImage",
        reference: profileImagePath,
        status: "subido",
      };
      user.documents.push(profileImageDocument);
    }


    // Manejar el archivo de identificación
    if (identification && identification.length > 0 && missingDocuments.includes("identification")) {
      const identificationPath = `src/uploads/documents/${identification[0].filename}`;
      fs.renameSync(identification[0].path, identificationPath);
      const identificationDocument = {
        name: "identification",
        reference: identificationPath,
        status: "subido",
      };
      user.documents.push(identificationDocument);
    }

    // Manejar el archivo de comprobante de domicilio
    if (addressProof && addressProof.length > 0 && missingDocuments.includes("addressProof")) {
      const addressProofPath = `src/uploads/documents/${addressProof[0].filename}`;
      fs.renameSync(addressProof[0].path, addressProofPath);
      const addressProofDocument = {
        name: "addressProof",
        reference: addressProofPath,
        status: "subido",
      };
      user.documents.push(addressProofDocument);
    }

    // Manejar el archivo de comprobante de estado de cuenta
    if (accountProof && accountProof.length > 0 && missingDocuments.includes("accountProof")) {
      const accountProofPath = `src/uploads/documents/${accountProof[0].filename}`;
      fs.renameSync(accountProof[0].path, accountProofPath);
      const accountProofDocument = {
        name: "accountProof",
        reference: accountProofPath,
        status: "subido",
      };
      user.documents.push(accountProofDocument);
    }

    await user.save();
    console.log(user)
    res.json({ message: "Archivos subidos exitosamente", user: user.documents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el usuario" });
  }
};


export {
  processLoginForm,
  showRegisterForm,
  processRegisterForm,
  showLoginForm,
  closeSession,
  processPasswordResetRequest,
  showPasswordResetExpiredPage,
  showPasswordResetForm,
  processPasswordReset,
  showPasswordResetRequestForm,
  changeUserRoleController,
  loadDocuments,
};
