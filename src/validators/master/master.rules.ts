import { body, CustomValidator, Meta } from "express-validator";
import { BIT_FIELD_VALUES,BIT_PRODUCT_FIELD_VALUES,BIT_REQUEST_STATUS_VALUES,BIT_REQUEST_TYPE_VALUES } from "../../utils/app-constants";
import { CODE_IS_NON_EMPTY_STRING, CODE_IS_REQUIRED, IS_ACTIVE_EXPECTED_TYPE_STRING, IS_ACTIVE_REQUIRED,IS_STATUS_REQUIRED,
     NAME_IS_NON_EMPTY_STRING, NAME_IS_REQUIRED, NAME_LENGTH_MIN_MAX, RATE_IS_NON_EMPTY_STRING, RATE_IS_REQUIRED,
      SLUG_IS_NON_EMPTY_STRING, SLUG_IS_REQUIRED, SLUG_LENGTH_MIN_MAX, VALUE_IS_NON_EMPTY, VALUE_IS_REQUIRED,
      IS_STATUS_EXPECTED_TYPE_INTEGER,REQUEST_FROM_TYPE_REQUIRED,REQUEST_TO_TYPE_REQUIRED,REQUEST_FROM_TYPE_EXPECTED_TYPE_INTEGER,REQUEST_STATUS_REQUIRED,
      REQUEST_STATUS_EXPECTED_TYPE_INTEGER,REQUEST_TO_TYPE_EXPECTED_TYPE_INTEGER, WISHLIST_REQUIRED, WISHLIST_EXPECTED_TYPE_INTEGER
    } from "../../utils/app-messages";
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

const masterNameChain = (onlyAI: boolean) =>
    body("name")
        .if(validateIf(onlyAI))
        .exists()
        .withMessage(NAME_IS_REQUIRED)
        .isString()
        .withMessage(NAME_IS_NON_EMPTY_STRING)
        .not()
        .isEmpty()
        .withMessage(NAME_IS_NON_EMPTY_STRING)
        .trim();
        const masterSlugChain = (onlyAI: boolean) =>
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
const masterCodeChain = (onlyAI: boolean) =>
    body("code")
        .if(validateIf(onlyAI))
        .exists()
        .withMessage(CODE_IS_REQUIRED)
        .isString()
        .withMessage(CODE_IS_NON_EMPTY_STRING)
        .not()
        .isEmpty()
        .withMessage(CODE_IS_NON_EMPTY_STRING)
        .trim();

const masterRateChain = (onlyAI: boolean) =>
    body("rate")
        .if(validateIf(onlyAI))
        .exists()
        .withMessage(RATE_IS_REQUIRED)
        // .isInt()
        // .withMessage(RATE_IS_NON_EMPTY_STRING)
        .not()
        .isEmpty()
        .withMessage(RATE_IS_NON_EMPTY_STRING)
        .trim();

        const masterValueChain = (onlyAI: boolean) =>
        body("value")
            .if(validateIf(onlyAI))
            .exists()
            .withMessage(VALUE_IS_REQUIRED)
            // .isInt()
            // .withMessage(RATE_IS_NON_EMPTY_STRING)
            .not()
            .isEmpty()
            .withMessage(VALUE_IS_NON_EMPTY)
            .trim();
const masterIsActiveChain = body("is_active")
    .exists()
    .withMessage(IS_ACTIVE_REQUIRED)
    .isString()
    .withMessage(IS_ACTIVE_EXPECTED_TYPE_STRING)
    .isIn(BIT_FIELD_VALUES)
    .withMessage(IS_ACTIVE_EXPECTED_TYPE_STRING);
    
    const masterWishlistChain = body("wish_list")
    .exists()
    .withMessage(WISHLIST_REQUIRED)
    .isString()
    .withMessage(WISHLIST_EXPECTED_TYPE_INTEGER)
    .isIn(BIT_FIELD_VALUES)
    .withMessage(WISHLIST_EXPECTED_TYPE_INTEGER);


    const masterIsStatusChain = body("is_status")
    .exists()
    .withMessage(IS_STATUS_REQUIRED)
    .isInt()
    .withMessage(IS_STATUS_EXPECTED_TYPE_INTEGER)
    .isIn(BIT_PRODUCT_FIELD_VALUES)
    .withMessage(IS_STATUS_EXPECTED_TYPE_INTEGER);

    // .withMessage(IS_STATUS_EXPECTED_TYPE_INTEGER);


    const masterRequestFromTypeChain = body("request_from_type")
    .exists()
    .withMessage(REQUEST_FROM_TYPE_REQUIRED)
    .isInt()
    .withMessage(REQUEST_FROM_TYPE_EXPECTED_TYPE_INTEGER)
    .isIn(BIT_REQUEST_TYPE_VALUES)
    .withMessage(REQUEST_FROM_TYPE_EXPECTED_TYPE_INTEGER);


    const masterRequestToTypeChain = body("request_to_type")
    .exists()
    .withMessage(REQUEST_TO_TYPE_REQUIRED)
    .isInt()
    .withMessage(REQUEST_TO_TYPE_EXPECTED_TYPE_INTEGER)
    .isIn(BIT_REQUEST_TYPE_VALUES)
    .withMessage(REQUEST_TO_TYPE_EXPECTED_TYPE_INTEGER);


    const masterRequestStatusChain = body("request_status")
    .exists()
    .withMessage(REQUEST_STATUS_REQUIRED)
    .isInt()
    .withMessage(REQUEST_STATUS_EXPECTED_TYPE_INTEGER)
    .isIn(BIT_REQUEST_STATUS_VALUES)
    .withMessage(REQUEST_STATUS_EXPECTED_TYPE_INTEGER);

    // .withMessage(IS_STATUS_EXPECTED_TYPE_INTEGER);


export const addMasterValidationRule = [
    fieldStringMinMaxChain('name', "name", 1, 100),
    fieldStringMinMaxChain('code', 'code', 1, 100)
];


export const updateMasterValidationRule = [
    fieldIntegerChain("id", "id"),
    fieldStringMinMaxChain('name', "name", 1, 100),
    fieldStringMinMaxChain('code', 'code', 1, 100)
];


export const deletedMasterValidationRule = [
    fieldIntegerChain("id", "id")
];

export const removeMasterValidationRule = [
    fieldIntegerChain("id", "id")
];

export const statusUpdateMasterValidationRule = [
    masterIsActiveChain,
];

export const wishlistUpdateMasterValidationRule = [
    masterWishlistChain,
];

export const statusRequestUpdateMasterValidationRule = [
    masterRequestStatusChain,
];

export const statusProductUpdateMasterValidationRule = [
    masterIsStatusChain,
];

export const requestFromTypeMasterValidationRule = [
    masterRequestFromTypeChain,
];

export const requestToTypeMasterValidationRule = [
    masterRequestToTypeChain,
];

export const requestStatusMasterValidationRule = [
    masterRequestStatusChain,
];

export const addMasterCurrencyValidationRule = [
    masterNameChain(false),
    masterRateChain(false)
];

export const updateMasterCurrencyValidationRule = [
    masterNameChain(true),
    masterRateChain(true)
];

export const addMasterNameSlugValidationRule = [
    masterNameChain(false),
    masterSlugChain(false)
];

export const updateMasterNameSlugValidationRule = [
    masterNameChain(true),
    masterSlugChain(true)
];

export const addMasterValueValidationRule = [
    masterValueChain(false),
    masterSlugChain(false)
];

export const updateMasterValueValidationRule = [
    masterValueChain(true),
    masterSlugChain(true)
];

export const addTagRule = [
    masterNameChain(false),
]

export const updateTagRule = [
    masterNameChain(false),
    fieldIntegerChain("Id", "id"),
]

export const deleteMasterIdRule = [
    fieldIntegerChain("Id", "id"),
]

export const statusTagRule = [
    fieldIntegerChain("Id", "id"),
    masterIsActiveChain
]

export const wishlistTagRule = [
    fieldIntegerChain("Id", "id"),
    masterWishlistChain
]

export const statusProductTagRule = [
    fieldIntegerChain("Id", "id"),
    masterIsStatusChain
]

export const requestTypeTagRule = [
    fieldIntegerChain("Id", "id"),
    masterRequestToTypeChain,masterRequestFromTypeChain

]

export const requestStatusTagRule = [
    fieldIntegerChain("Id", "id"),
    masterRequestStatusChain
]

export const addConnectsValueValidationRule = [
    fieldIntegerChain("request_from", "request_from"),
    fieldIntegerChain("request_to", "request_to"),
    // masterRequestToTypeChain,masterRequestFromTypeChain
    // masterRequestStatusChain
]

export const addMasterValueSortCodeRule = [
    fieldStringMinMaxChain("value", "value", 1, 80),
    fieldStringMinMaxChain("sort code", "sort_code", 1, 80)
]

export const updateMasterValueSortCodeRule = [
    fieldIntegerChain("Id", "id"),
    fieldStringMinMaxChain("value", "value", 1, 80),
    fieldStringMinMaxChain("sort code", "sort_code", 1, 80)
]
