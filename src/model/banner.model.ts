import { INTEGER, STRING, DATE, BOOLEAN } from "sequelize"
import dbContext from "../config/db-context"
import Image from "./image.model";

const BannersData = dbContext.define("banners", {
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: STRING
    },
    paragraph: {
        type: STRING
    },
    button:{
    type:BOOLEAN
    },
    button_link: {
        type: STRING
    },
    button_text: {
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
    is_video: {
        type:INTEGER
    },
    id_image: {
        type:INTEGER
    },
    // id_video: {
    //     type:INTEGER
    // },
    status: {
        type: INTEGER
    },
    is_deleted: {
        type: INTEGER
    },
    
});
BannersData.belongsTo(Image, { foreignKey: "id_image", as: "image" });
// BannersData.belongsTo(Image, { foreignKey: "id_video", as: "video" });
export default BannersData;
