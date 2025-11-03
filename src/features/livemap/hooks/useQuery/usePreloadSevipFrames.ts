import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react";
import { fetchSevip } from "../../../../api/endpoints/spatialDataAPI";

export const usePreloadSevipFrames = (
    frames: string[],
    parameter: string,
    colorbar: string
) => {

    const queryClient = useQueryClient();
    
    useEffect(() => {
      if (!frames.length) return;
    
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
    }, [colorbar, frames, parameter]);   

}