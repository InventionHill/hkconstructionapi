import { RequestHandler } from "express";
import modelValidator from "../model.validator";
import {
  changeAnyUserPasswordValidationRule,
  changePasswordnValidationRule,
  forgotPasswordValidationRule,
  loginValidationRule,
  refreshTokenValidationRule,
  registerCustomerValidationRule,
  registerUserValidationRule,
  resetPasswordValidationRule,
} from "./auth.rules";

export const registerUserValidator: RequestHandler = async (req, res, next) => {
  return await modelValidator(req, res, next, registerUserValidationRule);
};

export const registerCustomerValidator: RequestHandler = async (req, res, next) => {
  return await modelValidator(req, res, next, registerCustomerValidationRule);
}

export const loginValidator: RequestHandler = async (req, res, next) => {
  return await modelValidator(req, res, next, loginValidationRule);
};

export const refreshTokenValidator: RequestHandler = async (req, res, next) => {
  return await modelValidator(req, res, next, refreshTokenValidationRule);
};

export const changePasswordnValidator: RequestHandler = async (
  req,
  res,
  next
) => {
  return await modelValidator(req, res, next, changePasswordnValidationRule);
};

export const forgotPasswordValidator: RequestHandler = async (
  req,
  res,
  next
) => {
  return await modelValidator(req, res, next, forgotPasswordValidationRule);
};

export const resetPasswordValidator: RequestHandler = async (
  req,
  res,
  next
) => {
  return await modelValidator(req, res, next, resetPasswordValidationRule);
};

export const changeAnyUserPasswordValidator: RequestHandler = async (
  req,
  res,
  next
) => {
  return await modelValidator(
    req,
    res,
    next,
    changeAnyUserPasswordValidationRule
  );
};
