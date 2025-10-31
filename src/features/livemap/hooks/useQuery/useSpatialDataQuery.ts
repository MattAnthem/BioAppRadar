import { useQuery } from "@tanstack/react-query";
import { fetchSpatialData, type SpatialDataResponse, type SpatialDataPayload } from '../../../api/endpoints/spatialDataAPI';

export const useSpatialDataQuery = (payload: SpatialDataPayload) => {
    return useQuery<SpatialDataResponse>({
        queryKey: ["spatial_data", payload],
        queryFn: async () => {
            try{
                return await fetchSpatialData(payload);
            } catch (error) {
                console.error('Failed to fetch VTPI data');
                throw error;
            }
        },
        enabled: !!payload.time,
        refetchOnWindowFocus: false,
    })
}