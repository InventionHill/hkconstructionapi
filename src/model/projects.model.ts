import { BOOLEAN, DATE, INTEGER, STRING } from "sequelize";
import dbContext from "../config/db-context";
import Image from "./image.model";

const ProjectData = dbContext.define("projects",{
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: STRING
    },
    description:{
        type:STRING
    },
    architecture: {
        type: STRING
    },
    project_status: {
        type: STRING
    },
    progress: {
        type: INTEGER
    },
    location:{
        type:STRING
    },
    specification:{
        type:STRING
    },
    is_latest:{
        type:BOOLEAN
    },
    created_date: {
        type: DATE
    },
    modified_date: {
        type: DATE
    },
    created_by: {
        type: INTEGER
    },
    modified_by: {
        type: INTEGER
    },
    status: {
        type: INTEGER
    },
    is_deleted: {
        type: INTEGER
    },
    image_id:{
        type:INTEGER
    },
    thumbnail_image_id:{
        type:INTEGER
    },
    owner:{
        type:STRING
    },
    area_of_construction:{
        type:STRING
    },
    no_of_building:{
        type:STRING
    },
    no_of_stories:{
        type:STRING
    },
    year:{
        type:STRING
    },
    project_description:{
        type:STRING
    }
});

ProjectData.hasOne(Image, { as: "image", foreignKey: "id", sourceKey: "image_id" });
ProjectData.hasOne(Image, { as: "thumbnail_image", foreignKey: "id", sourceKey: "thumbnail_image_id" });

export default ProjectData;