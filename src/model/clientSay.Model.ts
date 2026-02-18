import { DATE, INTEGER, STRING } from "sequelize";
import dbContext from "../config/db-context";

const ClintSayData = dbContext.define("client_says", {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: STRING,
  },
  description: {
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
});

export default ClintSayData;
