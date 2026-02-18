import { Router } from "express";
import { authorization } from "../middlewares/authenticate";
import { reqSingleImageParser } from "../middlewares/multipart-file-parser";
import { addCareerFn, addCareerReqFn, deleteCareerFn, deletedeleteCareerReqFn, getAllCareerFn, getAllCareerReqFn, getByIdCareerFn, getByIdCareerReqFn, getCareerFn, statusUpdateCareerFn, statusUpdateCareerReqFn, updateCareerFn } from "../controllers/Career.controller";

export default (app: Router) => {
app.post("/Career/add",[authorization],addCareerFn);
app.get("/Career",getAllCareerFn);
app.get("/getCareer",getCareerFn);
app.get("/Career/:id",authorization,getByIdCareerFn);
app.put("/Career/edit",[authorization],updateCareerFn);
app.post("/Career/delete",[authorization],deleteCareerFn);
app.post("/Career/status",[authorization],statusUpdateCareerFn);

app.post("/CareerReq/add",[reqSingleImageParser("resume")],addCareerReqFn);
app.get("/CareerReqs",[authorization],getAllCareerReqFn);
app.get("/CareerReqs/:id",[authorization],getByIdCareerReqFn);
app.post("/CareerReqs/delete",[authorization],deletedeleteCareerReqFn);
app.post("/CareerReqs/status",[authorization],statusUpdateCareerReqFn);
}