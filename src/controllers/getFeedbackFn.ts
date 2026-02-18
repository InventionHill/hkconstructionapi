import { RequestHandler } from "express";
import { callServiceMethod } from "./base.controller";
import { getFeedback } from "../services/home.service";


export const getFeedbackFn: RequestHandler = (req, res) => {
    callServiceMethod(req, res, getFeedback(req), "getFeedbackFn");
};
