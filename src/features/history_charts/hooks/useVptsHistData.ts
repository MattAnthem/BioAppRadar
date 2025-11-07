import { useAppSelector } from "../../../store/hooks";
import { useVptsDataQuery } from "../../vpts_chart/hooks/useVptsDataQuery";

export function useVptsHistData() {
    const payload = useAppSelector((state) => state.vpts_histchart.vptsPayload);
    const query = useVptsDataQuery(payload)
    return query;
}