import { axiosClient } from "../../axiosClient";


export interface BoundaryPayload {
    type: string;
    json: string;
}

export const fetchBoundaryData = async (payload: BoundaryPayload): Promise<GeoJSON.FeatureCollection> => {
    const { data } = await axiosClient.post('/data_geojson', payload);
    if (data.status !== 0) {
        throw new Error(data.message || 'Failed to fetch boundary data');
    }
    const res = JSON.parse(data.data) as GeoJSON.FeatureCollection;
    console.log(res)
    return res;
} 