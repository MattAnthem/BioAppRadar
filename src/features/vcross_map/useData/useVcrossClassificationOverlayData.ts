import { useAppSelector } from "../../../store/hooks";
import { useVcrossClassificationOverlayQuery } from "../useQuery/useVcrossClassificationOverlayQuery";

export function useVcrossClassificationOverlayData(enabled?: boolean) {
    const payload = useAppSelector(state => state.vcrossmap.vcrossBioclassOvrlayPayload);
    const query = useVcrossClassificationOverlayQuery(payload, enabled);
    return query;
}