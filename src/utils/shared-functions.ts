import { Sequelize } from "sequelize";
import { CRYPTO_JS_IV, CRYPTO_JS_KEY } from "../config/env.var";
import { IQueryPagination } from "../data/interfaces/common/common.interface";
import { TBitFieldValue, TResponse } from "../data/types/common/common.type";
import {
  BIT_FIELD_VALUES,
  GET_HTTP_METHODS_LABEL,
  PER_PAGE_ROWS,
} from "./app-constants";
import { DATE_FORMAT_TYPE, HTTP_METHODS } from "./app-enumeration";
import {
  BAD_REQUEST_CODE,
  BAD_REQUEST_MESSAGE,
  DEFAULT_STATUS_CODE_ERROR,
  DEFAULT_STATUS_CODE_SUCCESS,
  DEFAULT_STATUS_ERROR,
  DEFAULT_STATUS_SUCCESS,
  ERROR_ALREADY_EXIST,
  NOT_FOUND_CODE,
  NOT_FOUND_MESSAGE,
  UNAUTHORIZED_ACCESS_CODE,
  UNAUTHORIZED_ACCESS_MESSAGE,
  UNKNOWN_ERROR_TRY_AGAIN,
  UNPROCESSABLE_ENTITY_CODE,
  UNPROCESSABLE_ENTITY_MESSAGE,
} from "./app-messages";
const CryptoJS = require("crypto-js");

export const parseData = (data: Object) => {
  try {
    var info = JSON.stringify(data);
    if (String(info) === "{}") {
      info = String(data);
    }
    return info;
  } catch {
    return String(data);
  }
};

export const resSuccess: TResponse = (payload) => {
  return {
    code: payload?.code || DEFAULT_STATUS_CODE_SUCCESS,
    status: payload?.status || DEFAULT_STATUS_SUCCESS,
    message: payload?.message || DEFAULT_STATUS_SUCCESS,
    data: payload?.data || null,
  };
};

export const resError: TResponse = (payload) => {
  return {
    code: payload?.code || DEFAULT_STATUS_CODE_ERROR,
    status: payload?.status || DEFAULT_STATUS_ERROR,
    message: payload?.message || DEFAULT_STATUS_ERROR,
    data: payload?.data || null,
  };
};

export const resUnauthorizedAccess: TResponse = (payload) => {
  return {
    code: payload?.code || UNAUTHORIZED_ACCESS_CODE,
    status: payload?.status || DEFAULT_STATUS_ERROR,
    message: payload?.message || UNAUTHORIZED_ACCESS_MESSAGE,
    data: payload?.data || null,
  };
};

export const resUnknownError: TResponse = (payload) => {
  return {
    code: payload?.code || DEFAULT_STATUS_CODE_ERROR,
    status: payload?.status || DEFAULT_STATUS_ERROR,
    message: payload?.message || UNKNOWN_ERROR_TRY_AGAIN,
    data: payload?.data || null,
  };
};

export const resBadRequest: TResponse = (payload) => {
  return {
    code: payload?.code || BAD_REQUEST_CODE,
    status: payload?.status || DEFAULT_STATUS_ERROR,
    message: payload?.message || BAD_REQUEST_MESSAGE,
    data: payload?.data || [{msg:payload?.message,location:'body',value:''}],
  };
};

export const resErrorDataExit: TResponse = (payload) => {
  return {
    code: payload?.code || BAD_REQUEST_CODE,
    status: payload?.status || DEFAULT_STATUS_ERROR,
    message: payload?.message || ERROR_ALREADY_EXIST,
    data: payload?.data || null,
  };
};

export const resNotFound: TResponse = (payload) => {
  return {
    code: payload?.code || NOT_FOUND_CODE,
    status: payload?.status || DEFAULT_STATUS_ERROR,
    message: payload?.message || NOT_FOUND_MESSAGE,
    data: payload?.data || null,
  };
};

export const resUnprocessableEntity: TResponse = (payload) => {
  return {
    code: payload?.code || UNPROCESSABLE_ENTITY_CODE,
    status: payload?.status || DEFAULT_STATUS_ERROR,
    message: payload?.message || UNPROCESSABLE_ENTITY_MESSAGE,
    data: payload?.data || null,
  };
};

export const getLocalDate = () => {
  return new Date();
};

export const dateFormat = (
  date: Date,
  dateFormatType: number,
  join: string = "/"
) => {
  const day = (date.getDate() < 10 ? "0" : "") + date.getDate();
  const month = (date.getMonth() < 9 ? "0" : "") + (date.getMonth() + 1);
  const year = date.getFullYear().toString();
  switch (dateFormatType) {
    case DATE_FORMAT_TYPE.display_format:
      return day + "/" + month + "/" + year;
    case DATE_FORMAT_TYPE.YYYYMMDD:
      return year + join + month + join + day;
    case DATE_FORMAT_TYPE.log_file_name_format:
      return year + month + day;
    default:
      return date.toString();
  }
};

export const getLogSaveDateFormat = (date: Date) => {
  const formatedDate = dateFormat(date, DATE_FORMAT_TYPE.log_file_name_format);
  const hour = date.getHours();
  return {
    date: formatedDate,
    hour: hour < 10 ? "0" + hour : hour + "",
  };
};

export const genrerateRandomString = (length: number) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let result = "";
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const getInitialPaginationFromQuery = (
  query: Record<string, any>
): IQueryPagination => {
  let findIsActive;

  if (
    query &&
    typeof query.is_active == "string" &&
    BIT_FIELD_VALUES.includes(query.is_active)
  ) {
    findIsActive = query.is_active as TBitFieldValue;
  }

  return {
    per_page_rows: query.per_page_rows || PER_PAGE_ROWS,
    current_page: query.current_page || 1,
    order_by: query.order_by || "DESC",
    sort_by: query.sort_by || "id",
    is_active: findIsActive,
    total_pages: 0,
    total_items: 0,
    search_text: query.search_text || "",
  };
};

export const getInitialPaginationFromLowToHighPriceQuery = (
  query: Record<string, any>
): IQueryPagination => {
  let findIsActive;

  if (
    query &&
    typeof query.is_active == "string" &&
    BIT_FIELD_VALUES.includes(query.is_active)
  ) {
    findIsActive = query.is_active as TBitFieldValue;
  }

  return {
    per_page_rows: query.per_page_rows || PER_PAGE_ROWS,
    current_page: query.current_page || 1,
    order_by: query.order_by || "ASC",
    sort_by: query.sort_by || "total",
    is_active: findIsActive,
    total_pages: 0,
    total_items: 0,
    search_text: query.search_text || "",
  };
};

export const getInitialPaginationFromHighLowPriceQuery = (
  query: Record<string, any>
): IQueryPagination => {
  let findIsActive;

  if (
    query &&
    typeof query.is_active == "string" &&
    BIT_FIELD_VALUES.includes(query.is_active)
  ) {
    findIsActive = query.is_active as TBitFieldValue;
  }

  return {
    per_page_rows: query.per_page_rows || PER_PAGE_ROWS,
    current_page: query.current_page || 1,
    order_by: query.order_by || "DESC",
    sort_by: query.sort_by || "total",
    is_active: findIsActive,
    total_pages: 0,
    total_items: 0,
    search_text: query.search_text || "",
  };
};

export const prepareMessageFromParams = (
  message: string,
  params: [string, string][]
) => {
  let resultMessage = message;
  for (const [key, value] of params) {
    resultMessage = resultMessage.replace(
      new RegExp("<<" + key + ">>", "g"),
      value
    );
  }
  return resultMessage;
};

export const getMethodFromRequest = (method: string) => {
  switch (method) {
    case GET_HTTP_METHODS_LABEL[HTTP_METHODS.Get]:
      return HTTP_METHODS.Get;
    case GET_HTTP_METHODS_LABEL[HTTP_METHODS.Post]:
      return HTTP_METHODS.Post;
    case GET_HTTP_METHODS_LABEL[HTTP_METHODS.Put]:
      return HTTP_METHODS.Put;
    case GET_HTTP_METHODS_LABEL[HTTP_METHODS.Delete]:
      return HTTP_METHODS.Delete;
    default:
      return 0;
  }
};

export const getEncryptedText = (text: String) => {
  const encryptedData = CryptoJS.AES.encrypt(text, CRYPTO_JS_KEY, {
    iv: CRYPTO_JS_IV,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  }).toString();
  return encryptedData;
};

export const getDecryptedText = (text: String) => {
  const descryptedText = CryptoJS.AES.decrypt(text, CRYPTO_JS_KEY, {
    iv: CRYPTO_JS_IV,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  }).toString(CryptoJS.enc.Utf8);
  return descryptedText;
};

export const roundDecimalNumber = (value: number, decimalPoint: number) => {
  return (
    Math.round(value * Math.pow(10, decimalPoint)) / Math.pow(10, decimalPoint)
  );
};

export const columnValueLowerCase = (field_name: any, value: any) => {
  return Sequelize.where(Sequelize.fn('LOWER', Sequelize.col(`${[field_name]}`)),value.toLowerCase())
}