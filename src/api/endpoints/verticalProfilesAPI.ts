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

export interface VpResponse {
    name: string;
    parameter: string;
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
    parameter: (number | null)[];
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
    return data;
}

