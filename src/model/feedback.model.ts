import { INTEGER, STRING, DATE, BOOLEAN } from "sequelize"
import dbContext from "../config/db-context"
import Image from "./image.model";

const FeedbackData = dbContext.define("feedbacks", {
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    fullname: {
        type: STRING
    },
    designation: {
        type: STRING
    },
    feedback:{
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
    image_id: {
        type:INTEGER
    },
    // id_video: {
    //     type:INTEGER
    // },
    is_video:{
        type:INTEGER
    },
    status: {
        type: INTEGER
    },
    is_deleted: {
        type: INTEGER
    },
    
});
FeedbackData.belongsTo(Image, { foreignKey: "image_id", as: "image" });
// FeedbackData.belongsTo(Image, { foreignKey: "id_video", as: "video" });
export default FeedbackData;
