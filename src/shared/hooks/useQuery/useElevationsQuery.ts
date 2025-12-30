import { useQuery } from "@tanstack/react-query";
import { fetchElevationAngles } from "../../../api/endpoints/spatial/spatialDataAPI";

export const useElevationsQuery = (radarID: number, enabled?: boolean) => {
    const queryKey = ["elevations"];
    return useQuery<number[]>({
        queryKey,
        queryFn: async () => {
            try {
                return await fetchElevationAngles({radarID: radarID});
            } catch (error) {
                console.error("Failed to fetch Elevations", error);
                throw error;
            }
        },
        staleTime: 1000 * 60 * 60 * 24,
        refetchOnWindowFocus: false,
        enabled: (enabled ?? true)
    });
};