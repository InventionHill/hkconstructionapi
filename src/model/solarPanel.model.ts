import { INTEGER, STRING, DATE, BOOLEAN } from "sequelize"
import dbContext from "../config/db-context"
import Image from "./image.model";

const SolarPanelData = dbContext.define("solar_panels", {
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
    image_id: {
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
    },
    
});
SolarPanelData.belongsTo(Image, { foreignKey: "image_id", as: "image" });
export default SolarPanelData;
