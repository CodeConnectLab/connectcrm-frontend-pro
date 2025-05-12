// UrlProvider.d.ts
export interface EndPointType {
  LOGIN: string;
  SIGNUP: string;
  USER_REGISTER: string;
  PRODUCT_SERVICE: string;
  LEAD_SOURCES: string;
  LEAD_STATUS: string;
  LOST_REASON: string;
  GENERAL_DATA: string;
  EMPLOYEE_REPORT: string;
  LEADS_DATA: string;
  LEADS_FOLLOWUP_DATA: string;
  CALL_LIST: string;
  PRODUCT_SALE_REPORT: string;
  CALENDAR: string;
  GET_CURL: string;
  USERS: string;
  BULK_UPDATE: string;
  BULK_DELETE: string;
  UPDATE_NOTIFICATION: string;
  Funnel: string;
  Crefunel: string;
  SubscrPlane: string;
  Faq: string;
  PolicyQ: string;
  PolicyA: string;
  Policyf: string;
  planget: string;
  Notifi: string;
  Notifiborad: string;
  UserapiAl: string;
  Userme: string;
  Userapi: string;
  UserapiA: string;
  UserapiS: string;
  Rsetpas: string;
  Videoapi: string;
  Tages: string;
  Setintags: string;
  UserPost: string;
  Permission: string;
  feature: string;
  GET_BOOKING_DETAILS: string,
  UPDATE_BOOKING: string,
}

export const BASE_URL: string;
export const END_POINT: EndPointType;
