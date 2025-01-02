import {
  AGEND_NAMESNewFormat,
  countryOptions,
  leadSourceOptionsNewFormat,
  leadStatusNewFormat,
  lostReasonOptionsNewFormat,
  serviceOptionsNewFormat,
} from "../../utils/Constants/UsefullJSON";
import { API } from "../index";
import { END_POINT } from "../UrlProvider";
import { toast } from "react-toastify";

interface GeneralData {
  status: any[];
  sources: any[];
  agents: any[];
  productsServices: any[];
  countries: any[];
}

export const fetchGeneralData = async (): Promise<void> => {
  try {
    const { data, error, message } = await API.getAuthAPI(
      END_POINT.GENERAL_DATA,
      true
    );
    const { data: notificationData } = await API.getAuthAPI(
      "getNotification",
      // END_POINT.GENERAL_DATA,
      true
    );

    if (error) return;

    if (data) {
      const {
        status = [],
        sources = [],
        agents = [],
        productsServices = [],
        leadLoseReason = [],
        countries = [],
      } = data;

      // Store each data array separately in localStorage
      localStorage.setItem("crm_status", JSON.stringify(status));
      localStorage.setItem("crm_sources", JSON.stringify(sources));
      localStorage.setItem("crm_agents", JSON.stringify(agents));
      localStorage.setItem("crm_lostReason", JSON.stringify(leadLoseReason));
      localStorage.setItem(
        "crm_products_services",
        JSON.stringify(productsServices)
      );
      localStorage.setItem("crm_countries", JSON.stringify(countries));

      // Optional: Return success message
      //   toast.success("General data updated successfully");
    }
    if (notificationData) {
      localStorage.setItem(
        "crm_notifictaion",
        JSON.stringify(notificationData)
      );
    }
  } catch (error: any) {
    console.error("Error fetching general data:", error);
  }
};

// Helper functions to get data from localStorage
export const getStoredStatus = (forSelectOptions = false): any[] => {
  try {
    const data = localStorage.getItem("crm_status");
    const parsedData = data ? JSON.parse(data) : leadStatusNewFormat;
    const transformedData = parsedData?.map((item: any) => ({
      value: item._id,
      label: item.name,
    }));
    if (!forSelectOptions) {
      return data ? JSON.parse(data) : [];
    } else {
      return transformedData;
    }
  } catch (error) {
    console.error("Error parsing status data:", error);
    return [];
  }
};

export const getStoredLostReason = (forSelectOptions = false): any[] => {
  try {
    const data = localStorage.getItem("crm_lostReason");
    const parsedData = data ? JSON.parse(data) : lostReasonOptionsNewFormat;
    const transformedData = parsedData?.map((item: any) => ({
      value: item._id,
      label: item.reason,
    }));
    if (!forSelectOptions) {
      return data ? JSON.parse(data) : [];
    } else {
      return transformedData;
    }
  } catch (error) {
    console.error("Error parsing status data:", error);
    return [];
  }
};

export const getStoredSources = (forSelectOptions = false): any[] => {
  try {
    const data = localStorage.getItem("crm_sources");
    const parsedData = data ? JSON.parse(data) : leadSourceOptionsNewFormat;
    const transformedData = parsedData?.map((item: any) => ({
      value: item._id,
      label: item.name,
    }));
    if (!forSelectOptions) {
      return data ? JSON.parse(data) : [];
    } else {
      return transformedData;
    }
  } catch (error) {
    console.error("Error parsing sources data:", error);
    return [];
  }
};

export const getStoredAgents = (forSelectOptions = false): any[] => {
  try {
    const data = localStorage.getItem("crm_agents");
    const parsedData = data ? JSON.parse(data) : AGEND_NAMESNewFormat;
    const transformedData = parsedData?.map((item: any) => ({
      value: item._id,
      label: item.name,
    }));
    if (!forSelectOptions) {
      return data ? JSON.parse(data) : [];
    } else {
      return transformedData;
    }
  } catch (error) {
    console.error("Error parsing agents data:", error);
    toast.error("Error parsing agents data");
    return [];
  }
};

export const getStoredProductsServices = (forSelectOptions = false): any[] => {
  try {
    const data = localStorage.getItem("crm_products_services");
    const parsedData = data ? JSON.parse(data) : serviceOptionsNewFormat;
    const transformedData = parsedData?.map((item: any) => ({
      value: item._id,
      label: item.name,
    }));
    if (!forSelectOptions) {
      return data ? JSON.parse(data) : [];
    } else {
      return transformedData;
    }
  } catch (error) {
    console.error("Error parsing products services data:", error);
    return [];
  }
};

export const getStoredCountries = (forSelectOptions = false): any[] => {
  try {
    const data = localStorage.getItem("crm_countries");
    const parsedData = data ? JSON.parse(data) : countryOptions;
    const transformedData = parsedData?.map((item: any) => ({
      value: item.isoCode,
      label: item.name,
    }));
    if (!forSelectOptions) {
      return data ? JSON.parse(data) : [];
    } else {
      return transformedData;
    }
  } catch (error) {
    console.error("Error parsing countries data:", error);
    return [];
  }
};

export const getStoredNotification = (forSelectOptions = false): any[] => {
  try {
    const data = localStorage.getItem("crm_notifictaion");
    const parsedData = data ? JSON.parse(data) : [];
    return parsedData;
  } catch (error) {
    console.error("Error parsing countries data:", error);
    return [];
  }
};

// Helper function to clear all stored general data
export const clearGeneralData = (): void => {
  localStorage.removeItem("crm_status");
  localStorage.removeItem("crm_sources");
  localStorage.removeItem("crm_agents");
  localStorage.removeItem("crm_products_services");
  localStorage.removeItem("crm_countries");
};
