import { Router } from "express";
import { authorization } from "../middlewares/authenticate";
import { reqSingleImageParser } from "../middlewares/multipart-file-parser";
import { BuilderDataApiFn, addBuilderFn, deleteBuilderFn, getAllBuilderFn, getByIdBuilderFn, statusUpdateBuilderFn, updateBuilderFn } from "../controllers/Builder.controller";

export default (app: Router) => {
app.post("/Builder/add",[authorization],addBuilderFn);
app.get("/Builder",getAllBuilderFn);
app.get("/BuilderDataApi",BuilderDataApiFn);
app.get("/Builder/:id",authorization,getByIdBuilderFn);
app.put("/Builder/edit",[authorization],updateBuilderFn);
app.post("/Builder/delete",[authorization],deleteBuilderFn);
app.put("/Builder/status",[authorization],statusUpdateBuilderFn);

}