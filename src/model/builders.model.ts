import { BOOLEAN, DATE, INTEGER, STRING } from "sequelize";
import dbContext from "../config/db-context";
import Image from "./image.model";

const Builders = dbContext.define("builders", {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    builder_name: {
      type: STRING,
    },
    image: {
      type: STRING,
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
  
  Builders.hasOne(Image, { as: "image", foreignKey: "id", sourceKey: "image" });
  // CompanyInfo.hasOne(Image, { as: "light_image", foreignKey: "id", sourceKey: "light_id_image" });

  export default Builders;