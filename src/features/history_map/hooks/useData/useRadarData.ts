import { useAppSelector } from "../../../../store/hooks";
import { useRadarHistDataQuery } from "../useQuery/useRadarHistDataQuery";

export function useRadarData(enabled?: boolean) {
    const payload = useAppSelector(state => state.historymap.radarPayloadHist);
    const query = useRadarHistDataQuery(payload, enabled);
    return query;
} 