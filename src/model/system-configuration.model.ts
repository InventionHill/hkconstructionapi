import { INTEGER, STRING } from "sequelize";
import dbContext from "../config/db-context";

const SystemConfiguration = dbContext.define("system_configurations", {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  config_key: {
    type: STRING,
  },
  config_value: {
    type: STRING,
  },
  user_friendly_name: {
    type: STRING,
  },
  display_sequence: {
    type: INTEGER,
  },
  config_group: {
    type: INTEGER,
  }
});


// MetalMaster.belongsTo(MetalMaster, {
//   foreignKey: "id_metal",
//   as: "Metal_master",
// });
// MetalMaster.hasMany(MetalMaster, {
//   foreignKey: "id_product",
//   as: "system_configurations",
// });

export default SystemConfiguration;
