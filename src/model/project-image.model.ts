import { DATE, INET, INTEGER, SMALLINT, STRING } from "sequelize";
import dbContext from "../config/db-context";
import ProjectData from "./projects.model";

const ProjectImages = dbContext.define("project_images", {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  image_path: {
    type: STRING,
  },
  image_type: {
    type: SMALLINT,
  },
  is_deleted: {
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
  project_id:{
    type:INTEGER
  }
});

ProjectImages.hasOne(ProjectData, { as: "projects", foreignKey: "id", sourceKey: "project_id" });

export default ProjectImages;
