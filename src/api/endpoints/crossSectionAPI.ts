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

export interface CrossSectionBioClassResponse {
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
    };
    info: {
        class: string;
        name: string;
        time: string;
    }
}

export const fetchVCrossBioClass = async (payload: CrossSectionBioClassPayload): Promise<CrossSectionBioClassResponse> => {
    const data = await axiosClient.post('/vcross_section_bioclass', payload);
    if (data.status !== 0) {
        throw new Error('Error fetching VCrossSectionBioClass data');
    }
    return data.data;
}


