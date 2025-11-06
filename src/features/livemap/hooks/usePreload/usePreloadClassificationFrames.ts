import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchClassificationData } from "../../../../api/endpoints/classificationAPI";

export const usePreloadClassificationFrames = (
    frames: string[],
    classType: string,
    color0: string,
    color1: string,
    height: number,
    options?: { enabled?: boolean }
) => {
    const queryClient = useQueryClient();
    const enabled = options?.enabled ?? true;
    useEffect(() => {
      if (!frames.length || !enabled) return;
    
      const preloadSequentially = async () => {
        for (const time of frames) {
          await queryClient.prefetchQuery({
            queryKey: ["classification_data", classType, time,color0, color1, height],
            queryFn: () => fetchClassificationData({ time, class: classType, color_0: color0, color_1: color1, height }),
            staleTime: 1000 * 60 * 30,
          });
        }
      };
    
      preloadSequentially();
    }, [classType, color0, color1, frames, height, enabled]);
}