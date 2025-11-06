import { useAppSelector } from "../../../store/hooks";
import { useVcrossBioclassQuery } from "../useQuery/useVcrossBioclassQuery";


export function useVcrossBioclassData(enabled?: boolean){
    const payload = useAppSelector(state => state.vcrossmap.vcrossBioclassPayload);
    const query = useVcrossBioclassQuery(payload, enabled);
    return query;
}