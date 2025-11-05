import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchRadarData, type RadarPayload } from "../../../../api/endpoints/spatialDataAPI";

export const usePreloadRadarFrames = (
  frames: string[],
  colorbar: string,
  payload: RadarPayload,
  options?: { enabled?: boolean },
) => {
  const queryClient = useQueryClient();
  const enabled = options?.enabled ?? true;

  useEffect(() => {
    if (!frames.length || !enabled) return;

    const preloadSequentially = async () => {
      for (const time of frames) {
        const queryKey = ["radar_data", payload.parameter, time, payload.type, colorbar];
        await queryClient.prefetchQuery({
          queryKey,
          queryFn: () => fetchRadarData({ ...payload, time }),
          staleTime: 1000 * 60 * 30,
        });
      }
    };

    preloadSequentially();
  }, [colorbar, enabled, frames, payload]);
};



