import { useQuery } from "@tanstack/react-query";
import { type VpResponse, type VpPayload, fetchVP } from "../../../api/endpoints/verticalProfilesAPI";


export const useVpDataQuery = (payload: VpPayload) => {
    return useQuery<VpResponse>({
        queryKey: ["vp_data", payload.time, payload.parameter],
        queryFn: async () => {
            try {
                return await fetchVP(payload);
            } catch (error) {
                console.error('Failed to fetch VP data');
                throw error;
            }
        },
        enabled: Boolean(payload.parameter && payload.time),
        refetchOnWindowFocus: false,
        refetchInterval: 1000*60*5,
    })
}