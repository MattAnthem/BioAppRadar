import { useQuery } from "@tanstack/react-query";
import { fetchVP, type VpPayload, type VpResponse } from "../../../../api/endpoints/verical_profile/verticalProfilesAPI";

export const useVpHistDataQuery = (payload: VpPayload) => {
    return useQuery<VpResponse>({
        queryKey: ["vphist_data", payload.time, payload.parameter, payload.species],
        queryFn: async () => {
            try {
                return await fetchVP(payload);
            } catch (error) {
                console.error('Failed to fetch VPhist data', error, payload);
                throw error;
            }
        },
        enabled: Boolean(payload.parameter && payload.time && payload.species),
        refetchOnWindowFocus: false,
        refetchInterval: 1000*60*5,
    })
}