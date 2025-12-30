import { useQuery } from "@tanstack/react-query";
import { fetchSevipTemporalCoverage } from "../../../api/endpoints/spatial/spatialDataAPI";

export const useSevipTemporalCovQuery = (radarID: number, options = {}) => {
    const queryKey = ["sevip_temporalcov", radarID];
    return useQuery<{start_time: string; end_time: string}>({
        queryKey,
        queryFn: async () => {
            try {
                return await fetchSevipTemporalCoverage({radarID});
            } catch (error) {
                console.error("Failed to fetch SEVIP temporal coverage ", error);
                throw error   
            }
        },
        staleTime: 0,
        refetchOnWindowFocus: false,
        refetchInterval: false,

        ...options,
    })
}