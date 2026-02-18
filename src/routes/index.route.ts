import { Router } from "express";
import CompanyRoute from "./Company.route";
import authRoute from "./auth.route";
import homeRoute from "./home.route";
import WhyUsData from "../model/whyus.model";
import whyusRoute from "./whyus.route";
import careerRoute from "./career.route";

export default () => {
  const app = Router();
  CompanyRoute(app);
  authRoute(app);
  homeRoute(app);
  whyusRoute(app);
  careerRoute(app);
  return app;
};  
