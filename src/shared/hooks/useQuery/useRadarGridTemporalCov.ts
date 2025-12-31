import { useQuery } from "@tanstack/react-query";
import { fetchGridRadarTemporalCoverage } from "../../../api/endpoints/spatial/spatialDataAPI";

export const useRadarGridTemporalCov = (radarID: number, options = {}) => {
    const queryKey = ["radar_grid_temporalcov", radarID];
    return useQuery<{start_time: string; end_time: string}>({
        queryKey,
        queryFn: async () => {
            try {
                return await fetchGridRadarTemporalCoverage({radarID});
            } catch (error) {
                console.error("Failed to fetch Radar Polar temporal coverage ", error);
                throw error;   
            }
        },
        staleTime: 0,
        refetchOnWindowFocus: false,
        refetchInterval: false,
        ...options,
    });
}