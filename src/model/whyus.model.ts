import { BOOLEAN, DATE, INTEGER, STRING } from "sequelize";
import dbContext from "../config/db-context";
import Image from "./image.model";

const WhyUsData = dbContext.define("whyus", {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title1: {
      type: STRING,
    },
    title2: {
      type: STRING,
    },
    description: {
      type: STRING,
    },
    main_image_id:{
      type:INTEGER
    },
    sml_logo_id:{
        type:INTEGER
    },
    status:{
        type:INTEGER
    },
    is_deleted:{
        type:INTEGER
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
    }
  });
  
  WhyUsData.hasOne(Image, { as: "main_image", foreignKey: "id", sourceKey: "main_image_id" });
  WhyUsData.hasOne(Image, { as: "logo_image", foreignKey: "id", sourceKey: "sml_logo_id" });
  
  export default WhyUsData;