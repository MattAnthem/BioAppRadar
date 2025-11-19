import { useQuery } from "@tanstack/react-query";
import { fetchClassificationData, type ClassificationDataPayload, type ClassificationDataResponse } from "../../../../api/endpoints/spatial/classificationAPI";

export const useClassificationDataQuery = (payload: ClassificationDataPayload) => {

    const key = ["classification_data", payload.time, payload.class, payload.color_0, payload.color_1, payload.height];
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
        refetchOnWindowFocus: false,
        staleTime: Infinity,
        gcTime: 1000 * 60 * 60,
    });
    
}