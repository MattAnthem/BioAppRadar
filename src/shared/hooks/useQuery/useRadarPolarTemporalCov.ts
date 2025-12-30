import { useQuery } from "@tanstack/react-query";
import { fetchPolarRadarTemporalCoverage } from "../../../api/endpoints/spatial/spatialDataAPI";

export const useRadarPolarTemporalCov = (radarID: number, options = {}) => {
    const queryKey = ["radar_polar_temporalcov", radarID];
    return useQuery<{start_time: string; end_time: string}>({
        queryKey,
        queryFn: async () => {
            try {
                // Simulate fetching data
                return await fetchPolarRadarTemporalCoverage({radarID});
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