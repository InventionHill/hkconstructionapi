
import { RequestHandler } from "express";
import { callServiceMethod } from "./base.controller";
import { addBanner, addCotactUs, addFeedback, addGroupOfCompany, addProject, addSolarPlan, dashboard, deleteBanner, deleteFeedback, deleteGroupOfCompany, deleteProject, deleteProjectImage, deleteSolarPlan, getAllBanner, getAllCotactUs, getAllFeedback, getAllGroupOfCompany, getAllProject, getAllSolarPlan, getBanner, getByIdBanner, getByIdFeedback, getByIdGroupOfCompany, getByIdProject, getByIdSolarPlan, getFeedback, getGroupOfCompany, getLatestProject, getProject, getSolarPlan, getWhatClientSay, statusUpdateBanner, statusUpdateFeedback, statusUpdateGroupOfCompany, statusUpdateProject, statusUpdateSolarPlan, updateBanner, updateFeedback, updateGroupOfCompany, updateProject, updateSolarPlan, updateWhatClientSay } from "../services/home.service";

//////////////////// Dashboard ////////////////////
export const  dashboardFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, dashboard(req),"dashboardFn");
}

//////////////////// Banner ////////////////////

export const  getAllBannerFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, getAllBanner(req),"getAllBannerFn");
}

export const  getBannerFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, getBanner(req),"getBannerFn");
}
export const  addBannerFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, addBanner(req),"addBannerFn");
}

export const  getByIdBannerFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, getByIdBanner(req),"getByIdBannerFn");
}

export const updateBannerFn : RequestHandler =(req,res) => {
    callServiceMethod(req,res,updateBanner(req),"updateBannerFn");
}

export const deleteBannerFn : RequestHandler =(req,res) => {
    callServiceMethod(req,res,deleteBanner(req),"deleteBannerFn")
}

export const statusUpdateBannerFn : RequestHandler =(req,res) => {
    callServiceMethod(req,res,statusUpdateBanner(req),"statusUpdateBannerFn")
}

/////////////////////// Projects //////////////////////////

export const  getAllProjectFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, getAllProject(req),"getAllProjectFn");
}

export const  getProjectFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, getProject(req),"getProjectFn");
}
export const  getLatestProjectFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, getLatestProject(req),"getLatestProjectFn");
}
export const  addProjectFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, addProject(req),"addProjectFn");
}

export const  getByIdProjectFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, getByIdProject(req),"getByIdProjectFn");
}

export const updateProjectFn : RequestHandler =(req,res) => {
    callServiceMethod(req,res,updateProject(req),"updateProjectFn");
}

export const deleteProjectFn : RequestHandler =(req,res) => {
    callServiceMethod(req,res,deleteProject(req),"deleteProjectFn")
}

export const deleteProjectImageFn : RequestHandler =(req,res) => {
    callServiceMethod(req,res,deleteProjectImage(req),"deleteProjectImageFn")
}

export const statusUpdateProjectFn : RequestHandler =(req,res) => {
    callServiceMethod(req,res,statusUpdateProject(req),"statusUpdateProjectFn")
}

//////////////////// Contact Us ////////////////////

export const  addCotactUsFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, addCotactUs(req),"addCotactUsFn");
}
export const  getAllCotactUsFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, getAllCotactUs(req),"getAllCotactUsFn");
}
//////////////////// Feedback ////////////////////

export const  getAllFeedbackFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, getAllFeedback(req),"getAllFeedbackFn");
}
export const  getFeedbackFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, getFeedback(req),"getFeedbackFn");
}
export const  addFeedbackFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, addFeedback(req),"addFeedbackFn");
}

export const  getByIdFeedbackFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, getByIdFeedback(req),"getByIdFeedbackFn");
}

export const updateFeedbackFn : RequestHandler =(req,res) => {
    callServiceMethod(req,res,updateFeedback(req),"updateFeedbackFn");
}

export const deleteFeedbackFn : RequestHandler =(req,res) => {
    callServiceMethod(req,res,deleteFeedback(req),"deleteFeedbackFn")
}

export const statusUpdateFeedbackFn : RequestHandler =(req,res) => {
    callServiceMethod(req,res,statusUpdateFeedback(req),"statusUpdateFeedbackFn")
}

//////////////////// What client say ////////////////////

export const  getWhatClientSayFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, getWhatClientSay(req),"getWhatClientSayFn");
}

export const updateWhatClientSayFn : RequestHandler =(req,res) => {
    callServiceMethod(req,res,updateWhatClientSay(req),"updateWhatClientSayFn");
}

//////////////////// Group of Companies ////////////////////

export const  getAllGroupOfCompanyFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, getAllGroupOfCompany(req),"getAllGroupOfCompanyFn");
}
export const  getGroupOfCompanyFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, getGroupOfCompany(req),"getGroupOfCompanyFn");
}
export const  addGroupOfCompanyFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, addGroupOfCompany(req),"addGroupOfCompanyFn");
}

export const  getByIdGroupOfCompanyFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, getByIdGroupOfCompany(req),"getByIdGroupOfCompanyFn");
}

export const updateGroupOfCompanyFn : RequestHandler =(req,res) => {
    callServiceMethod(req,res,updateGroupOfCompany(req),"updateGroupOfCompanyFn");
}

export const deleteGroupOfCompanyFn : RequestHandler =(req,res) => {
    callServiceMethod(req,res,deleteGroupOfCompany(req),"deleteGroupOfCompanyFn")
}

export const statusUpdateGroupOfCompanyFn : RequestHandler =(req,res) => {
    callServiceMethod(req,res,statusUpdateGroupOfCompany(req),"statusUpdateGroupOfCompanyFn")
}

//////////////////// Solar plan details ////////////////////

export const  getAllSolarPlanFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, getAllSolarPlan(req),"getAllSolarPlanFn");
}
export const  getSolarPlanFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, getSolarPlan(req),"getSolarPlanFn");
}
export const  addSolarPlanFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, addSolarPlan(req),"addSolarPlanFn");
}

export const  getByIdSolarPlanFn: RequestHandler =(req,res) => {
    callServiceMethod(req,res, getByIdSolarPlan(req),"getByIdSolarPlanFn");
}

export const updateSolarPlanFn : RequestHandler =(req,res) => {
    callServiceMethod(req,res,updateSolarPlan(req),"updateSolarPlanFn");
}

export const deleteSolarPlanFn : RequestHandler =(req,res) => {
    callServiceMethod(req,res,deleteSolarPlan(req),"deleteSolarPlanFn")
}

export const statusUpdateSolarPlanFn : RequestHandler =(req,res) => {
    callServiceMethod(req,res,statusUpdateSolarPlan(req),"statusUpdateSolarPlanFn")
}