import { RequestHandler } from "express";
import { callServiceMethod } from "./base.controller";
import { CountCompanyInfo, addCompanyCountInfo, addCompanyInfo, addFeatures, deleteCompanyCountInfo, deleteCompanyInfo, deleteFeatures, getAllCompanyCountInfo, getAllCompanyInfo, getAllFeatures, getByIdCompanyCountInfo, getByIdCompanyInfo, getByIdFeatures, getCompanyInfo, getFeatures, statusUpdateCompanyCountInfo, statusUpdateCompanyInfo, statusUpdateFeatures, updateCompanyCountInfo, updateCompanyInfo, updateFeatures } from "../services/company.service";

////////////////// Company Count info //////////////////

export const  addCompanyCountInfoFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, addCompanyCountInfo(req),"addCompanyCountInfoFn");
}

export const  getAllCompanyCountInfoFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, getAllCompanyCountInfo(req),"getAllCompanyCountInfoFn");
}

export const  CountCompanyInfoFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, CountCompanyInfo(req),"CountCompanyInfoFn");
}
export const  getByIdCompanyCountInfoFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, getByIdCompanyCountInfo(req),"getByIdCompanyCountInfoFn");
}

export const updateCompanyCountInfoFn : RequestHandler =(req,res) => {
    callServiceMethod(req,res,updateCompanyCountInfo(req),"updateCompanyCountInfoFn");
}

export const deleteCompanyCountInfoFn : RequestHandler =(req,res) => {
    callServiceMethod(req,res,deleteCompanyCountInfo(req),"deleteCompanyCountInfoFn")
}

export const statusUpdateCompanyCountInfoFn : RequestHandler =(req,res) => {
    callServiceMethod(req,res,statusUpdateCompanyCountInfo(req),"statusUpdateCompanyCountInfoFn")
}

///////////////////////// Company Info //////////////////////////////////


export const  getAllCompanyInfoFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, getAllCompanyInfo(req),"getAllCompanyInfoFn");
}

export const  getCompanyInfoFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, getCompanyInfo(req),"getCompanyInfoFn");
}
export const  addCompanyInfoFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, addCompanyInfo(req),"addCompanyInfoFn");
}

export const  getByIdCompanyInfoFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, getByIdCompanyInfo(req),"getByIdCompanyInfoFn");
}

export const updateCompanyInfoFn : RequestHandler =(req,res) => {
    callServiceMethod(req,res,updateCompanyInfo(req),"updateCompanyInfoFn");
}

export const deleteCompanyInfoFn : RequestHandler =(req,res) => {
    callServiceMethod(req,res,deleteCompanyInfo(req),"deleteCompanyInfoFn")
}

export const statusUpdategetCompanyInfoFn : RequestHandler =(req,res) => {
    callServiceMethod(req,res,statusUpdateCompanyInfo(req),"statusUpdategetCompanyInfoFn")
}

///////////////////////// features branchs //////////////////////////////////


export const  getAllFeaturesFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, getAllFeatures(req),"getAllFeaturesFn");
}

export const  getFeaturesFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, getFeatures(req),"getFeaturesFn");
}
export const  addFeaturesFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, addFeatures(req),"addFeaturesFn");
}

export const  getByIdFeaturesFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, getByIdFeatures(req),"getByIdFeaturesFn");
}

export const updateFeaturesFn : RequestHandler =(req,res) => {
    callServiceMethod(req,res,updateFeatures(req),"updateFeaturesFn");
}

export const deleteFeaturesFn : RequestHandler =(req,res) => {
    callServiceMethod(req,res,deleteFeatures(req),"deleteFeaturesFn")
}

export const statusUpdategetFeaturesFn : RequestHandler =(req,res) => {
    callServiceMethod(req,res,statusUpdateFeatures(req),"statusUpdategetFeaturesFn")
}