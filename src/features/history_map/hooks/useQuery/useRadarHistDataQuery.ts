import { useQuery } from "@tanstack/react-query";
import { fetchRadarData, type RadarPayload, type SpatialDataResponse } from "../../../../api/endpoints/spatial/spatialDataAPI";

export const useRadarHistDataQuery = (payload: RadarPayload, enabled?: boolean) => {
    const queryKey =
    payload.type === "grid"
      ? [
          "radar_hist_data",
          payload.type,
          payload.parameter,
          payload.time,
          payload.colorbar,
          payload.height,
        ]
      : [
          "radar_hist_data",
          payload.type,
          payload.parameter,
          payload.time,
          payload.colorbar,
          payload.elevation_angle,
        ];
      return useQuery<SpatialDataResponse>({
        queryKey,
        queryFn: async () => {
          try {
            return await fetchRadarData(payload);
          } catch (error) {
            console.error("Failed to fetch Radar Data", error, "sent payload:", payload);
            throw error;
          }
        },
        enabled: (enabled ?? true),
        staleTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false
      });
  };