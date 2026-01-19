import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { fetchClassificationData } from "../../../../api/endpoints/spatial/classificationAPI";

export const usePreloadClassificationFrames = (
  frames: string[],
  classType: string,
  color0: string,
  color1: string,
  height: number,
  radar_id?: number,
  options?: { enabled?: boolean }
) => {
  const queryClient = useQueryClient();
  const enabled = options?.enabled ?? true;

  const [isPreloading, setIsPreloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preloaded, setPreloaded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!frames.length || !enabled) return;

    let isCancelled = false;
    setIsPreloading(true);
    setProgress(0);
    setPreloaded({});

    const preloadSequentially = async () => {
      for (let i = 0; i < frames.length; i++) {
        const time = frames[i];
        if (isCancelled) break;

        await queryClient.prefetchQuery({
          queryKey: ["classification_data", time, classType, color0, color1, height, radar_id],
          queryFn: () =>
            fetchClassificationData({
              time,
              class: classType,
              color_0: color0,
              color_1: color1,
              height,
              radarID: radar_id,
            }),
          staleTime: Infinity,
          gcTime: 1000 * 60 * 60 * 24
        });

        setPreloaded(prev => ({ ...prev, [time]: true }))

        setProgress(Math.round(((i + 1) / frames.length) * 100));
      }

      if (!isCancelled) setIsPreloading(false);
    };

    preloadSequentially();

    return () => {
      isCancelled = true;
    };
  }, [classType, color0, color1, frames, height, enabled, queryClient, radar_id]);

  return { isPreloading, progress, preloaded  };
};
