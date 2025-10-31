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


export interface SevipPayload {
    parameter: string;
    time: string;
    colorbar: string;
}

export interface SevipResponse {
    data: {png: string; bounds: [[number, number], [number, number]]};
    ckeys: {labels: string[]; colors: string[]; png: string};
    info: {time: string; name: string; units: string;}
}

export const fetchSevip = async (payload: SevipPayload): Promise<SevipResponse> => {
    const { data } = await axiosClient.post('/get_sevip', payload);
    if (data.status !== 0) {
        throw new Error('Error fetching data')
    } 
    return data.data;
}
export const fetchSpatialData = async (payload: SpatialDataPayload): Promise<SpatialDataResponse> => {
    const { data } = await axiosClient.post('/get_spatial_data', payload);
    if (data.status !== 0) {
        throw new Error('Error fetching data')
    } 
    return data.data;
}

export const fetchCrossSectionData = async (payload: CrossSectionPayload): Promise<CrossSectionResponse> => {
    const { data } = await axiosClient.post('/get_cross_section', payload);
    if (data.status !== 0) {
        throw new Error('Error fetching data')
    } 
    return data.data;
}