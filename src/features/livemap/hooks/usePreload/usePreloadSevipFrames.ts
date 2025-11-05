import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react";
import { fetchSevip } from "../../../../api/endpoints/spatialDataAPI";

export const usePreloadSevipFrames = (
    frames: string[],
    parameter: string,
    colorbar: string,
    options?: { enabled?: boolean }
) => {

    const queryClient = useQueryClient();
    const enabled = options?.enabled ?? true
    
    useEffect(() => {
      if (!frames.length || !enabled) return;
    
      const preloadSequentially = async () => {
        for (const time of frames) {
          await queryClient.prefetchQuery({
            queryKey: ["sevip_data", parameter, colorbar, time],
            queryFn: () => fetchSevip({ time, parameter, colorbar }),
            staleTime: 1000 * 60 * 30,
          });
        }
      };
    
      preloadSequentially();
    }, [colorbar, frames, parameter,]);   

}