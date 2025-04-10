// api.ts
import axios, { AxiosError } from "axios";
import { NavigateFunction } from "react-router-dom";
import { BASE_URL } from "./UrlProvider";
import { LocalStorage } from "../utils/localStorage";
import { toast } from "react-toastify";
import { ApiResponse, ApiConfig, ApiMethods } from "../types/api";
import { getAuthHeader } from "../utils/TokenVerify";
import { handleApiError } from "../utils/handleApiError";

export const getAuthAPI = async <T>(
  endPoint: string,
  tokenRequired: boolean = false,
  // Token: string = "",
  // navigate?: NavigateFunction,
  params: Record<string, any> = {}
): Promise<ApiResponse<T>> => {
  const header = tokenRequired ? await getAuthHeader() : "";
  const config: ApiConfig = {
    method: "get",
    url: `${BASE_URL}${endPoint}`,
    headers: {
      "Content-Type": "application/json",
      timeout: 10000,
      Authorization: header,
    },
    params,
  };

  try {
    const response = await axios.request<T>(config);
    const { data, message, error, options }: any = response?.data;
    return { data, message, error, options };
  } catch (error) {
    return handleApiError(error);
  }
};

export const postAuthAPI = async <T>(
  body: any,
  endPoint: string,
  tokenRequired: boolean = false
  //   navigate: NavigateFunction | null = null
): Promise<ApiResponse<T>> => {
  const header = tokenRequired ? await getAuthHeader() : "";
  const config: ApiConfig = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${BASE_URL}${endPoint}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: header,
    },
    data: JSON.stringify(body),
  };

  try {
    const response = await axios.request<T>(config);
    const { data, message, error }: any = response?.data;
    return { data, message, error };
  } catch (error) {
    return handleApiError(error);
  }
};

export const postAuthAPI1 = async <T>(
  body: any,
  endPoint: string,
  Token: string = "",
  navigate: NavigateFunction | null = null,
  isFormData: boolean = false,
  config: any = {}
): Promise<ApiResponse<T>> => {
  try {
    const response = await axios({
      method: "post",
      url: `${BASE_URL}${endPoint}`,
      data: body,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        Authorization: Token,
        ...config.headers,
      },
    });

    const { data, message, error } = response?.data;
    return { data, message, error };
  } catch (error) {
    return handleApiError(error);
  }
};

export const DeleteAuthAPI = async <T>(
  id: string | number,
  endPoint: string,
  tokenRequired: boolean = false,
  body?: any,
  idInUrl: boolean = true
  // Token: string = "",
  // navigate?: NavigateFunction
): Promise<ApiResponse<T>> => {
  const header = tokenRequired ? await getAuthHeader() : "";
  const config: ApiConfig = {
    method: "delete",
    maxBodyLength: Infinity,
    url: idInUrl ? `${BASE_URL}${endPoint}/${id}` : `${BASE_URL}${endPoint}`,
    headers: {
      Authorization: header,
    },
    data: body,
  };

  try {
    const response = await axios.request<T>(config);
    const { data, message, error }: any = response?.data;
    return { data, message, error };
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateAuthAPI = async <T>(
  body: any,
  id: string | number | null,
  endPoint: string,
  tokenRequired: boolean = false
  // Token: string = "",
  // navigate?: NavigateFunction
): Promise<ApiResponse<T>> => {
  const header = tokenRequired ? await getAuthHeader() : "";
  const config: ApiConfig = {
    method: "put",
    maxBodyLength: Infinity,
    url:
      id !== null ? `${BASE_URL}${endPoint}/${id}` : `${BASE_URL}${endPoint}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: header,
    },
    data: JSON.stringify(body),
  };

  try {
    const response = await axios.request<T>(config);
    const { data, message, error }: any = response?.data;
    return { data, message, error };
  } catch (error) {
    return handleApiError(error);
  }
};

export const PutAuthAPI = async <T>(
  body: any | null,
  id: string | null,
  endPoint: string,
  tokenRequired: boolean = false
  // navigate?: NavigateFunction
): Promise<ApiResponse<T>> => {
  const header = tokenRequired ? await getAuthHeader() : "";
  const config: ApiConfig = {
    method: "put",
    maxBodyLength: Infinity,
    url: `${BASE_URL}${endPoint}${id ? "/" + id : ""}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: header,
    },
  };

  if (body !== null) {
    config.data = JSON.stringify(body);
  }

  try {
    const response = await axios.request<T>(config);
    const { data, message, error }: any = response?.data;
    return { data, message, error };
  } catch (error) {
    return handleApiError(error);
  }
};

export const networkErrorAlert = (callback: () => void) => {
  // Implementation here if needed
};

export const API: ApiMethods = {
  getAuthAPI,
  postAuthAPI,
  postAuthAPI1,
  DeleteAuthAPI,
  updateAuthAPI,
  PutAuthAPI,
};
