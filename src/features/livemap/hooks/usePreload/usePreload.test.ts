import { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { fetchClassificationData, type ClassificationDataPayload } from "../../../../api/endpoints/spatial/classificationAPI";

type Options = {
  enabled?: boolean;
  concurrency?: number;
};

export const usePreloadTest = (
  frames: string[],
  payloadBase: Omit<ClassificationDataPayload, "time">,
  options: Options = { enabled: true, concurrency: 3 }
) => {
  const queryClient = useQueryClient();
  const { enabled = true, concurrency = 3 } = options;

  const [isPreloading, setIsPreloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (!enabled || !frames.length) return;

    cancelledRef.current = false;
    setIsPreloading(true);
    setProgress(0);

    const queue = frames.slice(); 
    let completed = 0;

    const worker = async () => {
      while (queue.length && !cancelledRef.current) {
        const time = queue.shift()!;
        const queryKey = ["classification_data", time, payloadBase.class, payloadBase.color_0, payloadBase.color_1, payloadBase.height];

        // Skip if already cached
        if (!queryClient.getQueryData(queryKey)) {
          try {
            const data = await fetchClassificationData({ ...payloadBase, time });
            // Ensure we have png + bounds before caching
            if (data?.data?.png && data?.data?.bounds) {
              queryClient.setQueryData(queryKey, data);
            }
          } catch (e) {
            console.error("Prefetch failed for time:", time, e);
          }
        }

        completed++;
        setProgress(Math.round((completed / frames.length) * 100));
      }
    };

    // Launch workers concurrently
    const workers = Array(Math.min(concurrency, frames.length))
      .fill(0)
      .map(() => worker());

    Promise.all(workers).finally(() => {
      if (!cancelledRef.current) setIsPreloading(false);
    });

    return () => {
      cancelledRef.current = true;
    };
  }, [frames, payloadBase.class, payloadBase.color_0, payloadBase.color_1, payloadBase.height, enabled, concurrency, queryClient]);

  return { isPreloading, progress };
};
