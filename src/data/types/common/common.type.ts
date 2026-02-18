import { TResponseReturn } from "../../interfaces/common/common.interface";

export type TUserType = 1 | 2;

export type TResponse = (payload?: {
  code?: number;
  status?: string;
  message?: string;
  data?: any;
}) => TResponseReturn;

export type TImageType =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  ;

export type TFileBulkUploadType =
 |1
 ;

export type TBitFieldValue = "0" | "1";

export type TAttributeType =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13;
