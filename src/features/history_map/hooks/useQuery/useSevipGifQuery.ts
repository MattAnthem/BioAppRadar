import { useQuery } from "@tanstack/react-query";
import type { SevipPayload, SpatialDataResponse } from "../../../../api/endpoints/spatial/spatialDataAPI";
import { fetchSevipGifAnim } from "../../../../api/endpoints/spatial/spatialGifAnimAPI";

export const useSevipGifQuery = (payload: SevipPayload, enabled?: boolean) => {
    return useQuery<SpatialDataResponse>({
        queryKey: [
            "sevip_dataGif",
            payload.parameter,
            payload.startTime,
            payload.endTime,
            payload.colorbar,
        ],
        queryFn: async () => {
            try {
                return await fetchSevipGifAnim(payload);
            } catch (error) {
                console.error("Failed to fetch Sevip gif anim", error, "payload :", payload);
                throw error;
            }
        },
        enabled: enabled ?? true,
        staleTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false
    });
};