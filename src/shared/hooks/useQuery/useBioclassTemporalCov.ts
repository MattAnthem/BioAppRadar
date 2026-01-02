import { useQuery } from "@tanstack/react-query";
import { fetchBioClassTemporalCoverage } from "../../../api/endpoints/crossSectionAPI";

export const useBioclassCovQuery = (radarID: number, options = {}) => {
    const queryKey = ["bioclass_temporalcov", radarID];
    return useQuery<{start_time: string; end_time: string}>({
        queryKey,
        queryFn: async () => {
            try {
                return await fetchBioClassTemporalCoverage({radarID});
            } catch (error) {
                console.error("Failed to fetch Bioclass temporal coverage ", error);
                throw error   
            }
        },
        staleTime: 0,
        refetchOnWindowFocus: false,
        refetchInterval: false,

        ...options,
    })
}