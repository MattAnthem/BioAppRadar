import { useQuery } from "@tanstack/react-query";
import { fetchElevationAngles } from "../../../api/endpoints/spatialDataAPI";

export const useElevationsQuery = (enabled?: boolean) => {
    const queryKey = ["elevations"];
    return useQuery<number[]>({
        queryKey,
        queryFn: async () => {
            try {
                return await fetchElevationAngles();
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