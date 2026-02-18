import { Request } from "express";
import {
  createResetToken,
  createUserJWT,
  verifyJWT,
} from "../helpers/jwt.helper";
import { FILE_UPLOAD_LOCATION, JWT_EXPIRED_ERROR_NAME, PASSWORD_SOLT } from "../utils/app-constants";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  FORBIDDEN_CODE,
  INVALID_USERNAME_PASSWORD,
  UNAUTHORIZED_ACCESS_CODE,
  ACCOUNT_NOT_ACTIVE,
  ROLE_NOT_FOUND,
  USER_NOT_FOUND,
  USER_NOT_FOUND_WITH_REFRESH_TOKEN,
  ACCOUNT_NOT_VERIFIED,
  ACCOUNT_IS_BLOCKED,
  ACCOUNT_NOT_APPROVED,
  PASSWORD_IS_WRONG,
  INVALID_TOKEN,
  INVALID_OTP,
  USER_EMAIL_ID_ALREADY_VERIFIED,
  NOT_VARIFIED,
  FILE_NOT_ALLOW,
  FILE_SIZE_5MB,
  USER_NOT_ABLE_CONNECT,
  RECORD_UPDATE_SUCCESSFULLY,
  ACCOUNT_REJECTED,
  ACCOUNT_IS_REVIEW,
} from "../utils/app-messages";
import {
  getDecryptedText,
  getEncryptedText,
  getLocalDate,
  resBadRequest,
  resError,
  resErrorDataExit,
  resNotFound,
  resSuccess,
  resUnknownError,
  resUnprocessableEntity,
} from "../utils/shared-functions";
import bcrypt from "bcrypt";
import AppUser from "../model/app-user.model";
import { ActiveStatus, CUSTOMER_USER_STATUS, DeletedStaus, FILE_TYPE, IMAGE_TYPE, USER_STATUS, USER_TYPE } from "../utils/app-enumeration";
import BusinessUser from "../model/business-user.model";
import { FRONT_END_BASE_URL, IMAGE_PATH, OTP_GENERATE_DIGITS, RESET_PASSWORD_PATH } from "../config/env.var";
import dbContext from "../config/db-context";
import Image from "../model/image.model";
import {Sequelize, where} from "sequelize";
import Role from "../model/role.model";
import SystemConfiguration from "../model/system-configuration.model";

export const userActiveStatus = async (req: Request) => {
  try {
      const userExists = await AppUser.findOne({ where: { id: req.body.user_id, is_deleted: DeletedStaus.InDeleted } });
      console.log(req.body);
      
      if (userExists) {
          const shadeActionInfo = await (AppUser.update(
              {
                  is_active: req.body.is_active,
                  modified_date: getLocalDate(),
                  modified_by: req.body.session_res.id_app_user
              },
              { where: { id: userExists.dataValues.id } }
          ));
          if (shadeActionInfo) {
              return resSuccess({message: RECORD_UPDATE_SUCCESSFULLY})
          } 
      } else {
          return resNotFound();
      }
  } catch (error) {
      throw error
  }
  } 

export const registerSystemUser = async (req: Request) => {
  try {
    const { username, password, user_type } = req.body;

    const pass_hash = await bcrypt.hash(password, Number(PASSWORD_SOLT));
    const payload = {
      username,
      pass_hash,
      user_type,
      created_at: getLocalDate(),
    };
    const result = await AppUser.create(payload);

    const jwtPayload = {
      id: result.dataValues.id,
      idAppUser: result.dataValues.id,
      userType: result.dataValues.user_type,
    };
    const data = await createUserJWT(
      result.dataValues.id,
      jwtPayload,
      result.dataValues.user_type
    );

    return resSuccess({
      data: {
        userInfo: result,
        token: data,
      },
    });
  } catch (e) {
    throw e;
  }
};

export const authenticateSystemUser = async (req: Request) => {
  try {
    const { username, password } = req.body;    
    
    const appUser = await AppUser.findOne({
      where: { username, is_deleted: "0" },
    });
    let userDetails;

    if (!appUser) {
      return resNotFound({ message: USER_NOT_FOUND });
    }
    
    // const isPasswordValid = <any>(
    //   await bcrypt.compare(password, appUser.dataValues.pass_hash)
    // );
    // if (!isPasswordValid) {
    //   return resBadRequest({ message: INVALID_USERNAME_PASSWORD });
    // }

    if (appUser.dataValues.is_active === "0") {
      return resError({ message: ACCOUNT_NOT_ACTIVE, code: FORBIDDEN_CODE });
    }

    if (
      appUser.dataValues.user_status === CUSTOMER_USER_STATUS.PendingVerification
    ) {
      const digits = '0123456789';
      let OTP = ''; 
      for(let i=0; i<OTP_GENERATE_DIGITS; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
      }
      
      const mailPayload = {
        toEmailAddress: appUser.dataValues.username,
        contentTobeReplaced: { name: appUser.dataValues.full_name, OTP },
      };
      
      const appUserInfo = await (AppUser.update(
        {
          one_time_pass: OTP,
          modified_date: getLocalDate(),
          modified_by: appUser.dataValues.id,
        },        
        { where: { id: appUser.dataValues.id, is_deleted: "0" } }
      ));
      return resError({ status: NOT_VARIFIED, message: ACCOUNT_NOT_VERIFIED, code: FORBIDDEN_CODE, data: appUser.dataValues.id });
    }

    if (appUser.dataValues.user_type === USER_TYPE.Administrator) {
      userDetails = await AppUser.findOne({
        where: { id: appUser.dataValues.id },
      });
    } else if (appUser.dataValues.user_type === USER_TYPE.BusinessUser) {
      userDetails = await BusinessUser.findOne({
        where: { id_app_user: appUser.dataValues.id },
      });
    }

    const jwtPayload = {
      id:
        userDetails && userDetails.dataValues
          ? userDetails.dataValues.id
          : appUser.dataValues.id,
      id_app_user: appUser.dataValues.id,
      user_type: appUser.dataValues.user_type,
      id_role: appUser.dataValues.id_role,
    };

    const data = createUserJWT(
      appUser.dataValues.id,
      jwtPayload,
      appUser.dataValues.user_type
    );
    if (appUser.dataValues.user_status === CUSTOMER_USER_STATUS.OTP_Varified) {
      return resError({ message: ACCOUNT_NOT_APPROVED, code: FORBIDDEN_CODE,data: {
        tokens: data,
        user_detail: userDetails,
        id_role: appUser.dataValues.id_role,
      } });
    }

    if (appUser.dataValues.user_status === CUSTOMER_USER_STATUS.In_Review) {
      return resError({ message: ACCOUNT_IS_REVIEW, code: FORBIDDEN_CODE,data: {
        tokens: data,
        user_detail: userDetails,
        id_role: appUser.dataValues.id_role,
      } });
    }
    if (appUser.dataValues.user_status === CUSTOMER_USER_STATUS.Rejected) {
      return resError({ message: ACCOUNT_REJECTED, code: FORBIDDEN_CODE,data: {
        tokens: data,
        user_detail: userDetails,
        id_role: appUser.dataValues.id_role,
      } });
    }

    return resSuccess({
      data: {
        tokens: data,
        user_detail: userDetails,
        id_role: appUser.dataValues.id_role,
      },
    });
  } catch (e) {
    throw e;
  }
};

export const refreshAuthorizationToken = async (req: Request) => {
  try {
    const refreshToken = req.body.refresh_token;

    const result = await verifyJWT(refreshToken);
    if (result.code === DEFAULT_STATUS_CODE_SUCCESS) {
      const appUser = await AppUser.findOne({
        where: { refresh_token: refreshToken },
      });
      if (!appUser) {
        return resBadRequest({ message: USER_NOT_FOUND_WITH_REFRESH_TOKEN });
      }

      const jwtPayload = {
        id: appUser.dataValues.id,
        idAppUser: appUser.dataValues.id,
        userType: appUser.dataValues.user_type,
      };
      const data = createUserJWT(
        appUser.dataValues.id,
        jwtPayload,
        appUser.dataValues.user_type
      );
      return resSuccess({ data });
    } else if (
      result.code === UNAUTHORIZED_ACCESS_CODE &&
      result.message === JWT_EXPIRED_ERROR_NAME
    ) {
      return result;
    }

    return resUnknownError(result);
  } catch (e) {
    throw e;
  }
};

export const changePassword = async (req: Request) => {
  try {
    const appUser = await AppUser.findOne({
      where: { id: req.body.session_res.id_app_user },
    });
    if (!appUser) {
      return resBadRequest({ message: USER_NOT_FOUND });
    }

    const isPasswordValid = <any>(
      await bcrypt.compare(req.body.old_password, appUser.dataValues.pass_hash)
    );
    if (!isPasswordValid) {
      return resBadRequest({ message: PASSWORD_IS_WRONG });
    }

    const pass_hash = await bcrypt.hash(
      req.body.new_password,
      Number(PASSWORD_SOLT)
    );

    await AppUser.update(
      {
        pass_hash,
        modified_at: getLocalDate(),
        modified_by: appUser.dataValues.id,
      },
      { where: { id: appUser.dataValues.id } }
    );

    return resSuccess();
  } catch (e) {
    throw e;
  }
};

export const forgotPassword = async (req: Request) => {
  try {
    const appUser = await AppUser.findOne({
      where: { username: req.body.username, is_deleted: "0" },
    });
    if (!appUser) {
      return resBadRequest({ message: USER_NOT_FOUND });
    }

    let name;
    if (appUser.dataValues.user_type === USER_TYPE.BusinessUser) {
      const businessUser = await BusinessUser.findOne({
        where: { id_app_user: appUser.dataValues.id },
      });
      if (!(businessUser && businessUser.dataValues)) {
        return resBadRequest({ message: USER_NOT_FOUND });
      }
      name = businessUser.dataValues.name;
    } 
    // else if (appUser.dataValues.user_type === USER_TYPE.Customer) {
    //   const customer = await customerUser.findOne({
    //     where: { id_app_user: appUser.dataValues.id },
    //   });
    //   if (!(customer && customer.dataValues)) {
    //     return resBadRequest({ message: USER_NOT_FOUND });
    //   }
    //   name =
    //     customer.dataValues.full_name;
    // }

    const token = createResetToken(appUser.dataValues.id);

    let link = `${FRONT_END_BASE_URL}/${RESET_PASSWORD_PATH}${token}`;
    let logo_image = IMAGE_PATH
    let frontend_url = FRONT_END_BASE_URL
    const mailPayload = {
      toEmailAddress: appUser.dataValues.username,
      contentTobeReplaced: { name, link, logo_image, frontend_url },
    };
    // await mailPasswordResetLink(mailPayload);

    await AppUser.update(
      {
        pass_reset_token: token,
        modified_date: getLocalDate(),
        modified_by: appUser.dataValues.id,
      },
      { where: { id: appUser.dataValues.id } }
    );

    return resSuccess();
  } catch (e) {
    throw e;
  }
};

export const resetPassword = async (req: Request) => {
  try {
    const tokenRes = await verifyJWT(req.body.token);
    if (tokenRes.code !== DEFAULT_STATUS_CODE_SUCCESS) {
      return tokenRes;
    }
    const appUser = await AppUser.findOne({
      where: { id: tokenRes.data.id },
    });
    if (!appUser) {
      return resUnprocessableEntity({ message: USER_NOT_FOUND });
    }

    if (appUser.dataValues.pass_reset_token !== req.body.token) {
      return resUnprocessableEntity({ message: INVALID_TOKEN });
    }

    const pass_hash = await bcrypt.hash(
      req.body.new_password,
      Number(PASSWORD_SOLT)
    );

    await AppUser.update(
      {
        pass_hash,
        pass_reset_token: null,
        modified_date: getLocalDate(),
        modified_by: appUser.dataValues.id,
      },
      { where: { id: appUser.dataValues.id } }
    );

    return resSuccess();
  } catch (e) {
    throw e;
  }
};

export const changeAnyUserPassword = async (req: Request) => {
  try {
    const { id_app_user, new_password } = req.body;

    const userToUpdate = await AppUser.findOne({
      where: { id: id_app_user, is_deleted: "0" },
    });

    if (!(userToUpdate && userToUpdate.dataValues)) {
      return resNotFound({ message: USER_NOT_FOUND });
    }

    const pass_hash = await bcrypt.hash(new_password, Number(PASSWORD_SOLT));

    await AppUser.update(
      {
        pass_hash,
        modified_at: getLocalDate(),
        modified_by: req.body.session_res.id_app_user,
      },
      { where: { id: userToUpdate.dataValues.id } }
    );

    return resSuccess();
  } catch (e) {
    throw e;
  }
};
export const fetchConfigurationByKey = async (key: string) => {
  try{
    const config = await SystemConfiguration.findOne({where: {config_key: key}});
    console.log("config", config);
    
    if(config && config.dataValues){
      return resSuccess({data: config});
    }
    return resNotFound()
  }catch(e){
    return resUnknownError({data: e});
  }
}