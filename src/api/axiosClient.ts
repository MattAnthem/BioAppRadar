import axios from "axios";

export const axiosClient = axios.create({
  baseURL: "", 
  headers: { "Content-Type": "application/json" },
});

export function initAxiosClient(baseURL: string) {
  axiosClient.defaults.baseURL = baseURL;
}