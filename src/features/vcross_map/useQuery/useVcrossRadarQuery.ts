import { useQuery } from "@tanstack/react-query";
import { fetchVcrossRadar, type CrossSectionRadarPayload, type CrossSectionRadarResponse } from "../../../api/endpoints/crossSectionAPI";

export const useVcrossRadarQuery = (payload: CrossSectionRadarPayload, enabled?: boolean) => {
    return useQuery<CrossSectionRadarResponse>({
        queryKey: [
            "vcross_radar",
            payload.parameter,
            payload.type,
            payload.startLat,
            payload.endLat,
            payload.startLon,
            payload.endLon,
            payload.time, 
            payload.segment
        ],
        queryFn: async () => {
            try {
                console.log("sent payload ", payload);
                return await fetchVcrossRadar(payload);
            } catch (error) {
                console.error('Failed to fetch vertical cross section Radar Data', error);
                throw error;
            }
        },
        enabled: (enabled ?? true) && 
                Boolean(
                    payload.parameter && 
                    payload.type &&
                    payload.startLat && 
                    payload.endLat &&
                    payload.startLon &&
                    payload.endLon &&
                    payload.time
                ),
        refetchOnWindowFocus: false
    })
}