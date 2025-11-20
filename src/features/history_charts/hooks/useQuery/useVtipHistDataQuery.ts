import { useQuery } from "@tanstack/react-query";
import { fetchVTIP, type VtipPayload, type VtipResponse } from "../../../../api/endpoints/verical_profile/verticalProfilesAPI";

export const useVtipHistDataQuery = (payload: VtipPayload) => {
    return useQuery<VtipResponse>({
        queryKey: ["vtiphist_data", payload.startTime, payload.endTime, payload.parameter, payload.species, payload.species],
        queryFn: async () => {
            try{
                return await fetchVTIP(payload);
            } catch (error) {
                console.error('Failed to fetch VTPIhist data', payload, error);
                throw error;
            }
        },
        enabled: Boolean(payload.parameter && payload.startTime && payload.endTime && payload.species),
        staleTime: 1000 * 60 * 30,
        refetchOnWindowFocus: false,
    })
}