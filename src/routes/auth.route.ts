import { Router } from "express";
import {
  authenticateSystemUserFn,
  changeAnyUserPasswordFn,
  changePasswordFn,
  forgotPasswordFn,
  refreshAuthorizationTokenFn,
  registerSystemUserFn,
  resetPasswordFn,
} from "../controllers/auth.controller";
import { authorization, customerAuthorization } from "../middlewares/authenticate";
import {
  changeAnyUserPasswordValidator,
  changePasswordnValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerUserValidator,  
  resetPasswordValidator,
} from "../validators/auth/auth.validator";

export default (app: Router) => {
  app.post("/register-user", [registerUserValidator], registerSystemUserFn);

  app.post("/login", [loginValidator], authenticateSystemUserFn);
  app.post(
    "/refresh-authorization-token",
    [refreshTokenValidator],
    refreshAuthorizationTokenFn
  );
  app.post("/change-password", [customerAuthorization, changePasswordnValidator], changePasswordFn);
  app.post("/forgot-password", [forgotPasswordValidator], forgotPasswordFn);
  app.post("/reset-password", [resetPasswordValidator], resetPasswordFn);
  app.post(
    "/change-any-user-password",
    [authorization, changeAnyUserPasswordValidator],
    changeAnyUserPasswordFn
  );
};
