import { RequestHandler } from "express";
import { callServiceMethod } from "./base.controller";
import { addAward, addWhyUs, addWhyUsFeatures, deleteAward, deleteWhyUsFeatures, getAllAward, getAllWhyUsFeatures, getAward, getByIdAward, getByIdWhyUsFeatures, getWhyUs, getWhyUsData, getWhyUsFeatures, statusUpdateAward, statusUpdateWhyUsFeatures, updateAward, updateWhyUs, updateWhyUsFeatures } from "../services/whyUs.service";

//////////////////// Why Us Page ////////////////////

export const  getWhyUsFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, getWhyUs(req),"getWhyUsFn");
}

export const  getWhyUsDataFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, getWhyUsData(req),"getWhyUsDataFn");
}
export const  addWhyUsFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, addWhyUs(req),"addWhyUsFn");
}

export const updateWhyUsFn : RequestHandler =(req,res) => {
    callServiceMethod(req,res,updateWhyUs(req),"updateWhyUsFn");
}

//////////////////// Awards ////////////////////

export const  getAllAwardFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, getAllAward(req),"getAllAwardFn");
}

export const  getAwardFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, getAward(req),"getAwardFn");
}
export const  addAwardFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, addAward(req),"addAwardFn");
}

export const  getByIdAwardFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, getByIdAward(req),"getByIdAwardFn");
}

export const updateAwardFn : RequestHandler =(req,res) => {
    callServiceMethod(req,res,updateAward(req),"updateAwardFn");
}

export const deleteAwardFn : RequestHandler =(req,res) => {
    callServiceMethod(req,res,deleteAward(req),"deleteAwardFn")
}

export const statusUpdateAwardFn : RequestHandler =(req,res) => {
    callServiceMethod(req,res,statusUpdateAward(req),"statusUpdateAwardFn")
}

//////////////////// WhyUs Features ////////////////////

export const  getAllWhyUsFeaturesFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, getAllWhyUsFeatures(req),"getAllWhyUsFeaturesFn");
}

export const  getWhyUsFeaturesFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, getWhyUsFeatures(req),"getWhyUsFeaturesFn");
}
export const  addWhyUsFeaturesFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, addWhyUsFeatures(req),"addWhyUsFeaturesFn");
}

export const  getByIdWhyUsFeaturesFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, getByIdWhyUsFeatures(req),"getByIdWhyUsFeaturesFn");
}

export const updateWhyUsFeaturesFn : RequestHandler =(req,res) => {
    callServiceMethod(req,res,updateWhyUsFeatures(req),"updateWhyUsFeaturesFn");
}

export const deleteWhyUsFeaturesFn : RequestHandler =(req,res) => {
    callServiceMethod(req,res,deleteWhyUsFeatures(req),"deleteWhyUsFeaturesFn")
}

export const statusUpdateWhyUsFeaturesFn : RequestHandler =(req,res) => {
    callServiceMethod(req,res,statusUpdateWhyUsFeatures(req),"statusUpdateWhyUsFeaturesFn")
}
