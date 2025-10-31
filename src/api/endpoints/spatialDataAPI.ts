import { axiosClient } from "../axiosClient";


export interface SpatialDataPayload {
    type: string;
    map: string;
    height?: number;
    time: string;
}

export interface CrossSectionPayload {
    type: string;
    map: string;
    time: string;
    startLon: number;
    startLat: number;
    endLon: number;
    endLat: number;
}

export interface CrossSectionResponse {
    name: string;
    units: string;
    time: string;
    height: string[];
    lat: number[];
    lon: number[];
    parameter: (number | null)[][];
    startLon: number;
    startLat: number;
    endLon: number;
    endLat: number;
}

export interface SpatialDataHistoryPayload {
    type: 'map' | 'gif';
    height: number;
    time: string;
    endTime?: string;
}

export interface SpatialDataResponse {
    height: number;
    time: string;
    name: string;
    units: string;
    data: string;      
    bounds: number[];
    dd: number[][];
    ff: number[][];
    lon: number[];
    lat: number[];
}

export const fetchSpatialData = async (payload: SpatialDataPayload): Promise<SpatialDataResponse> => {
    const { data } = await axiosClient.post('/get_spatial_data', payload);
    return data;
}

export const fetchCrossSectionData = async (payload: CrossSectionPayload): Promise<CrossSectionResponse> => {
    const { data } = await axiosClient.post('/get_cross_section', payload);
    return data;
}