import axiosClient from "../axiosClient";

export interface VpPayload {
    parameter: string;
    time: string;
}

export interface VptsPayload {
    parameter: string;
    startTime: string;
    endTime: string;
}

export type VtipPayload = VptsPayload;

export interface VtipResponse {
    name: string;
    units: string;
    height: number[];
    times: string[];
    parameter: number[];
    ff: number[];
    dd: number[];
    day: boolean[];
    sunrise: string[];
    sunset: string[];
}

export interface VpResponse {
    name: string;
    parameter: (null | number)[];
    sunrise: string;
    sunset: string;
    time: string;
    units: string;
    day: boolean;
    dd: (null | number)[];
    ff: (null | number)[];
    height: number[]
}

export interface VptsResponse {
    name: string;
    parameter: (number | null)[][];
    sunrise: string[];
    sunset: string[];
    times: string[];
    units: string;
    day: boolean[];
    dd: (null | number)[];
    ff: (null | number)[];
    height: number[]
}

export const fetchVP = async (payload: VpPayload): Promise<VpResponse> => {
    const {data} = await axiosClient.post('/get_vp', payload);
    return data;
}

export const fetchVPTS = async (payload: VptsPayload): Promise<VptsResponse> => {
    const {data} = await axiosClient.post('/get_vpts', payload);
    console.log(data)
    return data;
}

export const fetchVTIP = async (payload: VtipPayload): Promise<VtipResponse> => {
    const {data} = await axiosClient.post('/get_vpi', payload);
    return data;
}

