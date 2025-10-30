import { useQuery } from "@tanstack/react-query";
import { type VptsResponse, type VptsPayload, fetchVPTS } from "../../../api/endpoints/verticalProfilesAPI";


export const useVptsDataQuery = (payload: VptsPayload) => {
    return useQuery<VptsResponse>({
        queryKey: ["vpts_data", payload.startTime, payload.endTime, payload.parameter],
        queryFn: () => fetchVPTS(payload),
        enabled: Boolean(payload.parameter && payload.startTime && payload.endTime),
    })
}