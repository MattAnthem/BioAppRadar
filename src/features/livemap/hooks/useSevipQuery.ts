import { useQuery } from "@tanstack/react-query";
import { fetchSevip, type SevipResponse, type SevipPayload } from "../../../api/endpoints/spatialDataAPI";

export const useSevipDataQuery = (payload: SevipPayload) => {
    return useQuery<SevipResponse>({
        queryKey: ["sevip_data", payload.time, payload.parameter, payload.colorbar],
        queryFn: () => fetchSevip(payload),
        enabled: Boolean(payload.parameter && payload.colorbar && payload.time)
    });
}