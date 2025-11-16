import { useQuery } from "@tanstack/react-query";
import { fetchRadarGifAnim } from "../../../../api/endpoints/spatial/spatialGifAnimAPI";
import type { RadarPayload, SpatialDataResponse } from "../../../../api/endpoints/spatial/spatialDataAPI";


export const useRadarGifDataQuery = (payload: RadarPayload, enabled?: boolean) => {
  const queryKey =
  payload.type === "grid"
    ? [
        "radar_gif_data",
        payload.type,
        payload.parameter,
        payload.startTime,
        payload.endTime,
        payload.colorbar,
        payload.height,
      ]
    : [
        "radar_gif_data",
        payload.type,
        payload.parameter,
        payload.startTime,
        payload.endTime,
        payload.colorbar,
        payload.elevation_angle,
      ];
    return useQuery<SpatialDataResponse>({
      queryKey,
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