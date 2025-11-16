import { useQuery } from "@tanstack/react-query";
import { fetchRadarGifAnim } from "../../../../api/endpoints/spatial/spatialGifAnimAPI";
import type { RadarPayload, SpatialDataResponse } from "../../../../api/endpoints/spatial/spatialDataAPI";


export const useRadarGifDataQuery = (payload: RadarPayload, enabled?: boolean) => {
    return useQuery<SpatialDataResponse>({
      queryKey: [
        "radar_dataGif",
        payload.parameter,
        payload.startTime,
        payload.endTime,
        payload.type,
        payload.colorbar,
      ],
      queryFn: async () => {
        try {
          return await fetchRadarGifAnim(payload);
        } catch (error) {
          console.error("Failed to fetch Radar Gif anim", error, "sent payload:", payload);
          throw error;
        }
      },
      enabled: (enabled ?? true),
      staleTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false
    });
};