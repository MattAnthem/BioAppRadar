import { useQuery } from "@tanstack/react-query";
import { fetchVPTS, type VptsPayload, type VptsResponse } from "../../../../api/endpoints/verticalProfilesAPI";

export const useVptsHistDataQuery = (payload: VptsPayload) => {
    return useQuery<VptsResponse>({
        queryKey: ["vptshist_data", payload.startTime, payload.endTime, payload.parameter],
        queryFn: async () => {
            try {
                return await fetchVPTS(payload);
            } catch (error) {
                console.error('Failed to fetch VPTShist data');
                throw error;
            }
        },
        enabled: Boolean(payload.parameter),
        staleTime: 1000 * 60 * 30,
        refetchOnWindowFocus: false,
    })
}