import { RequestHandler } from "express";
import modelValidator from "../model.validator";
import {addBannerValidationRule,updatebannerValidationRule,addBlogValidationRule,updateBlogValidationRule,
    deletedFrontPageValidationRule,statusUpdateFrontValidationRule,addNewsCategoryValidationRule,
    updateNewsCategoryValidationRule,addStatisticInfoValidationRule,updateStatisticInfoValidationRule,
    updateRetailersValidationRule,addFacilityValidationRule,updateFacilityValidationRule} from "./frontpage.rules";



export const deletedFrontPageValidation: RequestHandler = async (req, res, next) => {
  return await modelValidator(req, res, next, deletedFrontPageValidationRule);
}

export const statusUpdateFrontPageValidation: RequestHandler = async (req, res, next) => {
  return await modelValidator(req, res, next, statusUpdateFrontValidationRule);
}
///////////////////// banner //////////////////

export const addBannerValidation: RequestHandler = async (req, res, next) => {
    return await modelValidator(req, res, next, addBannerValidationRule);
  };
  
  export const updateBannerValidator: RequestHandler = async (req, res, next) => {
    return await modelValidator(req, res, next, updatebannerValidationRule);
  }

  //////////////// blog ///////////////////
  
  export const addBlogValidation: RequestHandler = async (req, res, next) => {
    return await modelValidator(req, res, next, addBlogValidationRule);
  };
  
  export const updateBlogValidator: RequestHandler = async (req, res, next) => {
    return await modelValidator(req, res, next, updateBlogValidationRule);
  }
  
  ////////////////// News Category //////////////
    
  export const addNewsCategoryValidation: RequestHandler = async (req, res, next) => {
    return await modelValidator(req, res, next, addNewsCategoryValidationRule);
  };
  
  export const updateNewsCategoryValidation: RequestHandler = async (req, res, next) => {
    return await modelValidator(req, res, next, updateNewsCategoryValidationRule);
  }


  ////////////////// statistic info //////////////
    
  export const addStatisticInfoValidation: RequestHandler = async (req, res, next) => {
    return await modelValidator(req, res, next, addStatisticInfoValidationRule);
  };
  
  export const updateStatisticInfoValidation: RequestHandler = async (req, res, next) => {
    return await modelValidator(req, res, next, updateStatisticInfoValidationRule);
  };

  /////////////// retailers //////////////////

  export const updateRetailersValidation: RequestHandler = async (req, res, next) => {
    return await modelValidator(req, res, next, updateRetailersValidationRule);
  };

//////////////// facility ///////////////////
  
  export const addFacilityValidation: RequestHandler = async (req, res, next) => {
    return await modelValidator(req, res, next, addFacilityValidationRule);
  };
    
  export const updateFacilityValidator: RequestHandler = async (req, res, next) => {
    return await modelValidator(req, res, next, updateFacilityValidationRule);
  };