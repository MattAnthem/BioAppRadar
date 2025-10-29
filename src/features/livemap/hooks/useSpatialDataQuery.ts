import { useQuery } from "@tanstack/react-query";
import { fetchSpatialData, type SpatialDataResponse, type SpatialDataPayload } from '../../../api/endpoints/spatialDataAPI';

export const useSpatialDataQuery = (payload: SpatialDataPayload) => {
    return useQuery<SpatialDataResponse>({
        queryKey: ["spatial_data", payload],
        queryFn: () => fetchSpatialData(payload),
        enabled: !!payload.time
    })
}