import { useQuery } from "@tanstack/react-query";
import { fetchSevip, type SevipPayload, type SevipResponse } from "../../../../api/endpoints/spatialDataAPI";

export const useSevipDataQuery = (payload: SevipPayload) => {
    return useQuery<SevipResponse>({
        queryKey: ["sevip_data", payload.time, payload.parameter, payload.colorbar],
        queryFn: async () => {
            try{
                return await fetchSevip(payload);
            } catch (error) {
                console.error('Failed to fetch VTPI data');
                throw error;
            }
        } ,
        enabled: Boolean(payload.parameter && payload.colorbar && payload.time),
        refetchOnWindowFocus: false,
    });
}