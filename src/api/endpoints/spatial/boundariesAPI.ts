import { axiosClient } from "../../axiosClient";


export interface BoundaryPayload {
    type: string;
    json: string;
}

/**
 * Rest API Client to get specific GeoJson data 
 * @param type - Boundary type (e.g: administrative/special zones)
 * @param json - The GeoJson to be returned (country, province, airports ...)
 * @returns GeoJSON.FeatureCollection
 */
export const fetchBoundaryData = async (payload: BoundaryPayload): Promise<GeoJSON.FeatureCollection> => {
    const { data } = await axiosClient.post('/data_geojson', payload);
    if (data.status !== 0) {
        throw new Error(data.message || 'Failed to fetch boundary data', data?.message);
    }
    const res = JSON.parse(data.data) as GeoJSON.FeatureCollection;
    return res;
} 