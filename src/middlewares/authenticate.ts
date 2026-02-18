import { Request, RequestHandler, Response } from "express";
import { PUBLIC_AUTHORIZATION_TOKEN } from "../config/env.var";
import { verifyJWT } from "../helpers/jwt.helper";
import RoleApiPermission from "../model/role-api-permission.model";
import RolePermissionAccess from "../model/role-permission-access.model";
import RolePermission from "../model/role-permission.model";
import { JWT_EXPIRED_ERROR_NAME } from "../utils/app-constants";
import { USER_TYPE } from "../utils/app-enumeration";
import {
  DEFAULT_STATUS_CODE_ERROR,
  UNAUTHORIZED_ACCESS_CODE,
  BAD_REQUEST_CODE,
  DEFAULT_STATUS_CODE_SUCCESS,
  AUTHORIZATION_TOKEN_IS_REQUIRED,
  HTTP_METHOD_NOT_FOUND,
  ROLE_API_PERMISSION_NOT_FOUND,
} from "../utils/app-messages";
import {
  getMethodFromRequest,
  resBadRequest,
  resUnauthorizedAccess,
  resUnknownError,
} from "../utils/shared-functions";

export const publicAuthentication: RequestHandler = (req, res, next) => {
  if (!req.headers.authorization) {
    return res
      .status(BAD_REQUEST_CODE)
      .send(resBadRequest({ message: AUTHORIZATION_TOKEN_IS_REQUIRED }));
  }
  if (req.headers.authorization === "key") {
    return next();
  }
  return res.status(UNAUTHORIZED_ACCESS_CODE).send(resUnauthorizedAccess());
};

export const verifyAuthorizationToken = async (req: Request, res: Response) => {
  try {
    if (!req.headers.authorization) {
      return res
        .status(BAD_REQUEST_CODE)
        .send(resBadRequest({ message: AUTHORIZATION_TOKEN_IS_REQUIRED }));
    }
    const result = await verifyJWT(req.headers.authorization);
    if (result.code === DEFAULT_STATUS_CODE_SUCCESS) {
      return result.data;
    } else if (
      result.code === UNAUTHORIZED_ACCESS_CODE &&
      result.message === JWT_EXPIRED_ERROR_NAME
    ) {
      return res.status(result.code).send(result);
    }
    return res.status(DEFAULT_STATUS_CODE_ERROR).send(resUnknownError());
  } catch (e) {
    return res
      .status(DEFAULT_STATUS_CODE_ERROR)
      .send(resUnknownError({ data: e }));
  }
};

export const authentication: RequestHandler = async (req, res, next) => {
  const data = await verifyAuthorizationToken(req, res);
  if (!res.headersSent) {
    return next();
  }
};

export const tokenVerification: RequestHandler = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res
        .status(UNAUTHORIZED_ACCESS_CODE)
        .send(resBadRequest({ message: AUTHORIZATION_TOKEN_IS_REQUIRED }));
    }

    if (req.headers.authorization === PUBLIC_AUTHORIZATION_TOKEN) {
      req.body["session_res"] = {
        id: null,
        id_app_user: null,
        userType: USER_TYPE.Guest,
        id_role: null,
      };
      // Temporary session because we don't have authentication api
      // req.body["session_res"] = {
      //   id: 1,
      //   id_app_user: 1,
      //   user_type: USER_TYPE.Administrator,
      //   id_role: 0,
      // };
    } else {
      const result = await verifyJWT(req.headers.authorization);
      if (result.code === DEFAULT_STATUS_CODE_SUCCESS) {
        if (!result.data.id_app_user) {

          return res
            .status(UNAUTHORIZED_ACCESS_CODE)
            .send(resUnauthorizedAccess());
        }
        req.body["session_res"] = result.data;
      } else {
        return res.status(result.code).send(result);
      }
    }
    return next();
  } catch (e) {
    return res
      .status(DEFAULT_STATUS_CODE_ERROR)
      .send(resUnknownError({ data: e }));
  }
};

export const authorization: RequestHandler = async (req, res, next) => {
  try {
    if (req.body.session_res.id_role === 0) {
      return next();
    }
    const apiEndpoint = req.route.path;
    const method = getMethodFromRequest(req.method);

    if (method === 0) {
      return res
        .status(DEFAULT_STATUS_CODE_ERROR)
        .send(resUnauthorizedAccess({ data: HTTP_METHOD_NOT_FOUND }));
    }

    const resultRAP = await RoleApiPermission.findOne({
      where: { http_method: method, api_endpoint: apiEndpoint, is_active: "1" },
    });

    if (!(resultRAP && resultRAP.dataValues)) {
      return res
        .status(DEFAULT_STATUS_CODE_ERROR)
        .send(resUnauthorizedAccess({ data: ROLE_API_PERMISSION_NOT_FOUND }));
    }

    const rolePermission = await RolePermission.findOne({
      where: {
        id_role: req.body.session_res.id_role,
        id_menu_item: resultRAP.dataValues.id_menu_item,
        is_active: "1",
      },
      include: {
        model: RolePermissionAccess,
        as: "RPA",
        required: true,
        where: {
          id_action: resultRAP.dataValues.id_action,
          access: "1",
        },
      },
    });

    if (!(rolePermission && rolePermission.dataValues)) {
      return res
        .status(DEFAULT_STATUS_CODE_ERROR)
        .send(resUnauthorizedAccess());
    }

    return next();
  } catch (e) {
    return res
      .status(DEFAULT_STATUS_CODE_ERROR)
      .send(resUnknownError({ data: e }));
  }
};
export const customerAuthorization: RequestHandler = async (req, res, next) => {
  try {
    if (req.body.session_res.id_role === 0) {
      return next();
    }
    const method = getMethodFromRequest(req.method);

    if (method === 0) {
      return res
        .status(DEFAULT_STATUS_CODE_ERROR)
        .send(resUnauthorizedAccess({ data: HTTP_METHOD_NOT_FOUND }));
    }


    //Check 
    if (parseInt(req.body.session_res.user_type) != USER_TYPE.Customer)  {

      return res
        .status(DEFAULT_STATUS_CODE_ERROR)
        .send(resUnauthorizedAccess());
    }

    return next();
  } catch (e) {
    return res
      .status(DEFAULT_STATUS_CODE_ERROR)
      .send(resUnknownError({ data: e }));
  }
};
