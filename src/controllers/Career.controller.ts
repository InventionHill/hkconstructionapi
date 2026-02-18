import { RequestHandler } from "express";
import { callServiceMethod } from "./base.controller";
import {  addCareer, addCareerReq, deleteCareer, deleteCareerReq, getAllCareer, getAllCareerReq, getByIdCareer, getByIdCareerReq, getCareer, statusUpdateCareer, statusUpdateCareerReq, updateCareer } from "../services/career.service";

////////////////////// Career requirements add //////////////////////

export const  addCareerFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, addCareer(req),"addCareerFn");
}

export const  getAllCareerFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, getAllCareer(req),"getAllCareerFn");
}

export const  getCareerFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, getCareer(req),"getCareerFn");
}

export const  getByIdCareerFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, getByIdCareer(req),"getByIdCareerFn");
}

export const updateCareerFn : RequestHandler =(req,res) => {
    callServiceMethod(req,res,updateCareer(req),"updateCareerFn");
}

export const deleteCareerFn : RequestHandler =(req,res) => {
    callServiceMethod(req,res,deleteCareer(req),"deleteCareerFn")
}

export const statusUpdateCareerFn : RequestHandler =(req,res) => {
    callServiceMethod(req,res,statusUpdateCareer(req),"statusUpdateCareerFn")
}

////////////////////// Career request sent //////////////////////


export const  addCareerReqFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, addCareerReq(req),"addCareerReqFn");
}

export const  getAllCareerReqFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, getAllCareerReq(req),"getAllCareerReqFn");
}
export const  getByIdCareerReqFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, getByIdCareerReq(req),"getByIdCareerReqFn");
}

export const deletedeleteCareerReqFn : RequestHandler =(req,res) => {
    callServiceMethod(req,res,deleteCareerReq(req),"deleteCareerReqFn")
}
export const statusUpdateCareerReqFn : RequestHandler =(req,res) => {
    callServiceMethod(req,res,statusUpdateCareerReq(req),"statusUpdateCareerReqFn")
}