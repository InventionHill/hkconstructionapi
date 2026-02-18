import { RequestHandler } from "express";
import {
  authenticateSystemUser,
  changeAnyUserPassword,
  changePassword,
  forgotPassword,
  refreshAuthorizationToken,
  userActiveStatus,
  registerSystemUser,
  resetPassword,
} from "../services/auth.service";
import { callServiceMethod } from "./base.controller";

export const registerSystemUserFn: RequestHandler = (req, res) => {
  callServiceMethod(req, res, registerSystemUser(req), "registerSystemUserFn");
};

export const authenticateSystemUserFn: RequestHandler = (req, res) => {
  callServiceMethod(
    req,
    res,
    authenticateSystemUser(req),
    "authenticateSystemUserFn"
  );
};

export const refreshAuthorizationTokenFn: RequestHandler = (req, res) => {
  callServiceMethod(
    req,
    res,
    refreshAuthorizationToken(req),
    "refreshAuthorizationTokenFn"
  );
};

export const changePasswordFn: RequestHandler = (req, res) => {
  callServiceMethod(req, res, changePassword(req), "changePasswordFn");
};

export const forgotPasswordFn: RequestHandler = (req, res) => {
  callServiceMethod(req, res, forgotPassword(req), "forgotPasswordFn");
};

export const resetPasswordFn: RequestHandler = (req, res) => {
  callServiceMethod(req, res, resetPassword(req), "resetPasswordFn");
};

export const userActiveStatusFn : RequestHandler =(req,res) => {
  callServiceMethod(req,res,userActiveStatus(req),"userActiveStatusFn")
}
export const changeAnyUserPasswordFn: RequestHandler = (req, res) => {
  callServiceMethod(
    req,
    res,
    changeAnyUserPassword(req),
    "changeAnyUserPasswordFn"
  );
};