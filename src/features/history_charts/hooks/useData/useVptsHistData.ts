import { useAppSelector } from "../../../../store/hooks";
import { useVptsHistDataQuery } from "../useQuery/useVptsHistDataQuery";


export function useVptsHistData(enabled?: boolean) {
    const payload = useAppSelector((state) => state.vpts_histchart.vptsPayload);
    const query = useVptsHistDataQuery(payload, enabled);
    return query;
}