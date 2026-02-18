import { Router } from "express";
import { authorization } from "../middlewares/authenticate";
import { reqMultiImageParser, reqSingleImageParser } from "../middlewares/multipart-file-parser";
import { addAwardFn, addWhyUsFeaturesFn, addWhyUsFn, deleteAwardFn, deleteWhyUsFeaturesFn, getAllAwardFn, getAllWhyUsFeaturesFn, getAwardFn, getByIdAwardFn, getByIdWhyUsFeaturesFn, getWhyUsDataFn, getWhyUsFeaturesFn, getWhyUsFn, statusUpdateAwardFn, statusUpdateWhyUsFeaturesFn, updateAwardFn, updateWhyUsFeaturesFn, updateWhyUsFn } from "../controllers/whyus.controller";

export default (app: Router) => {

//////////////// WhyUs ////////////////
app.post("/whyus/add",[authorization,reqMultiImageParser(["image","logo"])],addWhyUsFn);
app.get("/whyUsPage",getWhyUsDataFn);
app.get("/getwhyus",getWhyUsFn);
app.put("/whyus/edit",[authorization,reqMultiImageParser(["image","logo"])],updateWhyUsFn);

//////////////// Awards ////////////////
app.post("/Award/add",[authorization,reqSingleImageParser("image")],addAwardFn);
app.get("/Award",getAllAwardFn);
app.get("/getAward",getAwardFn);
app.get("/Award/:id",authorization,getByIdAwardFn);
app.put("/Award/edit",[authorization,reqSingleImageParser("image")],updateAwardFn);
app.post("/Award/delete",[authorization],deleteAwardFn);
app.put("/Award/status",[authorization],statusUpdateAwardFn);

//////////////////// WhyUs Features ////////////////////
app.post("/WhyUsFeatures/add",[authorization  ,reqMultiImageParser(["image","icon"])],addWhyUsFeaturesFn);
app.get("/WhyUsFeatures",getAllWhyUsFeaturesFn);
app.get("/getWhyUsFeatures",getWhyUsFeaturesFn);
app.get("/WhyUsFeatures/:id",authorization,getByIdWhyUsFeaturesFn);
app.put("/WhyUsFeatures/edit",[authorization,reqMultiImageParser(["image","icon"])],updateWhyUsFeaturesFn);
app.post("/WhyUsFeatures/delete",[authorization],deleteWhyUsFeaturesFn);
app.put("/WhyUsFeatures/status",[authorization],statusUpdateWhyUsFeaturesFn);

}