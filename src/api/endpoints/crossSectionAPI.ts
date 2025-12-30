import { axiosClient } from "../axiosClient";

export interface CrossSectionBioClassPayload {
    class: string;
    time: string;
    startLon: number;
    startLat: number;
    endLon: number;
    endLat: number;
    segment: boolean;
}

export interface CrossSectionRadarPayload {
    type: string;
    parameter: string;
    time: string;
    startLon: number;
    startLat: number;
    endLon: number;
    endLat: number;
    segment: boolean;
}

export interface CrossSectionResponse {
    end_point: {
        lat: number;
        lon: number;
    };
    start_point: {
        lat: number;
        lon: number;
    };
    vcross:(number | null)[][]; 
    xaxis: {
        label: string;
        values: number[];
    };
    yaxis: {
        label: string;
        values: number[];
    }
}

export interface CrossSectionRadarResponse extends CrossSectionResponse {
    info: {
        name: string;
        time: string;
        type: string;
        units: string;
    }
}

export interface CrossSectionBioClassResponse extends CrossSectionResponse {
    info: {
        class: string;
        name: string;
        time: string;
    }
}




export const fetchVcrossRadar = async (payload: CrossSectionRadarPayload): Promise<CrossSectionRadarResponse> => {
    const { data } = await axiosClient.post('/vcross_section_radar', payload);
    if (data.status !== 0) {
        throw new Error('Error fetching VCrossSectionRadar data');
    }
    return data.data;
}

export const fetchVCrossBioClass = async (payload: CrossSectionBioClassPayload): Promise<CrossSectionBioClassResponse> => {
    const { data } = await axiosClient.post('/vcross_section_bioclass', payload);

    if (data.status !== 0) {
        throw new Error('Error fetching VCrossSectionBioClass data ERROR message: ', data.message);
    }
    return data.data;
}


