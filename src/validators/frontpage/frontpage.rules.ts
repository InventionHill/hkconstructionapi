import { body, CustomValidator, Meta } from "express-validator";
import { BIT_FIELD_VALUES } from "../../utils/app-constants";
import { LINK_IS_NON_EMPTY_STRING, LINK_IS_REQUIRED, IS_ACTIVE_EXPECTED_TYPE_STRING, IS_ACTIVE_REQUIRED, TITLE_IS_NON_EMPTY_STRING, TITLE_IS_REQUIRED,
     CATEGORY_IS_NON_EMPTY_STRING, CATEGORY_IS_REQUIRED, SLUG_IS_NON_EMPTY_STRING, SLUG_IS_REQUIRED, SLUG_LENGTH_MIN_MAX, LONGCONTENT_IS_NON_EMPTY_STRING,
     LONGCONTENT_IS_REQUIRED } from "../../utils/app-messages";
import { fieldIntegerChain, fieldStringMinMaxChain } from "../common-validation-rules";
import { NAME_LENGTH_MAX, NAME_LENGTH_MIN } from "../validation.constant";

const checkOnlyAI = (onlyAI: boolean, req: Meta["req"]) => {
    if (onlyAI) {
        return !Object.keys(req.body).includes("only_active_inactive");
    }
    return true;
};

const validateIf =
    (onlyAI: boolean): CustomValidator =>
        (input, { req }) =>
            checkOnlyAI(onlyAI, req);

const frontpageTitleChain = (onlyAI: boolean) =>
    body("title")
        .if(validateIf(onlyAI))
        .exists()
        .withMessage(TITLE_IS_REQUIRED)
        .isString()
        .withMessage(TITLE_IS_NON_EMPTY_STRING)
        .not()
        .isEmpty()
        .withMessage(TITLE_IS_NON_EMPTY_STRING)
        .trim();
        const frontpageSlugChain = (onlyAI: boolean) =>
        body("slug")
            .if(validateIf(onlyAI))
            .exists()
            .withMessage(SLUG_IS_REQUIRED)
            .isString()
            .withMessage(SLUG_IS_NON_EMPTY_STRING)
            .not()
            .isEmpty()
            .withMessage(SLUG_IS_NON_EMPTY_STRING)
            .trim();
const frontpageLinkChain = (onlyAI: boolean) =>
    body("link")
        .if(validateIf(onlyAI))
        .exists()
        .withMessage(LINK_IS_REQUIRED)
        .isString()
        .withMessage(LINK_IS_NON_EMPTY_STRING)
        .not()
        .isEmpty()
        .withMessage(LINK_IS_NON_EMPTY_STRING)
        .trim();

        
        const frontpageSortContentChain = (onlyAI: boolean) =>
        body("category")
        .if(validateIf(onlyAI))
        .exists()
        .withMessage(CATEGORY_IS_REQUIRED)
        .isInt()
        .withMessage(CATEGORY_IS_NON_EMPTY_STRING)
        .not()
        .isEmpty()
        .withMessage(CATEGORY_IS_NON_EMPTY_STRING)
        .trim();
const frontpageCategoryChain = (onlyAI: boolean) =>
    body("category")
        .if(validateIf(onlyAI))
        .exists()
        .withMessage(CATEGORY_IS_REQUIRED)
        .isInt()
        .withMessage(CATEGORY_IS_NON_EMPTY_STRING)
        .not()
        .isEmpty()
        .withMessage(CATEGORY_IS_NON_EMPTY_STRING)
        .trim();

        const frontpageLongContentChain = (onlyAI: boolean) =>
        body("long content")
            .if(validateIf(onlyAI))
            .exists()
            .withMessage(LONGCONTENT_IS_REQUIRED)
            .isInt()
            .withMessage(LONGCONTENT_IS_NON_EMPTY_STRING)
            .not()
            .isEmpty()
            .withMessage(LONGCONTENT_IS_NON_EMPTY_STRING)
            .trim();
const masterIsActiveChain = body("is_active")
    .exists()
    .withMessage(IS_ACTIVE_REQUIRED)
    .isString()
    .withMessage(IS_ACTIVE_EXPECTED_TYPE_STRING)
    .isIn(BIT_FIELD_VALUES)
    .withMessage(IS_ACTIVE_EXPECTED_TYPE_STRING);


export const addBannerValidationRule = [
    fieldStringMinMaxChain('content', "content", 1, 100),
    fieldStringMinMaxChain('link', 'link', 1, 100)
];

export const addBlogValidationRule = [
    fieldStringMinMaxChain('category_id', "category_id", 1, 100),
    fieldStringMinMaxChain('title', 'title', 1, 100),
    fieldStringMinMaxChain('author', "author", 1, 100),
    fieldStringMinMaxChain('sort_description', 'sort_description', 1, 100),
    fieldStringMinMaxChain('long_description', 'long_description', 1, 100),
];

export const addNewsCategoryValidationRule = [
    fieldStringMinMaxChain('name', "name", 1, 100),
];

export const addStatisticInfoValidationRule = [
    fieldStringMinMaxChain('title', "title", 1, 100),
    fieldStringMinMaxChain('counts', "counts", 1, 100),
];

export const addFacilityValidationRule = [
    fieldStringMinMaxChain('title', "title", 1, 100),
    fieldStringMinMaxChain('description', "description", 1, 100),
];

///////////////////// update //////////////////////////
export const updatebannerValidationRule = [
    fieldIntegerChain("id", "id"),
    fieldStringMinMaxChain('content', "content", 1, 100),
    fieldStringMinMaxChain('link', 'link', 1, 100)
];

export const updateBlogValidationRule = [
    fieldIntegerChain("id", "id"),
    fieldStringMinMaxChain('category_id', "category_id", 1, 100),
    fieldStringMinMaxChain('title', 'title', 1, 100),
    fieldStringMinMaxChain('author', "author", 1, 100),
    fieldStringMinMaxChain('sort_description', 'sort_description', 1, 100),
    fieldStringMinMaxChain('long_description', 'long_description', 1, 100),
];

export const updateNewsCategoryValidationRule = [
    fieldIntegerChain("id", "id"),
    fieldStringMinMaxChain('category', "category", 1, 100),
];

export const updateStatisticInfoValidationRule = [
    fieldIntegerChain("id", "id"),
    fieldStringMinMaxChain('title', "title", 1, 100),
    fieldStringMinMaxChain('counts', "counts", 1, 100),
];

export const updateRetailersValidationRule = [
    fieldIntegerChain("id", "id"),
];

export const updateFacilityValidationRule = [
    fieldIntegerChain("id", "id"),
    fieldStringMinMaxChain('title', "title", 1, 100),
    fieldStringMinMaxChain('description', "description", 1, 100),
];

////////////////// delete status ////////////////
export const deletedFrontPageValidationRule = [
    fieldIntegerChain("id", "id")
];

export const statusUpdateFrontValidationRule = [
    masterIsActiveChain,
];
