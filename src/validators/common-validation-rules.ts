import { body } from "express-validator";
import { BIT_FIELD_VALUES, PASSWORD_REGEX } from "../utils/app-constants";
import {
  CONFIRM_PASSWORD_IS_REQUIRED,
  DUPLICATE_VALUE_ERROR_MESSAGE,
  INVALID_PASSWORD,
  IS_ACTIVE_EXPECTED_TYPE_STRING,
  IS_ACTIVE_REQUIRED,
  MIN_MAX_LENGTH_ERROR_MESSAGE,
  ONLY_AI_EXPECTED_TYPE_STRING,
  PASSWORD_IS_REQUIRED,
  PASSWORD_MUST_BE_SAME,
  PASSWORD_TYPE_NON_EMPTY_STRING,
  REQUIRED_ERROR_MESSAGE,
  TYPE_ARRAY_ERROR_MESSAGE,
  TYPE_BIT_ERROR_MESSAGE,
  TYPE_DECIMAL_ERROR_MESSAGE,
  TYPE_MIN_MAX_FLOAT_ERROR_MESSAGE,
  TYPE_INTEGER_ERROR_MESSAGE,
  TYPE_NON_EMPTY_STRING_ERROR_MESSAGE,
  TYPE_ARRAY_NON_EMPTY_ERROR_MESSAGE,
} from "../utils/app-messages";
import { prepareMessageFromParams } from "../utils/shared-functions";

export const isActiveChain = body("is_active")
  .exists()
  .withMessage(IS_ACTIVE_REQUIRED)
  .isString()
  .withMessage(IS_ACTIVE_EXPECTED_TYPE_STRING)
  .isIn(BIT_FIELD_VALUES)
  .withMessage(IS_ACTIVE_EXPECTED_TYPE_STRING);

export const isOnlyAIChain = body("only_active_inactive")
  .optional()
  .isString()
  .withMessage(ONLY_AI_EXPECTED_TYPE_STRING)
  .isIn(BIT_FIELD_VALUES)
  .withMessage(ONLY_AI_EXPECTED_TYPE_STRING);

export const passwordChain = body("password")
  .exists()
  .withMessage(PASSWORD_IS_REQUIRED)
  .isString()
  .withMessage(PASSWORD_TYPE_NON_EMPTY_STRING)
  .not()
  .isEmpty()
  .withMessage(PASSWORD_TYPE_NON_EMPTY_STRING)
  .matches(PASSWORD_REGEX)
  .withMessage(INVALID_PASSWORD);

export const confirmPasswordChain = body("confirm_password")
  .exists()
  .withMessage(CONFIRM_PASSWORD_IS_REQUIRED)
  .custom(async (confirmPassword, { req }) => {
    if (req.body.password !== confirmPassword) {
      throw false;
    }
  })
  .withMessage(PASSWORD_MUST_BE_SAME);

export const fieldStringMinMaxChain = (
  name: string,
  field: string,
  min: number,
  max: number
) =>
  body(field)
    .exists()
    .withMessage(
      prepareMessageFromParams(REQUIRED_ERROR_MESSAGE, [["field_name", name]])
    )
    .isString()
    .withMessage(
      prepareMessageFromParams(TYPE_NON_EMPTY_STRING_ERROR_MESSAGE, [
        ["field_name", name],
      ])
    )
    .not()
    .isEmpty()
    .withMessage(
      prepareMessageFromParams(TYPE_NON_EMPTY_STRING_ERROR_MESSAGE, [
        ["field_name", name],
      ])
    )
    .trim()
    .isLength({
      min,
      max,
    })
    .withMessage(
      prepareMessageFromParams(MIN_MAX_LENGTH_ERROR_MESSAGE, [
        ["field_name", name],
        ["min", min.toString()],
        ["max", max.toString()],
      ])
    );

export const fieldIntegerChain = (name: string, field: string) =>
  body(field)
    .exists()
    .withMessage(
      prepareMessageFromParams(REQUIRED_ERROR_MESSAGE, [["field_name", name]])
    )
    .isInt()
    .withMessage(
      prepareMessageFromParams(TYPE_INTEGER_ERROR_MESSAGE, [
        ["field_name", name],
      ])
    );

export const fieldDecimalChain = (name: string, field: string) =>
  body(field)
    .exists()
    .withMessage(
      prepareMessageFromParams(REQUIRED_ERROR_MESSAGE, [["field_name", name]])
    )
    .isDecimal()
    .withMessage(
      prepareMessageFromParams(TYPE_DECIMAL_ERROR_MESSAGE, [
        ["field_name", name],
      ])
    );

export const fieldFloatMinMaxChain = (
  name: string,
  field: string,
  min: number,
  max: number
) =>
  body(field)
    .exists()
    .withMessage(
      prepareMessageFromParams(REQUIRED_ERROR_MESSAGE, [["field_name", name]])
    )
    .isFloat({ min, max })
    .withMessage(
      prepareMessageFromParams(TYPE_MIN_MAX_FLOAT_ERROR_MESSAGE, [
        ["field_name", name],
        ["min", min.toString()],
        ["max", max.toString()],
      ])
    );

export const fieldArrayChain = (name: string, field: string) =>
  body(field)
    .exists()
    .withMessage(
      prepareMessageFromParams(REQUIRED_ERROR_MESSAGE, [["field_name", name]])
    )
    .isArray()
    .withMessage(
      prepareMessageFromParams(TYPE_ARRAY_ERROR_MESSAGE, [["field_name", name]])
    );

export const fieldUniqueValueArrayChain = (
  name: string,
  field: string,
  min: number
) =>
  body(field)
    .exists()
    .withMessage(
      prepareMessageFromParams(REQUIRED_ERROR_MESSAGE, [["field_name", name]])
    )
    .isArray({ min })
    .withMessage(
      prepareMessageFromParams(
        min > 0 ? TYPE_ARRAY_NON_EMPTY_ERROR_MESSAGE : TYPE_ARRAY_ERROR_MESSAGE,
        [["field_name", name]]
      )
    )
    .custom((input, meta) => {
      for (const [index, value] of input.entries()) {
        if (input.indexOf(value) !== index) {
          return false;
        }
      }
      return true;
    })
    .withMessage(
      prepareMessageFromParams(DUPLICATE_VALUE_ERROR_MESSAGE, [
        ["field_name", name],
      ])
    );

export const fieldBitChain = (name: string, field: string) =>
  body(field)
    .exists()
    .withMessage(
      prepareMessageFromParams(REQUIRED_ERROR_MESSAGE, [["field_name", name]])
    )
    .isString()
    .withMessage(
      prepareMessageFromParams(TYPE_BIT_ERROR_MESSAGE, [["field_name", name]])
    )
    .isIn(BIT_FIELD_VALUES)
    .withMessage(
      prepareMessageFromParams(TYPE_BIT_ERROR_MESSAGE, [["field_name", name]])
    );
