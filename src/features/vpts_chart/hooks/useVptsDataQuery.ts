import { useQuery } from "@tanstack/react-query";
import { type VptsResponse, type VptsPayload, fetchVPTS } from "../../../api/endpoints/verticalProfilesAPI";


export const useVptsDataQuery = (payload: VptsPayload) => {
    return useQuery<VptsResponse>({
        queryKey: ["vpts_data", payload.startTime, payload.endTime, payload.parameter],
        queryFn: async () => {
            try {
                return await fetchVPTS(payload);
            } catch (error) {
                console.error('Failed to fetch VPTS data');
                throw error;
            }
        },
        enabled: Boolean(payload.parameter && payload.startTime && payload.endTime),
        refetchOnWindowFocus: false,
    })
}