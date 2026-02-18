import { BOOLEAN, DATE, INTEGER, STRING } from "sequelize";
import dbContext from "../config/db-context";
import Image from "./image.model";

const WhyUsFeaturesData = dbContext.define("whyus_features", {
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
    icon_id:{
        type: INTEGER,
    },
    image_id:{
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
  
  WhyUsFeaturesData.hasOne(Image, { as: "image", foreignKey: "id", sourceKey: "image_id" });
  WhyUsFeaturesData.hasOne(Image, { as: "icon", foreignKey: "id", sourceKey: "icon_id" });
  
  export default WhyUsFeaturesData;