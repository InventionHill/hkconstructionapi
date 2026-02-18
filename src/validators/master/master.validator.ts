import { RequestHandler } from "express";
import modelValidator from "../model.validator";
import {addMasterNameSlugValidationRule, addMasterCurrencyValidationRule, addMasterValidationRule, statusUpdateMasterValidationRule,
   updateMasterNameSlugValidationRule, updateMasterCurrencyValidationRule, updateMasterValidationRule,statusProductUpdateMasterValidationRule,
   addMasterValueValidationRule, updateMasterValueValidationRule, addTagRule, updateTagRule, deleteMasterIdRule,
    statusTagRule, addMasterValueSortCodeRule, updateMasterValueSortCodeRule, deletedMasterValidationRule,statusProductTagRule,
    addConnectsValueValidationRule,statusRequestUpdateMasterValidationRule, removeMasterValidationRule, wishlistUpdateMasterValidationRule
  } from "./master.rules";

export const addMasterValidator: RequestHandler = async (req, res, next) => {
    return await modelValidator(req, res, next, addMasterValidationRule);
};

export const updateMasterValidator: RequestHandler = async (req, res, next) => {
    return await modelValidator(req, res, next, updateMasterValidationRule);
}

export const deletedMasterValidator: RequestHandler = async (req, res, next) => {
  return await modelValidator(req, res, next, deletedMasterValidationRule);
}

export const removeMasterValidation: RequestHandler = async (req, res, next) => {
  return await modelValidator(req, res, next, removeMasterValidationRule);
}

export const statusUpdateMasterValidator: RequestHandler = async (req, res, next) => {
    return await modelValidator(req, res, next, statusUpdateMasterValidationRule);
}

export const wishlistUpdateMasterValidation: RequestHandler = async (req, res, next) => {
  return await modelValidator(req, res, next, wishlistUpdateMasterValidationRule);
}

export const statusRequestUpdateMasterValidation: RequestHandler = async (req, res, next) => {
  return await modelValidator(req, res, next, statusRequestUpdateMasterValidationRule);
}

export const statusProductUpdateMasterValidator: RequestHandler = async (req, res, next) => {
  return await modelValidator(req, res, next, statusProductUpdateMasterValidationRule);
}

export const addConnectsValueValidation: RequestHandler = async (req, res, next) => {
  return await modelValidator(req, res, next, addConnectsValueValidationRule);
}


export const addMasterCurrencyValidator: RequestHandler = async (req, res, next) => {
    return await modelValidator(req, res, next, addMasterCurrencyValidationRule);
  };

export const updateMasterCurrencyValidator: RequestHandler = async (req, res, next) => {
    return await modelValidator(req, res, next, updateMasterCurrencyValidationRule);
}

export const addMasterNameSlugValidator: RequestHandler = async (req, res, next) => {
  return await modelValidator(req, res, next, addMasterNameSlugValidationRule);
};

export const updateMasterNameSlugValidator: RequestHandler = async (req, res, next) => {
  return await modelValidator(req, res, next, updateMasterNameSlugValidationRule);
}

export const addMasterValueSlugValidator: RequestHandler = async (req, res, next) => {
  return await modelValidator(req, res, next, addMasterValueValidationRule);
};

export const updateMasterValueSlugValidator: RequestHandler = async (req, res, next) => {
  return await modelValidator(req, res, next, updateMasterValueValidationRule);
}

export const addTagValidator: RequestHandler = async (req, res, next) => {
  return await modelValidator(req, res, next, addTagRule);
}

export const updateTagValidator: RequestHandler = async (req, res, next) => {
  return await modelValidator(req, res, next, updateTagRule);
}

export const deleteMasterIdValidator: RequestHandler = async (req, res, next) => {
  return await modelValidator(req, res, next, deleteMasterIdRule);
}

export const statusTagValidator: RequestHandler = async (req, res, next) => {
  return await modelValidator(req, res, next, statusTagRule);
}

export const statusProductTagValidator: RequestHandler = async (req, res, next) => {
  return await modelValidator(req, res, next, statusProductTagRule);
}

export const addMasterValueSortCodeRuleValidator: RequestHandler = async (req, res, next) => {
  return await modelValidator(req, res, next, addMasterValueSortCodeRule);
}

export const updateMasterValueSortCodeRuleValidator: RequestHandler = async (req, res, next) => {
  return await modelValidator(req, res, next, updateMasterValueSortCodeRule);
}
