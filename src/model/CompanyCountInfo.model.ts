import { BOOLEAN, DATE, INTEGER, STRING } from "sequelize";
import dbContext from "../config/db-context";

const CompanyCountInfoModel = dbContext.define("company_info_counts",{
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: INTEGER
    },
    count:{
        type:INTEGER
    },
    description: {
        type: STRING
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
export default CompanyCountInfoModel;