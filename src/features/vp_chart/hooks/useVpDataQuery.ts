import { useQuery } from "@tanstack/react-query";
import { type VpResponse, type VpPayload, fetchVP } from "../../../api/endpoints/verical_profile/verticalProfilesAPI";


export const useVpDataQuery = (payload: VpPayload, enabled?: boolean) => {
    return useQuery<VpResponse>({
        queryKey: ["vp_data", payload.time, payload.parameter, payload.species],
        queryFn: async () => {
            try {
                return await fetchVP(payload);
            } catch (error) {
                console.error('Failed to fetch VP data', error);
                throw error;
            }
        },
        enabled: Boolean(payload.parameter && payload.time && payload.species) && (enabled ?? true),
        refetchOnWindowFocus: false,
        refetchInterval: 1000*60*60,
    })
}