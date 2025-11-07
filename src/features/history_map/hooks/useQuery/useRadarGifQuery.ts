import { useQuery } from "@tanstack/react-query";
import {  type RadarPayload,  type SpatialDataResponse, } from "../../../../api/endpoints/spatialDataAPI";
import { fetchRadarGifAnim } from "../../../../api/endpoints/spatialGifAnimAPI";


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