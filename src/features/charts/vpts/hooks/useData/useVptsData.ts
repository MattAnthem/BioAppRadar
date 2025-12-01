
import { useAppSelector } from "../../../../../store/hooks";
import { useVptsDataQuery } from "../useQuery/useVptsDataQuery";

export function useVptsData(enabled?: boolean) {
    const payload = useAppSelector((state) => state.vptschart.vptsPayload);
    const query = useVptsDataQuery(payload, enabled);
    return query;
}