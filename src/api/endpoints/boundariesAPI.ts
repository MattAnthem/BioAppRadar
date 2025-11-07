import { axiosClient } from "../axiosClient";

export interface BoundaryPayload {
    type: string;
    json: object;
}

export const fetchBoundaryData = async (payload: BoundaryPayload): Promise<GeoJSON.Feature> => {
    const { data } = await axiosClient.post('/data_geojson', payload);
    if (data.status !== 0) {
        throw new Error(data.message || 'Failed to fetch boundary data');
    }
    return data.data;
} 