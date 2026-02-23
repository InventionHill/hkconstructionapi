const path = require('path');
const dotenv = require('dotenv');
console.log('Current working directory:', process.cwd());
console.log('Loading .env from:', path.resolve(process.cwd(), '.env'));
const result = dotenv.config({ path: path.resolve(process.cwd(), '.env'), override: true });
if (result.error) {
  console.error('Error loading .env:', result.error);
} else {
  console.log('.env loaded successfully');
  console.log('Parsed DB_HOST:', result.parsed?.DB_HOST);
}
console.log('Final process.env.DB_HOST:', process.env.DB_HOST);

export const PROCESS_ENVIRONMENT =
  process.env.PROCESS_ENVIRONMENT || "development";
export const PORT = process.env.PORT || 3535;
export const SECURE_COMMUNICATION = process.env.SECURE_COMMUNICATION
  ? process.env.SECURE_COMMUNICATION === "true"
  : false;
export const PUBLIC_AUTHORIZATION_TOKEN =
  process.env.PUBLIC_AUTHORIZATION_TOKEN || "PUBLIC_AUTHORIZATION_TOKEN";

export const DB_NAME = process.env.DB_NAME || "hk_construction";
export const DB_USER_NAME = process.env.DB_USER_NAME || "hk-construction";
export const DB_PASSWORD = process.env.DB_PASSWORD || "";
export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_PORT = process.env.DB_PORT || 5432;
export const SEQUELIZE_DIALECT = process.env.SEQUELIZE_DIALECT || "postgres";
// export const DB_NAME = process.env.DB_NAME || "hkconstruction";
// export const DB_USER_NAME = process.env.DB_USER_NAME || "postgres";
// export const DB_PASSWORD = process.env.DB_PASSWORD || "admin";
// export const DB_HOST =
// process.env.DB_HOST || "localhost";
// export const DB_PORT = process.env.DB_PORT || 5434;
// export const SEQUELIZE_DIALECT = process.env.SEQUELIZE_DIALECT || "postgres";


//FPS 
export const VPS_HOST = process.env.VPS_HOST || "";
export const VPS_PORT = process.env.VPS_PORT || 21;
export const VPS_USER = process.env.VPS_USER || "hk-construction";
export const VPS_PASSWORD = process.env.VPS_PASSWORD || "";

// AWS S3
export const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || "";
export const S3_REGION = process.env.S3_REGION || "";
export const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID || "";
export const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY || "";

// crypto-js
export const CRYPTO_JS_KEY = process.env.CRYPTO_JS_KEY || "";
export const CRYPTO_JS_IV = process.env.CRYPTO_JS_IV || "";

// Mail
// SMTP
export const MAIL_USER_NAME = process.env.MAIL_USER_NAME || "";
export const MAIL_PASSWORD = process.env.MAIL_PASSWORD || "";
export const MAIL_HOST = process.env.MAIL_HOST || "";
export const MAIL_PORT = process.env.MAIL_PORT || 465;
export const MAIL_SECURE = process.env.MAIL_SECURE || false;
export const MAIL_FROM = process.env.MAIL_FROM || "";

// Extra
export const STORE_TEMP_IMAGE_PATH =
  process.env.STORE_TEMP_IMAGE_PATH || "public/temp/files";

export const STORE_TEMP_FILE_PATH =
  process.env.STORE_TEMP_FILE_PATH || "public/temp/files";

export const STORE_TEMP_VIDEO_PATH =
  process.env.STORE_TEMP_VIDEO_PATH || "public/temp/videos";

export const PRODUCT_CSV_FOLDER_PATH = process.env.PRODUCT_CSV_FOLDER_PATH || "public/csv";


export const FRONT_END_BASE_URL =
  process.env.FRONT_END_BASE_URL || "http://localhost:3000";

export const RESET_PASSWORD_PATH =
  process.env.RESET_PASSWORD_PATH || "accounts/recover-password?token=";

export const DEV_DEFAULT_RECIPIENT =
  process.env.DEV_DEFAULT_RECIPIENT || "sinojiyakhushi12@gmail.com";

// OTP

export const OTP_GENERATE_DIGITS = 6;

// Invoice 

export const INVOICE_NUMBER_DIGIT = 6;

// Product Bulk Upload File
export const PRODUCT_BULK_UPLOAD_FILE_MIMETYPE =
  process.env.PRODUCT_BULK_UPLOAD_FILE_MIMETYPE || "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
export const PRODUCT_BULK_UPLOAD_ZIP_MIMETYPE =
  process.env.PRODUCT_BULK_UPLOAD_ZIP_MIMETYPE || "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export const PRODUCT_BULK_UPLOAD_FILE_SIZE = process.env
  .PRODUCT_BULK_UPLOAD_FILE_SIZE
  ? Number(process.env.PRODUCT_BULK_UPLOAD_FILE_SIZE)
  : 10;
export const PRODUCT_BULK_UPLOAD_ZIP_SIZE = process.env
  .PRODUCT_BULK_UPLOAD_ZIP_SIZE
  ? Number(process.env.PRODUCT_BULK_UPLOAD_ZIP_SIZE)
  : 10;
export const PRODUCT_BULK_UPLOAD_BATCH_SIZE =
  process.env.PRODUCT_BULK_UPLOAD_BATCH_SIZE || 500;

// payment secret key

export const PAYMENT_METHOD_SECRET_KEY = process.env.PAYMENT_METHOD_SECRET_KEY || "";

export const IMAGE_PATH = process.env.IMAGE_PATH || "https://dr2mfr65joexd.cloudfront.net"
export const APP_NAME = process.env.APP_NAME || ""

// organization ID 

export const ORGANIZATION_ID = process.env.ORGANIZATION_ID || "";