import { useQuery } from "@tanstack/react-query";
import {  type BoundaryPayload } from "../../../api/endpoints/spatial/boundariesAPI";

export const useBoundariesQuery = (payload: BoundaryPayload, enabled?: boolean) => {
    const key = ["boundary_data", payload.type, JSON.stringify(payload.json)];
    return useQuery<GeoJSON.FeatureCollection>({
        queryKey: key,
        queryFn: async () => {
            try {
                const mod = await import('../../../api/endpoints/spatial/boundariesAPI');
                return await mod.fetchBoundaryData(payload);
            } catch (error) {
                console.error('Failed to fetch Boundary data', error);
                throw error;
            }
        },
        enabled: (enabled ?? true),
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 60 * 24 * 30,
    });
}