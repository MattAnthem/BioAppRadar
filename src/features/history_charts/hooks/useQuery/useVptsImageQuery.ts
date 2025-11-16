import { useQuery } from "@tanstack/react-query";
import { fetchImageVPTS, type VptsPayload } from "../../../../api/endpoints/verical_profile/verticalProfilesAPI";

export const useVptsImageQuery = (payload: VptsPayload, enabled?: boolean) => {
    const key = ["vpts_image", payload.parameter, payload.startTime, payload.endTime];
    return useQuery({
        queryKey: key,
        queryFn: async () => {
            try {
                return await fetchImageVPTS(payload);
            } catch (error) {
                console.error('Failed to fetch VPTS image', error);
                throw error;
            }
        },
        enabled: (enabled ?? true),
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 30,
    });
}