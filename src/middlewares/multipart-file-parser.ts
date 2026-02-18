import { RequestHandler } from "express";
import multer from "multer";
import path from "path";
import {
  PRODUCT_BULK_UPLOAD_FILE_SIZE,
  PRODUCT_BULK_UPLOAD_ZIP_SIZE,
  STORE_TEMP_FILE_PATH,
  STORE_TEMP_IMAGE_PATH,
  STORE_TEMP_VIDEO_PATH,
} from "../config/env.var";
// import { createFolderIfNot } from "../helpers/file.helper";
import { DEFAULT_STATUS_CODE_ERROR } from "../utils/app-messages";
import { getLocalDate, resUnknownError } from "../utils/shared-functions";

const upload = (destinationPath: string, options?: multer.Options) =>
  multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        
        cb(null, destinationPath);
      },
      filename: function (_req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + file.originalname);
      },
    }),
    limits: options?.limits,
  });

export const reqSingleImageParser =
  (field_name: string): RequestHandler =>
  (req, res, next) => {
    try {
      const session_res = req.body.session_res;
      // createFolderIfNot(STORE_TEMP_IMAGE_PATH);
      upload(STORE_TEMP_IMAGE_PATH).single(field_name)(req, res, (err) => {
        if (err) {
          return res
            .status(DEFAULT_STATUS_CODE_ERROR)
            .send(resUnknownError({ data: err }));
        }
        req.body["session_res"] = session_res;
        return next();
      });
    } catch (e) {
      return res
        .status(DEFAULT_STATUS_CODE_ERROR)
        .send(resUnknownError({ data: e }));
    }
  };

export const reqMultiImageParser =
  (fieldArray: string[]): RequestHandler =>
  (req, res, next) => {
    try {      
      const session_res = req.body.session_res;
      // createFolderIfNot(STORE_TEMP_IMAGE_PATH);
      upload(STORE_TEMP_IMAGE_PATH).fields(
        fieldArray.map((name) => ({ name, maxCount: 1 }))
      )(req, res, (err) => {
        if (err) {
          return res
            .status(DEFAULT_STATUS_CODE_ERROR)
            .send(resUnknownError({ data: err }));
        }
        req.body["session_res"] = session_res;
        return next();
      });
    } catch (e) {
      return res
        .status(DEFAULT_STATUS_CODE_ERROR)
        .send(resUnknownError({ data: e }));
    }
  };
  export const reqMultiFileParser =
  (fieldArray: string[]): RequestHandler =>
  (req, res, next) => {
    try {      
      const session_res = req.body.session_res;
      // createFolderIfNot(STORE_TEMP_FILE_PATH);
      upload(STORE_TEMP_FILE_PATH).fields(
        fieldArray.map((name) => ({ name, maxCount: 1 }))
      )(req, res, (err) => {
        if (err) {
          return res
            .status(DEFAULT_STATUS_CODE_ERROR)
            .send(resUnknownError({ data: err }));
        }
        req.body["session_res"] = session_res;
        return next();
      });
    } catch (e) {
      return res
        .status(DEFAULT_STATUS_CODE_ERROR)
        .send(resUnknownError({ data: e }));
    }
  };

export const reqProductBulkUploadFileParser =
  (field_name: string): RequestHandler =>
  (req, res, next) => {
    try {
      console.log(req.body)
      const session_res = req.body.session_res;
      // createFolderIfNot(STORE_TEMP_FILE_PATH);
      upload(STORE_TEMP_FILE_PATH, {
        limits: { fileSize: PRODUCT_BULK_UPLOAD_FILE_SIZE * 1000 * 1000 },
        dest: STORE_TEMP_FILE_PATH,
      }).single(field_name)(req, res, (err) => {
        if (err) {
          return res
            .status(DEFAULT_STATUS_CODE_ERROR)
            .send(resUnknownError({ data: err }));
        }
        req.body["session_res"] = session_res;
        return next();
      });
    } catch (e) {
      return res
        .status(DEFAULT_STATUS_CODE_ERROR)
        .send(resUnknownError({ data: e }));
    }
  };

  export const reqProductBulkZipFileParser =
  (field_name: string): RequestHandler =>
  (req, res, next) => {
    try {
      const session_res = req.body.session_res;
      // createFolderIfNot(STORE_TEMP_FILE_PATH);
      upload(STORE_TEMP_FILE_PATH).single(field_name)(req, res, (err) => {
        console.log("err", err);
        //Check below code why it's not working 
        
        // if (err) {
        //   return res
        //     .status(DEFAULT_STATUS_CODE_ERROR)
        //     .send(resUnknownError({ data: err }));
        // }
        req.body["session_res"] = session_res;
        return next();
      });
    } catch (e) {
      console.log("e", e)
      return res
        .status(DEFAULT_STATUS_CODE_ERROR)
        .send(resUnknownError({ data: e }));
    }
  };

export const reqArrayImageParser =
  (fieldArray: string[]): RequestHandler =>
  (req, res, next) => {
    try {
      const session_res = req.body.session_res;
      // createFolderIfNot(STORE_TEMP_IMAGE_PATH);
      upload(STORE_TEMP_IMAGE_PATH).fields(
        fieldArray.map((name) => ({ name }))
      )(req, res, (err) => {
        if (err) {
          return res
            .status(DEFAULT_STATUS_CODE_ERROR)
            .send(resUnknownError({ data: err }));
        }
        req.body["session_res"] = session_res;
        return next();
      });
    } catch (e) {
      return res
        .status(DEFAULT_STATUS_CODE_ERROR)
        .send(resUnknownError({ data: e }));
    }
  };

export const reqArrayVideoParser =
  (fieldArray: string[]): RequestHandler =>
  (req, res, next) => {
    try {
      const session_res = req.body.session_res;
      console.log("here");
      // createFolderIfNot(STORE_TEMP_VIDEO_PATH);
      upload(STORE_TEMP_VIDEO_PATH).fields(
        fieldArray.map((name) => ({ name }))
      )(req, res, (err) => {
        if (err) {
          return res
            .status(DEFAULT_STATUS_CODE_ERROR)
            .send(resUnknownError({ data: err }));
        }
        req.body["session_res"] = session_res;
        return next();
      });
    } catch (e) {
      return res
        .status(DEFAULT_STATUS_CODE_ERROR)
        .send(resUnknownError({ data: e }));
    }
  };
