import { INTEGER, STRING, DATE, BOOLEAN } from "sequelize"
import dbContext from "../config/db-context"
import Image from "./image.model";

const CareerData = dbContext.define("careers", {
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    designation: {
        type: STRING
    },
    description:{
    type:STRING
    },
    requirement:{
    type:STRING
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
    
});
export default CareerData;
