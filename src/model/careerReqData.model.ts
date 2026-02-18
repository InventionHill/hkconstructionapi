import { INTEGER, STRING, DATE, BOOLEAN, INET } from "sequelize"
import dbContext from "../config/db-context"
import Image from "./image.model";
import CareerData from "./career.model";

const CareerReqData = dbContext.define("career_requests", {
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    first_name: {
        type: STRING
    },
    last_name: {
        type: STRING
    },
    email:{
    type:STRING
    },
    phone:{
    type:STRING
    },
    image_id:{
    type:INTEGER
    },
    experience:{
        type:STRING
    },  
    city:{
        type:STRING
    },
    state:{
        type:STRING
    },
    career_id:{
    type:INTEGER
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
    }
});
CareerReqData.belongsTo(Image, { foreignKey: "image_id", as: "image" });
CareerReqData.belongsTo(CareerData, { foreignKey: "career_id", as: "careers" });
export default CareerReqData;
