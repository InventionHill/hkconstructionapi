import { Router } from "express";
import {  } from "../middlewares/authenticate";
import { reqMultiImageParser, reqSingleImageParser } from "../middlewares/multipart-file-parser";
import { CountCompanyInfoFn, addCompanyCountInfoFn, addCompanyInfoFn, addFeaturesFn, deleteCompanyCountInfoFn, deleteCompanyInfoFn, deleteFeaturesFn, getAllCompanyCountInfoFn, getAllCompanyInfoFn, getAllFeaturesFn, getByIdCompanyCountInfoFn, getByIdCompanyInfoFn, getByIdFeaturesFn, getCompanyInfoFn, getFeaturesFn, statusUpdateCompanyCountInfoFn, statusUpdategetFeaturesFn, updateCompanyCountInfoFn, updateCompanyInfoFn, updateFeaturesFn } from "../controllers/Company.controller";

export default (app: Router) => {
app.post("/CompanyCountInfo/add",[],addCompanyCountInfoFn);
app.get("/CompanyCountInfo",getAllCompanyCountInfoFn);
app.get("/CountCompanyInfo",CountCompanyInfoFn);
app.get("/CompanyCountInfo/:id",[],getByIdCompanyCountInfoFn);
app.put("/CompanyCountInfo/edit",[],updateCompanyCountInfoFn);
app.post("/CompanyCountInfo/delete",[],deleteCompanyCountInfoFn);
app.put("/CompanyCountInfo/status",[],statusUpdateCompanyCountInfoFn);

app.post("/CompanyInfo/add",[reqMultiImageParser(["logo_white","logo_black","owner_image","sm_logo","about_image","brochure"])],addCompanyInfoFn);
app.get("/CompanyInfo",getAllCompanyInfoFn);
app.get("/getCompanyInfo",getCompanyInfoFn);
app.get("/CompanyInfo/:id",getByIdCompanyInfoFn);
app.put("/CompanyInfo/edit",[reqMultiImageParser(["logo_white","logo_black","owner_image","sm_logo","about_image","brochure"])],updateCompanyInfoFn);
app.post("/CompanyInfo/delete",[],deleteCompanyInfoFn);
app.put("/CompanyInfo/status",[],statusUpdateCompanyCountInfoFn);

app.post("/partners/add",[reqSingleImageParser("image")],addFeaturesFn);
app.get("/partners",getAllFeaturesFn);
app.get("/getPartners",getFeaturesFn);
app.get("/partners/:id",getByIdFeaturesFn);
app.put("/partners/edit",[reqSingleImageParser("image")],updateFeaturesFn);
app.post("/partners/delete",[],deleteFeaturesFn);
app.put("/partners/status",[],statusUpdategetFeaturesFn);
}