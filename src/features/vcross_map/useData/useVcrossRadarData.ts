import { useAppSelector } from "../../../store/hooks";
import { useVcrossRadarQuery } from "../useQuery/useVcrossRadarQuery";


export function useVcrossRadarData(enabled?: boolean){
    const payload = useAppSelector(state => state.vcrossmap.vcrossRadarPayload);
    const query = useVcrossRadarQuery(payload, enabled);

    return query;
}