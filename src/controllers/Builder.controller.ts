import { RequestHandler } from "express";
import { callServiceMethod } from "./base.controller";
import { BuilderDataApi, addBuilder, deleteBuilder, getAllBuilder, getByIdBuilder, statusUpdateBuilder, updateBuilder } from "../services/builder.service";

export const  addBuilderFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, addBuilder(req),"addBuilderFn");
}

export const  getAllBuilderFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, getAllBuilder(req),"getAllBuilderFn");
}

export const  getByIdBuilderFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, getByIdBuilder(req),"getByIdBuilderFn");
}

export const updateBuilderFn : RequestHandler =(req,res) => {
    callServiceMethod(req,res,updateBuilder(req),"updateBuilderFn");
}

export const deleteBuilderFn : RequestHandler =(req,res) => {
    callServiceMethod(req,res,deleteBuilder(req),"deleteBuilderFn")
}

export const statusUpdateBuilderFn : RequestHandler =(req,res) => {
    callServiceMethod(req,res,statusUpdateBuilder(req),"statusUpdateBuilderFn")
}

export const BuilderDataApiFn: RequestHandler = (req, res) => {
    callServiceMethod(req, res, BuilderDataApi(req), "BuilderDataApiFn")
}
