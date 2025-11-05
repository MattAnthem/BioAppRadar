import { useAppSelector } from "../../../../store/hooks";
import { useRadarDataQuery } from "../useQuery/useRadarQuery";

export function useRadarData() {
    const payload = useAppSelector((state) => state.historymap.radarPayload);
    const query = useRadarDataQuery(payload);
    return query;
}