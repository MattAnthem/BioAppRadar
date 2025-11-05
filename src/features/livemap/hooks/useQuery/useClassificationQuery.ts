import { useQuery } from "@tanstack/react-query";
import { type ClassificationDataResponse, type ClassificationDataPayload, fetchClassificationData } from "../../../../api/endpoints/classificationAPI";

export const useClassificationDataQuery = (payload: ClassificationDataPayload, enabled?: boolean) => {
    const key = ["classification_data", payload.class, payload.time, payload.color_0, payload.color_1, payload.height];
    console.log("Querying classif frames")
    return useQuery<ClassificationDataResponse>({
        queryKey: key,
        queryFn: async () => {
            try {
                return await fetchClassificationData(payload);
            } catch (error) {
                console.error('Failed to fetch Classification data');
                throw error;
            }
        },
        enabled: Boolean(payload.class && payload.time && payload.color_0 && payload.color_1 && payload.height) && (enabled ?? true),
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 30,
    });
}