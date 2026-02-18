import { BOOLEAN, DATE, INTEGER, STRING } from "sequelize";
import dbContext from "../config/db-context";
import Image from "./image.model";

const CompanyInfo = dbContext.define("company_infoes", {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    company_name: {
      type: STRING,
    },
    company_email: {
      type: STRING,
    },
    company_phone: {
      type: STRING,
    },
    brochure_name: {
      type: STRING,
    },
    brochure_file_id: {
      type: INTEGER,
    },
    address: {
      type: STRING,
    },
    sort_description: {
      type: STRING,
    },
    copyright: {
      type: STRING,
    },
    office_time: {
      type: STRING,
    },
    map_link: {
      type: STRING,
    },
    logo_white: {
      type: INTEGER,
    },
    about_company:{
      type:STRING
    },
    vision:{
      type:STRING
    },
    mission:{
      type:STRING
    },
    logo_black: {
      type: INTEGER,
    },
    owner_image_id: {
      type: INTEGER,
    },
    web_link: {
        type: STRING,
    },
    facebook_link: {
        type: STRING,
    },
    insta_link: {
        type: STRING,
    },
    youtube_link: {
        type: STRING,
    },
    linkdln_link: {
        type: STRING,
    },
    twitter_link: {
        type: STRING,
    },
    created_by: {
      type: INTEGER,
    },
    created_date: {
      type: DATE,
    },
    modified_by: {
      type: INTEGER,
    },
    modified_date: {
      type: DATE,
    },
    status:{
      type:INTEGER
    },
    is_deleted:{
      type:INTEGER
    },
    owner_description:{
      type:STRING
    }, 
    welcome_text:{
      type:STRING
    },
    about_image_id:{
      type:INTEGER
    },
    sm_logo:{
      type:INTEGER
    }
  });
  
  CompanyInfo.hasOne(Image, { as: "logo_white_image", foreignKey: "id", sourceKey: "logo_white" });
  CompanyInfo.hasOne(Image, { as: "logo_black_image", foreignKey: "id", sourceKey: "logo_black" });
  CompanyInfo.hasOne(Image, { as: "owner_image", foreignKey: "id", sourceKey: "owner_image_id" });
  CompanyInfo.hasOne(Image, { as: "about_image", foreignKey: "id", sourceKey: "about_image_id" });
  CompanyInfo.hasOne(Image, { as: "sm_logo_image", foreignKey: "id", sourceKey: "sm_logo" });
  CompanyInfo.hasOne(Image, { as: "brochure", foreignKey: "id", sourceKey: "brochure_file_id" });

  export default CompanyInfo;