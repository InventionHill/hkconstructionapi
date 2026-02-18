import { DATE, INTEGER, SMALLINT, STRING } from "sequelize";
import dbContext from "../config/db-context";
import Role from "./role.model";

const ContactUs = dbContext.define("contactus", {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fullname: {
    type: STRING,
  },
  email:{
    type: STRING,
  },
  phonecode:{
    type: STRING,
  },
  phone:{
    type: STRING,
  },
  subject:{
    type: STRING,
  },
  message:{
    type: STRING,
  },
  status: {
    type: INTEGER,
  },
  is_deleted: {
    type: INTEGER,
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
});

export default ContactUs;
