import { useAppSelector } from "../../../../store/hooks";
import { useRadarDataQuery } from "../../../livemap/hooks/useQuery/useRadarDataQuery";

export function useRadarData(enabled?: boolean) {
    const payload = useAppSelector(state => state.historymap.radarPayloadHist);
    const query = useRadarDataQuery(payload, enabled);
    return query;
} 