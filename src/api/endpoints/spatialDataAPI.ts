import { axiosClient } from "../axiosClient";

export interface ApiResponse<T> {
    status: number,
    data: T
}

export interface SpatialDataPayload {
    type: string;
    map: string;
    height?: number;
    time: string;
}

export interface RadarPayload {
    type: string;
    parameter: string;
    time: string;
    height?: number;
    elevation_angle?: number;
    colorbar: string;
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

export interface SevipPayload {
    parameter: string;
    time: string;
    colorbar: string;
}

export interface SpatialDataResponse {
    data: {png: string; bounds: [[number, number], [number, number]]};
    ckeys: {labels: string[]; colors: string[]; png: string};
    info: {time: string; name: string; height?: string, elevation_angle?: string; units: string;}
}

export const fetchSevip = async (payload: SevipPayload): Promise<SpatialDataResponse> => {
    const { data } = await axiosClient.post('/get_sevip', payload);
    if (data.status !== 0) {
        throw new Error('Error fetching SEVIP data');
    } 
    console.log("response: ", data.data)
    return data.data;
}

export const fetchRadarData = async (payload: RadarPayload): Promise<SpatialDataResponse> => {
    const { data } = await axiosClient.post('/get_radar', payload);
    if (data.status !== 0) {
        throw new Error('Error fetching Radar data');
    }
    return data;
}



export const fetchCrossSectionData = async (payload: CrossSectionPayload): Promise<CrossSectionResponse> => {
    const { data } = await axiosClient.post('/get_cross_section', payload);
    if (data.status !== 0) {
        throw new Error('Error fetching Cross section data');
    } 
    return data.data;
}