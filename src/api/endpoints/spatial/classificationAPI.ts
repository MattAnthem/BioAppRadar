import { axiosClient } from "../../axiosClient";


export interface ClassificationDataPayload {
    class: string;
    time: string;
    height: number;
    color_0: string;
    color_1: string;
}

export interface ClassificationDataResponse {
    data: {
        png: string
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

export const fetchClassificationData = async (payload: ClassificationDataPayload): Promise<ClassificationDataResponse> => {
    const { data } = await axiosClient.post('/get_bioclass', payload);
    if (data.status !== 0) {
        throw new Error(data.message || 'Failed to fetch classification data');
    }
    return data.data;
}