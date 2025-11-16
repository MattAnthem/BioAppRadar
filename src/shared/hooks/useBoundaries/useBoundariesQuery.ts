import { useQuery } from "@tanstack/react-query";
import { fetchBoundaryData, type BoundaryPayload } from "../../../api/endpoints/spatial/boundariesAPI";

export const useBoundariesQuery = (payload: BoundaryPayload, enabled?: boolean) => {
    const key = ["boundary_data", payload.type, JSON.stringify(payload.json)];
    return useQuery<GeoJSON.FeatureCollection>({
        queryKey: key,
        queryFn: async () => {
            try {
                return await fetchBoundaryData(payload);
            } catch (error) {
                console.error('Failed to fetch Boundary data');
                throw error;
            }
        },
        enabled: (enabled ?? true),
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 60 * 24 * 30,
    });
}