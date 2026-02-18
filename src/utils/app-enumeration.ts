export enum USER_TYPE {
  Administrator = 1,
  BusinessUser = 2,
  Customer = 3,
  Guest = 4,
  Company = 7,
  Broker = 8
}

export enum CareerStatus{
  Pending = 0,
  Completed = 2,
  Rejected = 1
}

export enum USER_STATUS {
  PendingVerification = 0,
  PendingApproval = 1,
  Approved = 2,
  Blocked = 3,
  PendingReverification = 4,
}
export enum CUSTOMER_USER_STATUS{
  PendingVerification = 0,
  OTP_Varified = 1,
  Approved = 2,
  Rejected = 3,
  In_Review = 4
}
export enum KYC_STATUS{
  In_Review = 1,
  Approved = 2,
  Rejected = 3,
}
export enum USER_DOCUMENTS{
  Company = 2,
  Broker = 1
}
export enum BANNER_TYPE {
  banner = 1,
  marketing_banner = 2,
  features_sections = 3,
  marketing_popup = 4
}


export enum IMAGE_TYPE {
  profile = 1,
  Project= 2,
  Banner= 3,
  Blog= 4,
  Builder=5
}
export enum FILE_TYPE{
  document = 1
}
export enum PRODUCT_IMAGE_TYPE {
  Feature = 1,
  Image = 2,
  IV = 3,
  Video = 4
}

export enum PRODUCT_VIDEO_TYPE {
  Feature = 1,
}

export enum GIFT_PRODUCT_IMAGE_TYPE {
  Thumb = 1,
  Featured = 2
}

export enum HTTP_METHODS {
  Get = 1,
  Post = 2,
  Put = 3,
  Delete = 4,
}

export enum DATE_FORMAT_TYPE {
  display_format = 1,
  "YYYYMMDD" = 2,
  log_file_name_format = 3,
}

export enum MESSAGE_TYPE {
  Credential = 1,
  Otp = 2,
  Registration = 3,
  NewOrder = 4
}

export enum ActiveStatus {
  Active = '1',
  InActive = '0',
}

export enum WishlistStatus {
  Like = '1',
  UnLike = '0',
}

export enum ProductStatus {
  Open = 0,
  OnHold   = 1,
  Close = 2,
}

export enum Solitaire 
{
  Solitaire = 1,
  NonSolitaire = 2
}

export enum Attribute 
{
  Shape = 1,
  Color = 2
}

export enum DeletedStaus {
  Deleted = '1',
  InDeleted = '0',
}

export enum FILE_STATUS {
  Uploaded = 1,
  ProcessedSuccess = 2,
  ProcessedError = 3,
}

export enum FILE_BULK_UPLOAD_TYPE {
  ProductUpload = 1,
  ProductZipUpload = 3,
  DiamondGroupUpload = 2,
  ConfigProductUpload = 4
}
