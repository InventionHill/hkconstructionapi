import { Dialect, Sequelize } from "sequelize";
import {
  DB_NAME,
  DB_USER_NAME,
  DB_PASSWORD,
  DB_HOST,
  SEQUELIZE_DIALECT,
  DB_PORT,
} from "./env.var";

const dbContext = new Sequelize(DB_NAME, DB_USER_NAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: SEQUELIZE_DIALECT as Dialect,
  port: Number(DB_PORT),
  define: {
    timestamps: false, // I do not want timestamp fields by default (createdAt, updatedAt)
  },
  dialectOptions: {
    dateStrings: true,
    typeCast: true,
    // ssl: {
    //   require: true, // This will help you. But you will see nwe error
    //   rejectUnauthorized: false // This line will fix new error
    // }
    // useUTC: false, //for reading from database
  },
});

export default dbContext;
