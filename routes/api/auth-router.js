import express from "express";
import authController from "../../controllers/auth-controller.js";
import isEmptyBody from "../../middlewares/isEmptyBody.js";
import validateBody from "../../decorators/validateBody.js";
import authenticate from "../../middlewares/authenticate.js";
import {
  userSignUpSchema,
  userSignInSchema,
  userEmailSchema,
} from "../../models/User.js";
import upload from "../../middlewares/upload.js";

const userSignupValidate = validateBody(userSignUpSchema);
const userSignInvalidate = validateBody(userSignInSchema);
const userEmailValidate = validateBody(userEmailSchema);

const authRouter = express.Router();

authRouter.post(
  "/register",
  upload.single("avatar"),
  isEmptyBody,
  userSignupValidate,
  authController.signup
);

authRouter.get("/verify/:verificationToken", authController.verify);
authRouter.post(
  "/verify",
  isEmptyBody,
  userEmailValidate,
  authController.resendVerifyEmail
);

authRouter.post(
  "/login",
  isEmptyBody,
  userSignInvalidate,
  authController.signin
);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/logout", authenticate, authController.logout);

authRouter.patch(
  "/avatars",
  upload.single("avatar"),
  authenticate,
  authController.changeAvatar
);

export default authRouter;
