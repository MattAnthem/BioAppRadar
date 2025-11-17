import { useQuery } from "@tanstack/react-query";
import type { ClassificationDataPayload, ClassificationDataResponse } from "../../../../api/endpoints/spatial/classificationAPI";
import { fetchClassificationAnim } from "../../../../api/endpoints/spatial/spatialGifAnimAPI";

export const useClassifGifQuery = (payload: ClassificationDataPayload, enabled?: boolean) => {
    const queryKey = [
        "classif_gif_data",
        payload.class,
        payload.startTime,
        payload.endTime,
        payload.color_0,
        payload.color_1,
        payload.height,
    ];
    return useQuery<ClassificationDataResponse>({
        queryKey,
        queryFn: async () => {
            try {
                return await fetchClassificationAnim(payload);
            } catch (error) {
                console.error('Failed to fetch classification gif anim ', error, ' payload sent : ', payload);
                throw error;
            }
        },
        enabled: enabled ?? true,
        staleTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
    });

}