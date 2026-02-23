import {
  DEFAULT_STATUS_CODE_ERROR,
  DEFAULT_STATUS_CODE_SUCCESS,
  DEFAULT_STATUS_ERROR,
  UNKNOWN_ERROR_TRY_AGAIN,
} from "../utils/app-messages";
import { getLocalDate, parseData } from "../utils/shared-functions";
import { Request, Response } from "express";
import { saveServerLogs } from "../helpers/log.hepler";
import { encryptResData } from "../middlewares/req-res-encoder";
import { SECURE_COMMUNICATION } from "../config/env.var";

export async function callServiceMethod(
  req: Request,
  res: Response,
  serviceMethodTocall: any,
  actionName: string
) {
  const requestTime = getLocalDate();
  let response;

  try {
    const data = await serviceMethodTocall;

    const successStatus =
      typeof data?.code === "number"
        ? data.code
        : DEFAULT_STATUS_CODE_SUCCESS;

    response = {
      status: successStatus,
      data: data ? data : null,
    };
  } catch (err: any) {
    console.error("API Error:", err);

    const statusCode =
      typeof err?.code === "number"
        ? err.code
        : DEFAULT_STATUS_CODE_ERROR;

    response = {
      status: statusCode,
      data: {
        code: statusCode,
        message: err?.message
          ? err.message
          : UNKNOWN_ERROR_TRY_AGAIN,
        status: err?.status
          ? err.status
          : DEFAULT_STATUS_ERROR,
        data:
          err?.data && typeof err !== "object"
            ? parseData(err)
            : null,
      },
    };
  }

  // Save logs safely
  try {
    saveServerLogs({
      requestTime,
      url: req.originalUrl,
      action: actionName,
      body: req.body,
      responseTime: getLocalDate(),
      response: response?.data,
    });
  } catch (logError) {
    console.error("Log error:", logError);
  }

  const encodedResponse = SECURE_COMMUNICATION
    ? encryptResData(response.data)
    : response.data;

  return res.status(response.status).send(encodedResponse);
}