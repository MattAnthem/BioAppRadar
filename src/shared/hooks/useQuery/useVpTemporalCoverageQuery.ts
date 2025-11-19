import { useQuery } from "@tanstack/react-query";
import { fetchTemporalCoverage, type TemporalCovResponse } from "../../../api/endpoints/verical_profile/verticalProfilesAPI";

export const useVpTemporalCoverageQuery = ( radarID: number, enabled?: boolean) => {
    const queryKey = ["vp_temporalcov", radarID];
    return useQuery<TemporalCovResponse>({
        queryKey,
        queryFn: async () => {
            try {
                return await fetchTemporalCoverage({radarID});
            } catch (error) {
                console.error("Failed to fetch temporal coverage ", error);
                throw error
            }
        },
        staleTime: 1000 * 60 * 60 * 24,
        refetchOnWindowFocus: false,
        enabled,
    })
}