import { axiosClient } from "../../axiosClient";


export interface SpatialDataPayload {
    type: string;
    map: string;
    height?: number;
    time: string;
}

export interface RadarPolarPayload {
    type: 'polar';
    parameter: string;
    time?: string;
    startTime?: string;
    endTime?: string;
    elevation_angle: number;
    colorbar: string;
}
export interface RadarGridPayload {
    type: 'grid';
    parameter: string;
    time?: string;
    startTime?: string;
    endTime?: string;
    height: number;
    colorbar: string;
}


export type RadarPayload = RadarPolarPayload | RadarGridPayload;

export const isRadarPolarPayload = (p: RadarPayload): p is RadarPolarPayload => p.type === "polar";

export const isRadarGridPayload = (p: RadarPayload): p is RadarGridPayload => p.type === "grid";

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


export interface SevipPayload {
    parameter: string;
    time?: string;
    startTime?: string;
    endTime?: string;
    colorbar: string;
}

export interface SpatialDataResponse {
    data: {
        png?: Base64URLString; 
        gif?:Base64URLString; 
        bounds: [[number, number], [number, number]]
    };
    ckeys: {
        labels: string[]; 
        colors: string[]; 
        png: string
    };
    info: {
        time: string; 
        name: string; 
        height?: string;
        elevation_angle?: string; 
        units: string; 
        type?: string
    }
}




export const fetchRadarData = async (payload: RadarPayload): Promise<SpatialDataResponse> => {
    const payloadT = payload.type === "polar"
        ? {
            type: payload.type,
            parameter: payload.parameter,
            time: payload.time,
            colorbar: payload.colorbar,
            elevation_angle: payload.elevation_angle,
          }
        : {
            type: payload.type,
            parameter: payload.parameter,
            time: payload.time,
            colorbar: payload.colorbar,
            height: payload.height,
          };
    const { data } = await axiosClient.post("/get_radar", payloadT);
    if (data.status !== 0) throw new Error("Error fetching Radar data");
    return data.data;
  };
  
  

export const fetchSevip = async (payload: SevipPayload): Promise<SpatialDataResponse> => {
    const { data } = await axiosClient.post('/get_sevip', payload);
    if (data.status !== 0) {
        throw new Error('Error fetching SEVIP data');
    } 
    return data.data;
}


export const fetchElevationAngles = async (): Promise<number[]> => {
    const { data } = await axiosClient.get('/elevation_angles', {});
    if (data.status !== 0) {
        throw new Error('Error fetching Elevation angles')
    }
    return data.data;
}


export const fetchCrossSectionData = async (payload: CrossSectionPayload): Promise<CrossSectionResponse> => {
    const { data } = await axiosClient.post('/get_cross_section', payload);
    if (data.status !== 0) {
        throw new Error('Error fetching Cross section data');
    } 
    return data.data;
}