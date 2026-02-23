import { Dialect, Sequelize } from "sequelize";
import {
  DB_NAME,
  DB_USER_NAME,
  DB_PASSWORD,
  DB_HOST,
  SEQUELIZE_DIALECT,
  DB_PORT,
} from "./env.var";

console.log(
  `[DB Context] Initializing Sequelize with HOST: ${DB_HOST}, USER: ${DB_USER_NAME}, DB: ${DB_NAME}`
);

const dbContext = new Sequelize(DB_NAME, DB_USER_NAME, DB_PASSWORD, {
  host: DB_HOST,
  port: Number(DB_PORT),
  dialect: SEQUELIZE_DIALECT as Dialect,

  logging: false, // 🔥 disable query logs in production

  define: {
    timestamps: false,
  },

  pool: {
    max: 20,        // 🔥 increase connections
    min: 2,
    acquire: 60000, // 🔥 wait 60 seconds before timeout
    idle: 10000,
    evict: 15000,
  },

  dialectOptions: {
    dateStrings: true,
    typeCast: true,
  },
});

export default dbContext;