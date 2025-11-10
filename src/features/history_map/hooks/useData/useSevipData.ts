import { useAppSelector } from "../../../../store/hooks";
import { useSevipHistDataQuery } from "../useQuery/useSevipHistDataQuery";

export function useSevipData (enabled?: boolean) {
    const payload = useAppSelector(state=> state.historymap.sevipPayloadHist);
    const query = useSevipHistDataQuery(payload, enabled);
    return query;
}