import { useAppSelector } from "../../../../store/hooks";
import { useVptsHistDataQuery } from "../useQuery/useVptsHistDataQuery";


export function useVptsHistData() {
    const payload = useAppSelector((state) => state.vpts_histchart.vptsPayload);
    const query = useVptsHistDataQuery(payload);
    return query;
}