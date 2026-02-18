import fs from "fs";
import { TImageType,TFileBulkUploadType } from "../data/types/common/common.type";
import { IMAGE_TYPE_LOCATION,FILE_BULK_UPLOAD_TYPE_LOCATION } from "../utils/app-constants";
import { DEFAULT_STATUS_CODE_SUCCESS } from "../utils/app-messages";
import { getLocalDate, resSuccess, resUnknownError } from "../utils/shared-functions";
import { s3UploadObject } from "./s3-client.helper";
import { type } from "os";
import { Client } from 'basic-ftp';
import { VPS_HOST, VPS_PASSWORD, VPS_PORT, VPS_USER } from "../config/env.var";

export const moveFileToFps = async (
  file: Express.Multer.File,
) => {
  
  var date = Number(getLocalDate());  
  
  let destinationPath = "/tmp" + "/" + date + file.filename;

  const client = new Client();
    await client.access({
    host: VPS_HOST,
    user: VPS_USER,
    password: VPS_PASSWORD,
    secure: false,
    port: 21
  });
  var check = await client.uploadFrom(file.path, '~/public_html/tmp/' + date + file.filename);
  
  fs.rmSync(file.path);
  return resSuccess({ data: destinationPath });
};
