import { Router } from "express";
import { authorization } from "../middlewares/authenticate";
import { reqArrayImageParser, reqMultiImageParser, reqSingleImageParser } from "../middlewares/multipart-file-parser";
import { addBannerFn, addCotactUsFn, addFeedbackFn, addGroupOfCompanyFn, addProjectFn, addSolarPlanFn, dashboardFn, deleteBannerFn, deleteFeedbackFn, deleteGroupOfCompanyFn, deleteProjectFn, deleteProjectImageFn, deleteSolarPlanFn, getAllBannerFn, getAllCotactUsFn, getAllFeedbackFn, getAllGroupOfCompanyFn, getAllProjectFn, getAllSolarPlanFn, getBannerFn, getByIdBannerFn, getByIdFeedbackFn, getByIdGroupOfCompanyFn, getByIdProjectFn, getByIdSolarPlanFn, getFeedbackFn, getGroupOfCompanyFn, getLatestProjectFn, getProjectFn, getSolarPlanFn, getWhatClientSayFn, statusUpdateBannerFn, statusUpdateFeedbackFn, statusUpdateGroupOfCompanyFn, statusUpdateProjectFn, statusUpdateSolarPlanFn, updateBannerFn, updateFeedbackFn, updateGroupOfCompanyFn, updateProjectFn, updateSolarPlanFn, updateWhatClientSayFn } from "../controllers/home.controller";
import authRoute from "./auth.route";

export default (app: Router) => {
//////////////// Dashboard ////////////////
app.get("/Dashboard",dashboardFn);


//////////////// Banner ////////////////
app.post("/Banner/add",[reqSingleImageParser("image")],addBannerFn);
app.get("/Banner",getAllBannerFn);
app.get("/getBanner",getBannerFn);
app.get("/Banner/:id",[authorization],getByIdBannerFn);
app.put("/Banner/edit",[authorization,reqSingleImageParser("image")],updateBannerFn);
app.post("/Banner/delete",[authorization],deleteBannerFn);
app.put("/Banner/status",[authorization],statusUpdateBannerFn);

//////////////// Project ////////////////
app.post("/Project/add",[authorization,reqArrayImageParser(["thumbnail","images"])],addProjectFn);
app.get("/Project",getAllProjectFn);
app.get("/getProject",getProjectFn);
app.get("/getLatestProject",getLatestProjectFn);
app.get("/Project/:id",[authorization],getByIdProjectFn);
app.put("/Project/edit",[authorization,reqArrayImageParser(["thumbnail","images"])],updateProjectFn);
app.post("/Project/delete",[authorization],deleteProjectFn);
app.post("/ProjectImage/delete",[authorization],deleteProjectImageFn);
app.put("/Project/status",[authorization],statusUpdateProjectFn);

//////////////// Project Image ////////////////


//////////////// Contact Us ////////////////
app.post("/ContactUs",addCotactUsFn);
app.get("/getContactUs",[authorization],getAllCotactUsFn);

//////////////// Feedback ////////////////
app.post("/Feedback/add",[authorization  ,reqSingleImageParser("image")],addFeedbackFn);
app.get("/Feedback",getAllFeedbackFn);
app.get("/getFeedback",getFeedbackFn);
app.get("/Feedback/:id",authorization,getByIdFeedbackFn);
app.put("/Feedback/edit",[authorization,reqSingleImageParser("image")],updateFeedbackFn);
app.post("/Feedback/delete",[authorization],deleteFeedbackFn);
app.put("/Feedback/status",[authorization],statusUpdateFeedbackFn);

app.get("/whatClientSay",getWhatClientSayFn);
app.put("/whatClientSay/edit",authorization,updateWhatClientSayFn);

//////////////// Group of Companies ////////////////
app.post("/GroupOfCompany/add",[authorization  ,reqSingleImageParser("image")],addGroupOfCompanyFn);
app.get("/GroupOfCompany",getAllGroupOfCompanyFn);
app.get("/getGroupOfCompany",getGroupOfCompanyFn);
app.get("/GroupOfCompany/:id",authorization,getByIdGroupOfCompanyFn);
app.put("/GroupOfCompany/edit",[authorization,reqSingleImageParser("image")],updateGroupOfCompanyFn);
app.post("/GroupOfCompany/delete",[authorization],deleteGroupOfCompanyFn);
app.put("/GroupOfCompany/status",[authorization],statusUpdateGroupOfCompanyFn);

//////////////// Solar plan details ////////////////
app.post("/SolarPlan/add",[authorization  ,reqSingleImageParser("image")],addSolarPlanFn);
app.get("/SolarPlan",getAllSolarPlanFn);
app.get("/getSolarPlan",getSolarPlanFn);
app.get("/SolarPlan/:id",authorization,getByIdSolarPlanFn);
app.put("/SolarPlan/edit",[authorization,reqSingleImageParser("image")],updateSolarPlanFn);
app.post("/SolarPlan/delete",[authorization],deleteSolarPlanFn);
app.put("/SolarPlan/status",[authorization],statusUpdateSolarPlanFn);
}