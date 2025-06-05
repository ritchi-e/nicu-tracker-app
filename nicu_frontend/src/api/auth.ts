import axios from "axios";
import type { Patient, Entry } from "./types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

//  Request Interceptor: Set token every time
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//  Response Interceptor: Refresh if expired
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (
      err.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refresh")
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh");
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/token/refresh/`,
          { refresh: refreshToken }
        );

        const newAccess = response.data.access;
        localStorage.setItem("access", newAccess);

        // Retry with new access token
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
      }
    }

    return Promise.reject(err);
  }
);

//  Export patient/entry API methods
export const getPatients = () => api.get<Patient[]>("/patients/");
export const createPatient = (data: Patient) => api.post<Patient>("/patients/", data);
export const getPatientById = (id: string) => api.get<Patient>(`/patients/${id}/`);
export const deletePatient = (id: string) => api.delete(`/patients/${id}/`);

export const createEntry = (data: Entry) => api.post<Entry>("/entries/", data);
export const getEntries = () => api.get<Entry[]>("/entries/");
