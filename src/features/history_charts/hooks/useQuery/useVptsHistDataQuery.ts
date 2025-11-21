import { useQuery } from "@tanstack/react-query";
import { fetchVPTS, type VptsPayload, type VptsResponse } from "../../../../api/endpoints/verical_profile/verticalProfilesAPI";

export const useVptsHistDataQuery = (payload: VptsPayload, enabled?: boolean) => {
    return useQuery<VptsResponse>({
        queryKey: ["vptshist_data", payload.startTime, payload.endTime, payload.parameter, payload.species],
        queryFn: async () => {
            try {
                return await fetchVPTS(payload);
            } catch (error) {
                console.error('Failed to fetch VPTShist data', payload, 'error: ', error);
                throw error;
            }
        },
        enabled: Boolean(payload.parameter && payload.startTime && payload.endTime && payload.species) && (enabled ?? true),
        staleTime: 1000 * 60 * 30,
        refetchOnWindowFocus: false,
    })
}