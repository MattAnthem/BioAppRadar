import { useQuery } from "@tanstack/react-query";
import { fetchClassificationData, type ClassificationDataPayload, type ClassificationDataResponse } from "../../../api/endpoints/classificationAPI";

export const useVcrossClassificationOverlayQuery = (payload: ClassificationDataPayload, enabled?: boolean) => {
    const key = ["classification_data", payload.class, payload.time, payload.color_0, payload.color_1, payload.height];
    
    return useQuery<ClassificationDataResponse>({
        queryKey: key,
        queryFn: async () => {
            try {
                return await fetchClassificationData(payload);
            } catch (error) {
                console.error('Failed to fetch Classification data on VCROSS ', error);
                throw error;
            }
        },
        enabled: (enabled ?? true),
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 30,
    });
}