import { useAppSelector } from "../../../../store/hooks";
import { useSevipDataQuery } from "../../../livemap/hooks/useQuery/useSevipQuery";

export function useSevipData (enabled?: boolean) {
    const payload = useAppSelector(state=> state.historymap.sevipPayloadHist);
    const query = useSevipDataQuery(payload, enabled);
    return query;
}