import { useAppSelector } from "../../../store/hooks";
import { useVcrossRadarOvrlayDataQuery } from "../useQuery/useVcrossRadarOverlayQuery";

export function useVcrossRadarOverlayData(enabled?: boolean) {
    const payload = useAppSelector(state => state.vcrossmap.vcrossRadarOvrlayPayload);
    const query = useVcrossRadarOvrlayDataQuery(payload, enabled);
    return query;
}