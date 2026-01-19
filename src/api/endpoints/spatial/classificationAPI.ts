import { axiosClient } from "../../axiosClient";


export interface ClassificationDataPayload {
    class: string;
    time?: string;
    startTime?: string;
    endTime?: string;
    radarID?: number;
    height: number;
    color_0: string;
    color_1: string;
}

export interface ClassificationDataResponse {
    data: {
        png?: string;
        gif?: string;
        bounds: [[number, number], [number, number]]
    },
    legend: {
        class_0: {
            name: string;
            color: string;
        },
        class_1: {
            name: string;
            color: string;
        }
    },
    info: {
        time: string;
        height: string;
        name: string;
        class: string;
    }
}
/**
 * Rest API Client to get classification data 
 * @returns ClassificationDataResponse
 */
export const fetchClassificationData = async (payload: ClassificationDataPayload): Promise<ClassificationDataResponse> => {
    console.log(payload);
    const { data } = await axiosClient.post('/get_bioclass', payload);
    if (data.status !== 0) {
        throw new Error(data.message || 'Failed to fetch classification data', );
    }
    return data.data;
}