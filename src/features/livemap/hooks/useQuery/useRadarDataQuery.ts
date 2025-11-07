import { useQuery } from "@tanstack/react-query";
import { fetchRadarData, type RadarPayload, type SpatialDataResponse } from "../../../../api/endpoints/spatialDataAPI";


export const useRadarDataQuery = (payload: RadarPayload, enabled?: boolean) => {
    return useQuery<SpatialDataResponse>({
      queryKey: [
        "radar_data",
        payload.parameter,
        payload.time,
        payload.type,
        payload.colorbar,
      ],
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
    });
};
  
  