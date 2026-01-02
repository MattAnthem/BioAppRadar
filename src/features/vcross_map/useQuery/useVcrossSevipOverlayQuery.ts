import { useQuery } from "@tanstack/react-query";
import { fetchSevip, type SevipPayload, type SpatialDataResponse } from "../../../api/endpoints/spatial/spatialDataAPI";

export const useSevipVcrossDataQuery = (payload: SevipPayload, enabled?: boolean) => {
    return useQuery<SpatialDataResponse>({
        queryKey: ["sevip_vcross_data", payload.parameter, payload.colorbar, payload.time],
        queryFn: async () => {
            try{
                return await fetchSevip(payload);
            } catch (error) {
                console.error('Failed to QUERY vcross SEVIP data', error);
                throw error;
            }
        } ,
        enabled: Boolean(payload.parameter && payload.colorbar && payload.time) && (enabled ?? true),
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 30,  
    });
}