import fs from "fs";
import path from "path";
import { FRONT_END_BASE_URL } from "../config/env.var";
import { ITokenExpiredTime } from "../data/interfaces/jwt/jwt.interface";
import { TUserType } from "../data/types/common/common.type";

import {
  HTTP_METHODS,
  IMAGE_TYPE,
  FILE_BULK_UPLOAD_TYPE,
  PRODUCT_IMAGE_TYPE,
  PRODUCT_VIDEO_TYPE,
  USER_TYPE,
  FILE_TYPE,
} from "./app-enumeration";

// Region REQUEST RESPONSE CODER
export const SIGNATURE_ALGORITHM = "sha1WithRSAEncryption";

export const CIPHER_ALGORITHM = "aes-128-cbc";

// export const PUBLIC_KEY = fs.readFileSync(
//   path.join(__dirname, "../../../private/req-res-encoder/keys/test.public.pub"),
//   {
//     encoding: "utf8",
//   }
// );
// export const PRIVATE_KEY = fs.readFileSync(
//   path.join(
//     __dirname,
//     "../../../private/req-res-encoder/keys/test.private.pkcs8"
//   ),
//   {
//     encoding: "utf8",
//   }
// );
// End Region

// Region JWT
export const PUBLIC_KEY = "PUBLIC_KEY";
export const PRIVATE_KEY = "PRIVATE_KEY";
export const JWT_SECRET_KEY = "JWT_SECRET_KEY";

// Expiration time is in seconds
export const USER_JWT_EXPIRATION_TIME = {
  [USER_TYPE.Administrator]: { tokenTime: 186400, refreshTokenTime: 186400 * 2 },
  [USER_TYPE.BusinessUser]: { tokenTime: 186400, refreshTokenTime: 186400 * 2 },
  [USER_TYPE.Customer]: { tokenTime: 186400, refreshTokenTime: 186400 * 2 },
};

export const RESET_JWT_TOKEN_EXPRATION_TIME = 60;

export const JWT_EXPIRED_ERROR_NAME = "TokenExpiredError";
export const JWT_EXPIRED_ERROR_MESSAGES = {
  invalidToken: "invalid token",
  jwtMalformed: "jwt malformed",
  jwtSignatureIsRequired: "jwt signature is required",
  jwtAudienceInvalid: "jwt audience invalid",
  jwtIssuerInvalid: "jwt issuer invalid",
  jwtIdInvalid: "jwt id invalid",
  jwtSubjectInvalid: "jwt subject invalid",
};
// End Region

export const PASSWORD_SOLT = 10;

export const PASSWORD_REGEX =
  /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&])[a-zA-Z0-9@$!%*#?&]+/g;

export const USER_TYPE_LIST = Object.keys(USER_TYPE)
  .filter((key) => isNaN(Number(key)))
  .map((key) => USER_TYPE[key as keyof typeof USER_TYPE]);

export const IMAGE_TYPE_LOCATION : any = {
  [IMAGE_TYPE.profile]: "images/profile",
  [IMAGE_TYPE.Project]: "images/project",
  [IMAGE_TYPE.Builder]: "images/builder",
  [IMAGE_TYPE.Banner]: "images/banner",
  [IMAGE_TYPE.Blog]: "images/blog",
};
export const FILE_UPLOAD_LOCATION = {
[FILE_TYPE.document] : "document",
}
export const FILE_BULK_UPLOAD_TYPE_LOCATION = {
  [FILE_BULK_UPLOAD_TYPE.ProductUpload]: "csvFile/ProductUpload",

};

export const GET_HTTP_METHODS_LABEL = {
  [HTTP_METHODS.Get]: "GET",
  [HTTP_METHODS.Post]: "POST",
  [HTTP_METHODS.Put]: "PUT",
  [HTTP_METHODS.Delete]: "DELETE",
};

export const PER_PAGE_ROWS = 10;
export const PRODUCT_PER_PAGE_ROW = 20;

export const BIT_FIELD_VALUES = ["0", "1"];

export const BIT_REQUEST_TYPE_VALUES = ["0", "1"];

export const BIT_PRODUCT_FIELD_VALUES = ["0", "1", "2"];

export const BIT_REQUEST_STATUS_VALUES = ["0", "1", "2"];

export const PRODUCT_VIDEO_TYPE_LIST = [PRODUCT_VIDEO_TYPE.Feature];

