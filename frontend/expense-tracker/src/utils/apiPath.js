// src/utils/apiPath.js

export const API_PATHS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },

  INCOME: {
    ADD: "/income/add",
    GET_ALL: "/income/get",
    DELETE: (id) => `/income/${id}`,
    DOWNLOAD_CSV: "/income/downloadcsv",
  },

  EXPENSE: {
    ADD: "/expense/add",
    GET_ALL: "/expense/get",
    DELETE: (id) => `/expense/${id}`,
    DOWNLOAD_CSV: "/expense/downloadcsv",
  },

  DASHBOARD: {
    GET_DATA: "/dashboard",
  },
};