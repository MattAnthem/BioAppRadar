
import { useAppSelector } from "../../../../../store/hooks";
import { useVptsImageQuery } from "../useQuery/useVptsImageQuery";

export function useVptsHistImagaData(enabled?: boolean) {
    const payload = useAppSelector((state) => state.vpts_histchart.vptsPayload);
    const query = useVptsImageQuery(payload, enabled);
    return query;
}