import { useAppSelector } from "../../../store/hooks";
import { useSevipVcrossDataQuery } from "../useQuery/useVcrossSevipOverlayQuery";

export function useVcrossSevipOverlayData(enabled?: boolean) {
    const payload = useAppSelector(state => state.vcrossmap.vcrossSevipOvrlayPayload);
    const query = useSevipVcrossDataQuery(payload, enabled);
    return query;
}